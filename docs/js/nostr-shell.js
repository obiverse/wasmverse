/* ═══════════════════════════════════════════════════════════════════════
   NOSTR-SHELL — Sovereign identity layer for the Letterverse

   Uses the OBIVERSE GATE flow (KIND 22242) — the same protocol the wallet
   already uses to authenticate with obiverse.net. No new wallet code needed.

   Flow:
     1. generateGateUri()   — build obiverse://gate deep link + QR
     2. waitForGateAuth()   — subscribe on relay, await wallet's signed event
     3. event.pubkey        — that IS the user's sovereign identity

   The wallet:
     - Scans the QR (or follows deep link)
     - Shows GateApprovalSheet: "Sign in to Letterverse as [mobi]"
     - After approval: publishes KIND 22242 with content NIP-44 encrypted to eph key
     - Plaintext: "obiverse.net::{nonce}"

   Session persisted in IDB. Silent reconnect on next page load.

   Architecture:
     WASM  (nostr_wasm.js)  — keygen, NIP-44 decrypt, QR pixels
     JS    (this file)      — relay WebSocket, GATE protocol
     IDB   (idb.js)         — session persistence
   ═══════════════════════════════════════════════════════════════════════ */

import * as idb from './idb.js';

// ── Module state ──────────────────────────────────────────────────────────

let _wasm    = null;   // loaded WASM exports
let _ws      = null;   // active WebSocket
let _session = null;   // {eph_nsec, eph_npub, nonce, relay, user_npub, mobi, profile}
let _gateResolve = null;
let _gateReject  = null;
// subId → { onEvent(ev), onEose() } for one-shot subscriptions
const _subCallbacks = new Map();

const RELAYS = [
  'wss://relay.primal.net',
  'wss://nos.lol',
  'wss://relay.nostr.band',
];

// ── Boot ──────────────────────────────────────────────────────────────────

/**
 * Load the nostr WASM module. Safe to call multiple times — cached after first load.
 */
export async function boot() {
  if (_wasm) return;
  const base = new URL('../pkg/nostr-wasm/', import.meta.url).href;
  const { default: init, generate_keypair, nip44_decrypt, sign_event,
          random_hex, qr_pixels, qr_actual_size } =
    await import(base + 'nostr_wasm.js');
  await init(base + 'nostr_wasm_bg.wasm');
  _wasm = { generate_keypair, nip44_decrypt, sign_event, random_hex, qr_pixels, qr_actual_size };
}

/**
 * Render `text` as a QR code onto a <canvas> element using WASM pixel rendering.
 * No JS QR library — pure Rust via WebAssembly.
 */
export async function renderQR(canvas, text, { scale = 4, dark = 0x0a0a14, light = 0xfaf6f0 } = {}) {
  await boot();
  const size = _wasm.qr_actual_size(text, scale);
  const pixels = _wasm.qr_pixels(text, scale, dark, light);
  canvas.width  = size;
  canvas.height = size;
  canvas.getContext('2d').putImageData(
    new ImageData(new Uint8ClampedArray(pixels), size, size), 0, 0
  );
}

// ── Session API ───────────────────────────────────────────────────────────

export function isConnected()     { return !!_session?.user_npub; }
export function getPubkey()       { return _session?.user_npub ?? null; }
export function getMobi()         { return _session?.mobi ?? null; }
export function getProfile()      { return _session?.profile ?? null; }

/**
 * Best available display name, in priority order:
 *   mobi number → Nostr display_name/name → short pubkey
 */
export function getPubkeyDisplay() {
  if (_session?.mobi)            return _session.mobi;
  if (_session?.profile?.name)   return _session.profile.name;
  const p = getPubkey();
  return p ? p.slice(0, 8) + '…' + p.slice(-4) : null;
}

// ── GATE Auth ─────────────────────────────────────────────────────────────

/**
 * Generate a GATE challenge URI for the wallet to scan.
 *
 * Produces `obiverse://gate?relay=...&pubkey={eph_pub}&challenge={nonce}&origin=Letterverse`
 * which the wallet's existing GateScannerScreen and GateApprovalSheet handle natively.
 *
 * Returns { uri, qrText } — both the same string, ready for renderQR() and deep link.
 * Call waitForGateAuth() immediately after to start listening.
 */
