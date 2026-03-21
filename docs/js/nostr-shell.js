/* ═══════════════════════════════════════════════════════════════════════
   NOSTR-SHELL — Sovereign identity layer for the Letterverse

   WASM handles all cryptography (keys, NIP-44, Schnorr).
   This JS module handles the network: WebSocket relay, NIP-46 protocol.

   The flow:
     1. generateConnectUri()  — build obiverse://connect deep link + QR
     2. waitForConnect()      — subscribe on relay, await wallet approval
     3. request()             — send NIP-46 RPC (sign_event, 9s:read, etc.)

   Session persisted in IDB (nostr_session store). Silent reconnect on
   next page load — user sees "Connected ◉" without re-approving.

   Architecture:
     WASM  (nostr_wasm.js)  — all crypto: keygen, NIP-44, event signing
     JS    (this file)      — relay WebSocket, NIP-46 message protocol
     IDB   (idb.js)         — session persistence
   ═══════════════════════════════════════════════════════════════════════ */

import * as idb from './idb.js';

// ── Module state ──────────────────────────────────────────────────────────

let _wasm = null;     // loaded WASM exports
let _ws   = null;     // active WebSocket
let _session = null;  // {eph_nsec, eph_npub, bunker_npub, relay, user_npub}

// Map of reqId → {resolve, reject} for in-flight NIP-46 requests
const _pending = new Map();

// ── Boot ──────────────────────────────────────────────────────────────────

/**
 * Load the nostr WASM module. Safe to call multiple times — cached after
 * first load. Must be called before any other function.
 */
export async function boot() {
  if (_wasm) return;
  const { default: init, generate_keypair, pubkey_from_nsec,
          nip44_encrypt, nip44_decrypt, sign_event, random_hex,
          qr_pixels, qr_actual_size } =
    await import('../pkg/nostr-wasm/nostr_wasm.js');
  await init('../pkg/nostr-wasm/nostr_wasm_bg.wasm');
  _wasm = { generate_keypair, pubkey_from_nsec,
            nip44_encrypt, nip44_decrypt, sign_event, random_hex,
            qr_pixels, qr_actual_size };
}

/**
 * Render `text` as a QR code onto a <canvas> element using WASM pixel rendering.
 * No JS QR library — pure Rust computation via WebAssembly.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} text
 * @param {object} opts  — scale (px per module, default 4), dark (0xRRGGBB), light (0xRRGGBB)
 */
export async function renderQR(canvas, text, { scale = 4, dark = 0x0a0a14, light = 0xfaf6f0 } = {}) {
  await boot();
  const size   = _wasm.qr_actual_size(text, scale);
  const pixels = _wasm.qr_pixels(text, scale, dark, light);
  canvas.width  = size;
  canvas.height = size;
  const ctx  = canvas.getContext('2d');
  const data = new ImageData(new Uint8ClampedArray(pixels), size, size);
  ctx.putImageData(data, 0, 0);
}

// ── Session API ───────────────────────────────────────────────────────────

export function isConnected() { return !!_session?.user_npub; }

/** The user's Nostr public key (hex), or null if not connected. */
export function getPubkey() { return _session?.user_npub ?? null; }

/** Short display string: first 8 + last 4 chars of npub. */
export function getPubkeyDisplay() {
  const p = getPubkey();
  if (!p) return null;
  return p.slice(0, 8) + '…' + p.slice(-4);
}

// ── Connection initiation ─────────────────────────────────────────────────

/**
 * Generate the connection URI and prepare to receive the wallet's response.
 *
 * Returns {uri, qrText} where:
 *   uri     — the full obiverse://connect?... deep link
 *   qrText  — same URI (for QR code rendering)
 *
 * After calling this, call waitForConnect() to wait for the wallet.
 * The ephemeral session is stored in IDB so this survives page refresh.
 */
