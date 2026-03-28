/* ═══════════════════════════════════════════════════════════════════════
   CONNECT — Inline sovereign identity overlay

   Shared by reader.js and community.js.
   Runs the full OBIVERSE GATE flow without navigating away from the page:
     1. generateGateUri()  — ephemeral keypair + nonce → deep link + QR
     2. renderQR()          — WASM pixel render, no JS library
     3. waitForGateAuth()   — relay listen for wallet's signed KIND 22242
     4. onSuccess(npub)     — caller updates its own UI

   Usage:
     import { openConnectOverlay } from './connect.js';
     openConnectOverlay({ onSuccess: npub => updateUI(npub) });
   ═══════════════════════════════════════════════════════════════════════ */

import * as nostr from './nostr-shell.js';

export const LIGHTNING_ADDR = 'letterverse@breez.tips';

// TestFlight invite link for the OBIVERSE wallet (iOS).
// Update this single constant when the App Store link is ready.
export const OBIVERSE_WALLET_URL = 'https://testflight.apple.com/join/GwwPuv4W';

// ── LNURL bech32 encoding ─────────────────────────────────────────────────
// Lightning Addresses resolve to LNURL-pay endpoints.
// The QR code must encode the bech32 LNURL, not "lightning:user@domain".
// "lightning:" prefix is for bolt11 invoices — wallets like MUUN reject it.
//
//   letterverse@breez.tips
//     → https://breez.tips/.well-known/lnurlp/letterverse
//     → bech32("lnurl", urlBytes)
//     → LNURL1DP68GURN8GHJ7…  (what goes in the QR)

const _CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const _GEN     = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

function _polymod(values) {
  let chk = 1;
  for (const v of values) {
    const b = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((b >> i) & 1) chk ^= _GEN[i];
  }
  return chk;
}

function _hrpExpand(hrp) {
  const out = [];
  for (const c of hrp) out.push(c.charCodeAt(0) >> 5);
  out.push(0);
  for (const c of hrp) out.push(c.charCodeAt(0) & 31);
  return out;
}

function _checksum(hrp, data) {
  const poly = _polymod(_hrpExpand(hrp).concat(data, [0,0,0,0,0,0])) ^ 1;
  return Array.from({length:6}, (_, i) => (poly >> (5 * (5 - i))) & 31);
}

function _to5bit(bytes) {
  // JavaScript bitwise ops are 32-bit signed. Without masking the accumulator,
  // it overflows after ~4 bytes and corrupts the bech32 output silently.
  // Fix: mask acc to only the remaining bits after each extraction.
  let acc = 0, bits = 0;
  const out = [];
  for (const b of bytes) {
    acc = ((acc << 8) | b) >>> 0;  // >>> 0 = treat as unsigned 32-bit
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      out.push((acc >>> bits) & 31);
    }
    acc &= (1 << bits) - 1;        // discard already-extracted high bits
  }
  if (bits > 0) out.push((acc << (5 - bits)) & 31);
  return out;
}

/**
 * Encode a Lightning Address as a bech32 LNURL string.
 * This is what wallets actually scan — not "lightning:user@domain".
 *
 * @param {string} addr  e.g. "letterverse@breez.tips"
 * @returns {string}     e.g. "LNURL1DP68GURN8GHJ7MR…"
 */
export function lnurlEncode(addr) {
  const [user, domain] = addr.split('@');
  const url   = `https://${domain}/.well-known/lnurlp/${user}`;
  const bytes = new TextEncoder().encode(url);
  const data  = _to5bit(bytes);
  const hrp   = 'lnurl';
  return (hrp + '1' + [...data, ..._checksum(hrp, data)].map(x => _CHARSET[x]).join('')).toUpperCase();
}

const OVERLAY_ID = 'lv-connect-overlay';

/**
 * Open the GATE connect overlay inline on the current page.
 *
 * @param {object}   opts
 * @param {Function} [opts.onSuccess]  Called with npub after successful auth
 * @param {string}   [opts.origin]     Origin label shown in wallet approval sheet
 */