export async function generateGateUri({ relay = RELAYS[0], origin = 'Letterverse' } = {}) {
  await boot();

  const keypair = JSON.parse(_wasm.generate_keypair());
  const nonce   = _wasm.random_hex(16);

  _session = {
    eph_nsec:  keypair.nsec_hex,
    eph_npub:  keypair.npub_hex,
    nonce,
    relay,
    user_npub: null,
  };
  await _saveSession();

  const params = new URLSearchParams({ relay, pubkey: keypair.npub_hex, challenge: nonce, origin });
  const uri = `obiverse://gate?${params}`;
  return { uri, qrText: uri };
}

/**
 * Connect to the relay and wait for the wallet to publish the KIND 22242 auth event.
 * Resolves with the user's pubkey (hex) once verified.
 *
 * Verification: decrypt event content with our eph_nsec + event.pubkey,
 * confirm plaintext is "obiverse.net::{nonce}".
 *
 * Timeout: 5 minutes — enough time to switch apps and approve.
 */
export async function waitForGateAuth(timeoutMs = 300_000) {
  if (!_session?.eph_nsec) throw new Error('Call generateGateUri() first');

  await _connectRelay(_session.relay);
  _subscribeForGate();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('Timeout — wallet did not respond'));
    }, timeoutMs);

    // ── iOS background fix ─────────────────────────────────────────────
    // When the user taps "Open OBIVERSE" on mobile, iOS suspends the browser
    // tab, killing the WebSocket. The wallet publishes KIND 22242 while we're
    // asleep. When the user switches back, reconnect and re-subscribe with a
    // 300-second lookback to catch the event we missed.
    const _onVisibility = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        await _connectRelay(_session.relay);
        _subscribeForGate(300);
      } catch {}
    };
    document.addEventListener('visibilitychange', _onVisibility);

    function cleanup() {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', _onVisibility);
      _gateResolve = null;
      _gateReject  = null;
    }

    _gateResolve = async (event) => {
      cleanup();
      try {
        // Decrypt and verify nonce — proves wallet holds the private key.
        // Payload: "obiverse.net::{nonce}" (legacy)
        //       or "obiverse.net::{nonce}::{mobi}" (bunker v2+)
        const plain  = _wasm.nip44_decrypt(_session.eph_nsec, event.pubkey, event.content);
        const parts  = plain.split('::');
        const prefix = parts[0];
        const nonce  = parts[1];
        const mobi   = parts[2] || null;   // optional mobi number from bunker

        if (prefix !== 'obiverse.net' || nonce !== _session.nonce) {
          throw new Error('Nonce mismatch — rejecting');
        }

        _session.user_npub = event.pubkey;
        if (mobi) _session.mobi = mobi;
        await _saveSession();

        // Background: fetch Nostr profile (KIND 0) for display name + avatar.
        // Fire-and-forget — never blocks auth resolution.
        _fetchAndCacheProfile(event.pubkey).catch(() => {});

        resolve(event.pubkey);
      } catch (e) {
        reject(e);
      }
    };

    _gateReject = (e) => {
      cleanup();
      reject(e);
    };
  });
}

/**
 * Attempt to restore a previous session from IDB.
 * Returns the user npub if restored, null otherwise. No relay reconnect needed.
 */
export async function restoreSession() {
  try {
    await boot();
    const saved = await idb.loadNostrSession();
    if (!saved?.user_npub) return null;
    _session = saved;
    // Refresh profile in background if we don't already have it cached
    if (!_session.profile) {
      _fetchAndCacheProfile(_session.user_npub).catch(() => {});
    }
    return _session.user_npub;
  } catch { return null; }
}

/**
 * Clear session (sign out).
 */
export async function disconnect() {
  _session = null;
  _ws?.close();
  _ws = null;
  _gateResolve = null;
  _gateReject  = null;
  await idb.clearNostrSession();
}

// ── Profile ───────────────────────────────────────────────────────────────

/**
 * Fetch KIND 0 (profile metadata) for a pubkey and cache in session.
 * Populates _session.profile = { name, picture, lud16, nip05, about }.
 * Called automatically after GATE auth and on session restore.
 */