export async function generateConnectUri({
  relay = 'wss://relay.damus.io',
  appName = 'Letterverse',
  callbackUrl = '',
} = {}) {
  await boot();

  // Generate ephemeral keypair for this connection session
  const keypair = JSON.parse(_wasm.generate_keypair());
  const reqId   = _wasm.random_hex(16);

  // Store pending session (no user_npub yet — filled in after handshake)
  _session = {
    eph_nsec:    keypair.nsec_hex,
    eph_npub:    keypair.npub_hex,
    bunker_npub: null,   // learned from wallet's ack event
    relay,
    user_npub:   null,
    req_id:      reqId,
  };
  await _saveSession();

  const params = new URLSearchParams({
    relay,
    pubkey: keypair.npub_hex,
    reqid:  reqId,
    app:    appName,
  });
  if (callbackUrl) params.set('callback', callbackUrl);

  const uri = `obiverse://connect?${params.toString()}`;
  return { uri, qrText: uri };
}

/**
 * Connect to the relay and wait for the wallet to send the NIP-46 ack.
 * Resolves with the user's npub when fully connected.
 *
 * Timeout: 5 minutes (long enough for the user to switch apps and approve).
 * Call generateConnectUri() before this.
 */
export async function waitForConnect(timeoutMs = 300_000) {
  if (!_session?.eph_nsec) throw new Error('Call generateConnectUri() first');
  await boot();

  await _connectRelay(_session.relay);
  _subscribeToSelf();

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Connection timeout — wallet did not respond'));
    }, timeoutMs);

    _pending.set(_session.req_id, {
      resolve: async (ack) => {
        clearTimeout(timer);
        // After ack we know bunker_npub (from the event sender).
        // Now request the actual user pubkey.
        try {
          const userNpub = await _getPublicKey();
          _session.user_npub = userNpub;
          await _saveSession();
          resolve(userNpub);
        } catch (e) {
          reject(e);
        }
      },
      reject: (err) => { clearTimeout(timer); reject(err); },
    });
  });
}

/**
 * Attempt to restore a previous session from IDB and reconnect.
 * Returns the user npub if restored, null otherwise.
 */
export async function restoreSession() {
  try {
    await boot();
    const saved = await idb.loadNostrSession();
    if (!saved?.user_npub) return null;

    _session = saved;

    // Reconnect to relay silently (for 9S operations later)
    await _connectRelay(_session.relay).catch(() => {});
    if (_ws?.readyState === WebSocket.OPEN) _subscribeToSelf();

    return _session.user_npub;
  } catch { return null; }
}

/**
 * Clear the session (sign out).
 */
export async function disconnect() {
  _session = null;
  _ws?.close();
  _ws = null;
  _pending.clear();
  await idb.clearNostrSession();
}

// ── NIP-46 RPC ────────────────────────────────────────────────────────────

/**
 * Send a NIP-46 RPC request to the connected bunker.
 * Returns the result string from the bunker.
 *
 * @param {string} method   — e.g. "sign_event", "get_public_key", "9s:read"
 * @param {Array}  params   — method parameters
 * @param {number} timeout  — ms to wait for response (default 60s)
 */
export async function request(method, params = [], timeoutMs = 60_000) {
  if (!isConnected()) throw new Error('Not connected to bunker');
  await _ensureRelay();

  const reqId   = _wasm.random_hex(16);
  const payload = JSON.stringify({ id: reqId, method, params });
  const content = _wasm.nip44_encrypt(
    _session.eph_nsec, _session.bunker_npub, payload
  );
  const tagsJson = JSON.stringify([['p', _session.bunker_npub]]);
  const event = JSON.parse(_wasm.sign_event(
    _session.eph_nsec, 24133, tagsJson, content
  ));

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      _pending.delete(reqId);
      reject(new Error(`NIP-46 request "${method}" timed out`));
    }, timeoutMs);

    _pending.set(reqId, {
      resolve: (result) => { clearTimeout(timer); resolve(result); },
      reject:  (err)    => { clearTimeout(timer); reject(err); },
    });

    _sendEvent(event).catch(reject);
  });
}

/**
 * Convenience: request sign_event. Returns the signed event JSON string.
 * `eventObj` — unsigned Nostr event (kind, tags, content; pubkey/created_at
 *              will be set by the bunker).
 */