export function openConnectOverlay({ onSuccess, origin = 'Letterverse' } = {}) {
  // Idempotent — remove any existing overlay first
  document.getElementById(OVERLAY_ID)?.remove();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // ── Build overlay ─────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Sign in with OBIVERSE');
  overlay.innerHTML = `
    <div class="lv-connect-modal">
      <button class="lv-connect-close" id="lv-connect-close" aria-label="Close">&times;</button>
      <div class="lv-connect-badge">◈ OBIVERSE</div>
      <div class="lv-connect-title">SIGN IN</div>
      <p class="lv-connect-sub">No password. No server.<br>Your sovereign key.</p>
      <canvas class="lv-connect-qr" id="lv-connect-qr"></canvas>
      <a class="lv-connect-open" id="lv-connect-open" href="#" hidden>Open OBIVERSE &nearr;</a>
      <p class="lv-connect-status" id="lv-connect-status">Generating&hellip;</p>
      <div class="lv-connect-get-wallet">
        <span class="lv-connect-get-label">Don&rsquo;t have the wallet?</span>
        <a class="lv-connect-get-link" href="${OBIVERSE_WALLET_URL}" target="_blank" rel="noopener">
          Get OBIVERSE on TestFlight &nearr;
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  const canvas   = document.getElementById('lv-connect-qr');
  const statusEl = document.getElementById('lv-connect-status');
  const openBtn  = document.getElementById('lv-connect-open');

  // ── Close ─────────────────────────────────────────────────────────────
  function close() {
    document.getElementById(OVERLAY_ID)?.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _onKey);
  }

  function _onKey(e) { if (e.key === 'Escape') close(); }

  document.getElementById('lv-connect-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', _onKey);

  // ── GATE flow ─────────────────────────────────────────────────────────
  (async () => {
    try {
      // If the page was killed mid-auth (iOS PWA), hasPendingAuth() is true.
      // Reuse the same ephemeral keypair + nonce so the wallet's already-
      // published KIND 22242 event can still be verified. Never generate a
      // new session in this case — the old nonce is gone from the wallet.
      let uri;
      if (nostr.hasPendingAuth()) {
        uri = nostr.getPendingUri(origin);
        statusEl.textContent = 'Reconnecting…';
      } else {
        ({ uri } = await nostr.generateGateUri({ origin }));
      }

      await nostr.renderQR(canvas, uri, { scale: 4 });
      canvas.style.display = 'block';
      if (!statusEl.textContent.includes('Reconnect')) {
        statusEl.textContent = 'Scan with OBIVERSE wallet…';
      }

      if (isMobile) { openBtn.href = uri; openBtn.hidden = false; }

      // On iOS, when the user taps "Open OBIVERSE" the browser goes to background.
      // When they return, update status so they know we're still verifying.
      const _onReturn = () => {
        if (document.visibilityState === 'visible' && statusEl.textContent.includes('Scan')) {
          statusEl.textContent = 'Verifying…';
        }
      };
      document.addEventListener('visibilitychange', _onReturn);

      let npub;
      try {
        npub = await nostr.waitForGateAuth();
      } finally {
        document.removeEventListener('visibilitychange', _onReturn);
      }

      statusEl.textContent = '✓ Connected';
      statusEl.style.color = 'var(--gold-bright)';
      setTimeout(() => { close(); onSuccess?.(npub); }, 700);

    } catch (err) {
      statusEl.textContent = err?.message || 'Connection failed — try again';
    }
  })();
}

// ── LNURL-pay: fetch bolt11 invoice from a Lightning Address ─────────────
// Two HTTP calls, fully client-side — no backend needed.
// Step 1: fetch metadata + callback from /.well-known/lnurlp/{user}
// Step 2: call callback?amount={msats} → get bolt11 invoice
// MUUN can scan the resulting bolt11 QR code.
async function _fetchBolt11(addr, sats) {
  const [user, domain] = addr.split('@');
  if (!user || !domain) throw new Error('Invalid address');

  let meta;
  try {
    const res = await fetch(`https://${domain}/.well-known/lnurlp/${user}`);
    if (res.status === 404) throw new Error(`Lightning address not found — verify ${addr} is active`);
    if (!res.ok) throw new Error(`Service error (${res.status}) — try again later`);
    meta = await res.json();
  } catch (e) {
    // TypeError = network failure or CORS block (browser policy, not an HTTP error)
    if (e instanceof TypeError) throw new Error(`Cannot reach ${domain} from browser — use a Lightning wallet app directly`);
    throw e;
  }

  if (!meta.callback) throw new Error('Invalid LNURL response — missing callback');
  const msats = sats * 1000;
  if (meta.minSendable && msats < meta.minSendable)
    throw new Error(`Min ${meta.minSendable / 1000} sats`);
  if (meta.maxSendable && msats > meta.maxSendable)
    throw new Error(`Max ${meta.maxSendable / 1000} sats`);

  let inv;
  try {
    inv = await fetch(`${meta.callback}?amount=${msats}`).then(r => r.json());
  } catch {
    throw new Error('Could not fetch invoice from callback — try again');
  }
  if (!inv.pr) throw new Error('No invoice in response');
  return inv.pr;
}

/**
 * Show a wallet-agnostic Lightning payment dialog.
 *
 * Layout:
 *   1. LNURL QR   — Phoenix, Breez, Zeus, Strike: scan directly
 *   2. Address    — copy and paste into any Lightning Address-aware wallet
 *   3. MUUN zone  — pick amount → fetch bolt11 via LNURL-pay → bolt11 QR
 *
 * MUUN only accepts bolt11 invoices. The LNURL-pay HTTP flow generates one
 * client-side in ~2 round trips. No backend server needed.
 *
 * @param {string} [addr]  Lightning address (defaults to LIGHTNING_ADDR)
 */