async function _fetchAndCacheProfile(pubkey) {
  try {
    await _connectRelay(_session?.relay ?? RELAYS[0]).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return;

    const profile = await new Promise((resolve) => {
      const subId = Math.random().toString(36).slice(2, 10);
      const timer = setTimeout(() => { _subCallbacks.delete(subId); resolve(null); }, 5000);

      _subCallbacks.set(subId, {
        onEvent(ev) {
          clearTimeout(timer);
          _subCallbacks.delete(subId);
          try {
            const m = JSON.parse(ev.content || '{}');
            resolve({
              name:    m.display_name || m.name || null,
              picture: m.picture || null,
              lud16:   m.lud16 || null,
              nip05:   m.nip05 || null,
              about:   m.about || null,
            });
          } catch { resolve(null); }
        },
        onEose() { _subCallbacks.delete(subId); resolve(null); },
      });

      _ws.send(JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }]));
    });

    if (profile && _session) {
      _session.profile = profile;
      await _saveSession();
    }
  } catch {}
}

// ── Internal: relay ───────────────────────────────────────────────────────

async function _connectRelay(relayUrl) {
  if (_ws?.readyState === WebSocket.OPEN && _ws._relayUrl === relayUrl) return;
  _ws?.close();
  _ws = null;

  const candidates = [relayUrl, ...RELAYS.filter(r => r !== relayUrl)];
  let lastErr;
  for (const url of candidates) {
    try {
      await new Promise((resolve, reject) => {
        const ws = new WebSocket(url);
        ws._relayUrl = url;
        const t = setTimeout(() => reject(new Error('timeout')), 5000);
        ws.onopen    = () => { clearTimeout(t); _ws = ws; resolve(); };
        ws.onerror   = () => { clearTimeout(t); reject(new Error(`relay error: ${url}`)); };
        ws.onclose   = () => { if (_ws === ws) _ws = null; };
        ws.onmessage = (e) => _handleRelayMessage(e.data);
      });
      if (_session) { _session.relay = url; _saveSession(); }
      return;
    } catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error('All relays failed');
}

function _subscribeForGate(lookbackSeconds = 5) {
  if (!_ws || !_session?.eph_npub) return;
  const subId = Math.random().toString(36).slice(2, 10);
  _ws.send(JSON.stringify([
    'REQ', subId,
    {
      kinds: [22242],
      '#p':  [_session.eph_npub],
      since: Math.floor(Date.now() / 1000) - lookbackSeconds,
    },
  ]));
}

function _handleRelayMessage(raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }
  if (!Array.isArray(msg)) return;

  if (msg[0] === 'EVENT') {
    const subId = msg[1];
    const event = msg[2];
    if (!event) return;

    // Route to named subscription callback if registered
    const cb = _subCallbacks.get(subId);
    if (cb) { cb.onEvent?.(event); return; }

    // Default: GATE auth (KIND 22242)
    if (event.kind !== 22242 || !event.content || !event.pubkey) return;
    const challengeTag = event.tags?.find(t => Array.isArray(t) && t[0] === 'challenge');
    if (challengeTag?.[1] !== _session?.nonce) return;
    _gateResolve?.(event);

  } else if (msg[0] === 'EOSE') {
    const subId = msg[1];
    const cb = _subCallbacks.get(subId);
    if (cb) { cb.onEose?.(); _subCallbacks.delete(subId); }
  }
}

// ── Progress & Attestations ───────────────────────────────────────────────

/**
 * Publish a reading progress event to the relay.
 * Signed by the ephemeral key, tagged to the user's pubkey.
 * Fire-and-forget — failures are silent.
 */
export async function publishProgress(bookId, chapter, pct) {
  if (!_session?.user_npub || !_session?.eph_nsec) return;
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return;
    const event = JSON.parse(_wasm.sign_event(
      _session.eph_nsec, 30078,
      JSON.stringify([
        ['d', `letterverse/progress/${bookId}`],
        ['p', _session.user_npub],
        ['book', bookId],
        ['chapter', String(chapter)],
        ['pct', String(pct)],
        ['t', 'letterverse'],
      ]),
      ''
    ));
    _ws.send(JSON.stringify(['EVENT', event]));
  } catch {}
}

/**
 * Publish a book completion attestation to the relay.
 */