export async function signEvent(eventObj) {
  const result = await request('sign_event', [JSON.stringify(eventObj)]);
  return result;
}

/**
 * Convenience: read a 9S scroll path from the wallet.
 * Returns parsed data or null.
 */
export async function scrollRead(path) {
  try {
    const result = await request('9s:read', [{ path }]);
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch { return null; }
}

/**
 * Convenience: write a 9S scroll path in the wallet.
 * Fire-and-forget on the caller side; still awaited internally.
 */
export async function scrollWrite(path, data) {
  await request('9s:write', [{ path, data }]);
}

// ── Internal: relay management ────────────────────────────────────────────

async function _connectRelay(relayUrl) {
  if (_ws?.readyState === WebSocket.OPEN && _ws._relayUrl === relayUrl) return;
  _ws?.close();

  await new Promise((resolve, reject) => {
    const ws = new WebSocket(relayUrl);
    ws._relayUrl = relayUrl;
    ws.onopen  = () => { _ws = ws; resolve(); };
    ws.onerror = () => reject(new Error(`Cannot connect to relay: ${relayUrl}`));
    ws.onclose = () => { if (_ws === ws) _ws = null; };
    ws.onmessage = (e) => _handleRelayMessage(e.data);
  });
}

async function _ensureRelay() {
  if (_ws?.readyState === WebSocket.OPEN) return;
  await _connectRelay(_session.relay);
  _subscribeToSelf();
}

function _subscribeToSelf() {
  if (!_ws || !_session?.eph_npub) return;
  const subId = Math.random().toString(36).slice(2, 10);
  _ws.send(JSON.stringify([
    'REQ', subId,
    {
      kinds: [24133],
      '#p':  [_session.eph_npub],
      since: Math.floor(Date.now() / 1000) - 5,
    },
  ]));
}

async function _sendEvent(event) {
  await _ensureRelay();
  _ws.send(JSON.stringify(['EVENT', event]));
}

function _handleRelayMessage(raw) {
  let msg;
  try { msg = JSON.parse(raw); } catch { return; }
  if (!Array.isArray(msg) || msg[0] !== 'EVENT') return;

  const event = msg[2];
  if (!event?.content || event.kind !== 24133) return;

  // Learn bunker_npub from the first event we receive
  if (!_session.bunker_npub && event.pubkey) {
    _session.bunker_npub = event.pubkey;
    _saveSession();
  }

  let payload;
  try {
    const plaintext = _wasm.nip44_decrypt(
      _session.eph_nsec,
      event.pubkey,
      event.content,
    );
    payload = JSON.parse(plaintext);
  } catch { return; }

  const resolver = _pending.get(payload.id);
  if (!resolver) return;
  _pending.delete(payload.id);

  if (payload.error) {
    resolver.reject(new Error(payload.error));
  } else {
    resolver.resolve(payload.result);
  }
}

// ── Internal: handshake helpers ───────────────────────────────────────────

async function _getPublicKey() {
  const reqId   = _wasm.random_hex(16);
  const payload = JSON.stringify({ id: reqId, method: 'get_public_key', params: [] });
  const content = _wasm.nip44_encrypt(
    _session.eph_nsec, _session.bunker_npub, payload
  );
  const tagsJson = JSON.stringify([['p', _session.bunker_npub]]);
  const event = JSON.parse(_wasm.sign_event(
    _session.eph_nsec, 24133, tagsJson, content
  ));

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      _pending.delete(reqId);
      reject(new Error('get_public_key timed out'));
    }, 30_000);

    _pending.set(reqId, {
      resolve: (npub) => { clearTimeout(timer); resolve(npub); },
      reject:  (err)  => { clearTimeout(timer); reject(err); },
    });

    _sendEvent(event).catch(reject);
  });
}

// ── Internal: IDB session ─────────────────────────────────────────────────

async function _saveSession() {
  try { await idb.saveNostrSession(_session); } catch {}
}