export function showLightningDialog(addr = LIGHTNING_ADDR) {
  document.getElementById('lv-lightning-overlay')?.remove();

  const lnurl = lnurlEncode(addr);
  const lnUri = `lightning:${addr}`;

  const overlay = document.createElement('div');
  overlay.id = 'lv-lightning-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Support the Library');
  overlay.innerHTML = `
    <div class="lv-lightning-modal">
      <button class="lv-lightning-close" id="lv-lightning-close" aria-label="Close">&times;</button>
      <div class="lv-lightning-title">SUPPORT THE LIBRARY</div>

      <!-- Section 1: LNURL QR — Phoenix, Breez, Zeus, Strike -->
      <div class="lv-lightning-qr-section">
        <canvas class="lv-lightning-qr" id="lv-lightning-qr"></canvas>
        <div class="lv-lightning-qr-label">Phoenix &middot; Breez &middot; Zeus &middot; Strike — scan QR</div>
      </div>

      <!-- Section 2: address copy -->
      <div class="lv-lightning-addr-block">
        <div class="lv-lightning-addr-text">${addr}</div>
        <button class="lv-lightning-copy-btn" id="lv-lightning-copy">&#9889;&ensp;Copy Address</button>
      </div>

      <!-- Section 3: MUUN — generate bolt11 invoice by amount -->
      <div class="lv-lightning-muun-section">
        <div class="lv-lightning-muun-label">MUUN — choose an amount to generate invoice</div>
        <div class="lv-lightning-muun-amts">
          <button class="lv-ln-amt" data-sats="21">21</button>
          <button class="lv-ln-amt" data-sats="210">210</button>
          <button class="lv-ln-amt" data-sats="2100">2100</button>
          <button class="lv-ln-amt" data-sats="21000">21k</button>
        </div>
        <p class="lv-lightning-muun-status" id="lv-muun-status"></p>
        <canvas class="lv-lightning-qr" id="lv-muun-qr" style="display:none;margin-top:0.4rem"></canvas>
        <button class="lv-lightning-copy-btn" id="lv-muun-copy" style="display:none;margin-top:0.4rem;font-size:0.7rem;padding:0.4rem 0.8rem">Copy Invoice</button>
      </div>

      <a class="lv-lightning-open-btn" href="${lnUri}" id="lv-lightning-open">Open in Wallet App ↗</a>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function close() {
    document.getElementById('lv-lightning-overlay')?.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', _onKey);
  }
  function _onKey(e) { if (e.key === 'Escape') close(); }
  document.getElementById('lv-lightning-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', _onKey);

  // Copy address button
  document.getElementById('lv-lightning-copy').addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(addr);
      this.innerHTML = '✓&ensp;Copied!';
      setTimeout(() => { this.innerHTML = '&#9889;&ensp;Copy Address'; }, 2000);
    } catch { this.textContent = 'Error'; }
  });

  // LNURL QR (Phoenix / Breez / Zeus / Strike)
  const qrCanvas = document.getElementById('lv-lightning-qr');
  nostr.renderQR(qrCanvas, lnurl, { scale: 4, light: 0xffffff })
    .then(() => { qrCanvas.style.display = 'block'; })
    .catch(() => {});

  // MUUN amount buttons — fetch bolt11 invoice via LNURL-pay
  let _bolt11 = null;
  const statusEl  = document.getElementById('lv-muun-status');
  const muunQr    = document.getElementById('lv-muun-qr');
  const muunCopy  = document.getElementById('lv-muun-copy');

  overlay.querySelectorAll('.lv-ln-amt').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sats = parseInt(btn.dataset.sats, 10);
      overlay.querySelectorAll('.lv-ln-amt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      statusEl.textContent = 'Fetching invoice…';
      muunQr.style.display = 'none';
      muunCopy.style.display = 'none';
      _bolt11 = null;
      try {
        _bolt11 = await _fetchBolt11(addr, sats);
        statusEl.textContent = `${sats} sats — scan or copy`;
        await nostr.renderQR(muunQr, _bolt11, { scale: 3 });
        muunQr.style.display = 'block';
        muunCopy.style.display = 'block';
      } catch (e) {
        statusEl.textContent = e.message || 'Could not fetch invoice';
      }
    });
  });

  muunCopy.addEventListener('click', async function() {
    if (!_bolt11) return;
    try {
      await navigator.clipboard.writeText(_bolt11);
      this.textContent = '✓ Copied';
      setTimeout(() => { this.textContent = 'Copy Invoice'; }, 2000);
    } catch { this.textContent = 'Error'; }
  });
}

/**
 * Wire all elements matching `selector` to open the Lightning dialog on click.
 * Prevents the default lightning: URI from launching (which opens Electrum on macOS).
 *
 * @param {string} [selector]  CSS selector (default: '[data-lightning]')
 */
export function wireLightningLinks(selector = '[data-lightning]') {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      showLightningDialog(el.dataset.lightning || LIGHTNING_ADDR);
    });
  });
}