export async function publishAttestation(bookId, letterCount, bookTitle) {
  if (!_session?.user_npub || !_session?.eph_nsec) return;
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return;
    const event = JSON.parse(_wasm.sign_event(
      _session.eph_nsec, 30078,
      JSON.stringify([
        ['d', `letterverse/attestation/${bookId}`],
        ['p', _session.user_npub],
        ['book', bookId],
        ['title', bookTitle || bookId],
        ['letters', String(letterCount)],
        ['t', 'letterverse-attestation'],
        ['completed_at', String(Math.floor(Date.now() / 1000))],
      ]),
      ''
    ));
    _ws.send(JSON.stringify(['EVENT', event]));
  } catch {}
}

/**
 * Fetch all Letterverse progress/attestation records for the current user.
 * Returns array of tag-maps from KIND 30078 events.
 * Timeout: 5 seconds.
 */
export async function fetchProgress() {
  if (!_session?.user_npub) return [];
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return [];

    return new Promise((resolve) => {
      const results = [];
      const subId = Math.random().toString(36).slice(2, 10);
      const timer = setTimeout(() => {
        _subCallbacks.delete(subId);
        resolve(results);
      }, 5000);

      _subCallbacks.set(subId, {
        onEvent(ev) {
          if (!ev.tags) return;
          const tags = Object.fromEntries(ev.tags.map(t => [t[0], t[1]]));
          results.push(tags);
        },
        onEose() {
          clearTimeout(timer);
          resolve(results);
        },
      });

      _ws.send(JSON.stringify([
        'REQ', subId,
        { kinds: [30078], '#p': [_session.user_npub], '#t': ['letterverse'] },
      ]));
    });
  } catch { return []; }
}

// ── Publishing ────────────────────────────────────────────────────────────

/**
 * Publish a KIND 30023 long-form post to the relay.
 * Used by the community composer. Returns true on success.
 */
export async function publishPost(title, body, bookId) {
  if (!_session?.user_npub || !_session?.eph_nsec) return false;
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return false;
    const tags = [
      ['d',       `community/${Date.now()}`],
      ['title',   title || body.slice(0, 80)],
      ['summary', body.slice(0, 280)],
      ['p',       _session.user_npub],
      ['t',       'letterverse'],
      ['t',       'letterverse-community'],
      ['client',  'Letterverse'],
    ];
    if (bookId) tags.push(['t', `letterverse-${bookId}`]);
    const event = JSON.parse(_wasm.sign_event(_session.eph_nsec, 30023, JSON.stringify(tags), body));
    _ws.send(JSON.stringify(['EVENT', event]));
    return true;
  } catch { return false; }
}

/**
 * Publish a KIND 1 reply to another event.
 * Adds e (parent) and p (parent author) tags — standard NIP-10 reply.
 * Returns true on success.
 */
export async function publishReply(parentId, parentAuthorPubkey, content) {
  if (!_session?.user_npub || !_session?.eph_nsec) return false;
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return false;
    const tags = [
      ['e', parentId, '', 'reply'],
      ['p', parentAuthorPubkey],
      ['p', _session.user_npub],
      ['t', 'letterverse'],
      ['client', 'Letterverse'],
    ];
    const event = JSON.parse(_wasm.sign_event(_session.eph_nsec, 1, JSON.stringify(tags), content));
    _ws.send(JSON.stringify(['EVENT', event]));
    return true;
  } catch { return false; }
}

/**
 * Publish a KIND 1 note (short-form text note) to the relay.
 * Signed by the ephemeral key, tagged to the user's pubkey.
 * Used for sharing letter excerpts to the Nostr network.
 * Returns true on success, false on any error.
 */
export async function publishNote(content) {
  if (!_session?.user_npub || !_session?.eph_nsec) return false;
  try {
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState !== WebSocket.OPEN) return false;
    const event = JSON.parse(_wasm.sign_event(
      _session.eph_nsec, 1,
      JSON.stringify([
        ['p', _session.user_npub],
        ['t', 'letterverse'],
        ['client', 'Letterverse'],
      ]),
      content
    ));
    _ws.send(JSON.stringify(['EVENT', event]));
    return true;
  } catch { return false; }
}

/**
 * Return the active relay URL and current WebSocket connection state.
 * Used by the portal to display relay status.
 */
export function getRelayStatus() {
  return {
    relay:     _session?.relay ?? RELAYS[0],
    connected: _ws?.readyState === WebSocket.OPEN,
  };
}

// ── Internal: IDB ─────────────────────────────────────────────────────────

async function _saveSession() {
  try { await idb.saveNostrSession(_session); } catch {}
}
