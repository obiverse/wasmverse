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
      const { uri } = await nostr.generateGateUri({ origin });

      await nostr.renderQR(canvas, uri, { scale: 4 });
      canvas.style.display = 'block';
      statusEl.textContent = 'Scan with OBIVERSE wallet…';

      if (isMobile) { openBtn.href = uri; openBtn.hidden = false; }

      const npub = await nostr.waitForGateAuth();

      statusEl.textContent = '✓ Connected';
      statusEl.style.color = 'var(--gold-bright)';
      setTimeout(() => { close(); onSuccess?.(npub); }, 700);

    } catch (err) {
      statusEl.textContent = err?.message || 'Connection failed — try again';
    }
  })();
}

/**
 * Show a wallet-agnostic Lightning payment dialog.
 * Renders a QR code + copyable address instead of opening lightning: URI directly.
 * Works with any Lightning wallet (mobile scan, desktop copy-paste, or URI handler).
 *
 * @param {string} [addr]  Lightning address (defaults to LIGHTNING_ADDR)
 */
export function showLightningDialog(addr = LIGHTNING_ADDR) {
  document.getElementById('lv-lightning-overlay')?.remove();

  const lnUri  = `lightning:${addr}`;
  const lnurlp = `https://lightningaddress.me/?address=${encodeURIComponent(addr)}`;

  const overlay = document.createElement('div');
  overlay.id = 'lv-lightning-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Support the Library');
  overlay.innerHTML = `
    <div class="lv-lightning-modal">
      <button class="lv-lightning-close" id="lv-lightning-close" aria-label="Close">&times;</button>
      <div class="lv-lightning-title">SUPPORT THE LIBRARY</div>
      <canvas class="lv-lightning-qr" id="lv-lightning-qr"></canvas>
      <div class="lv-lightning-addr-row">
        <span class="lv-lightning-addr" id="lv-lightning-addr">${addr}</span>
        <button class="lv-lightning-copy" id="lv-lightning-copy">Copy</button>
      </div>
      <p class="lv-lightning-sub">Scan with any Lightning wallet</p>
      <a class="lv-lightning-open" href="${lnUri}" id="lv-lightning-open">Open in wallet app ↗</a>
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

  // Copy button
  document.getElementById('lv-lightning-copy').addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(addr);
      this.textContent = '✓ Copied';
      setTimeout(() => { this.textContent = 'Copy'; }, 2000);
    } catch {
      this.textContent = 'Error';
    }
  });

  // Render QR (fire-and-forget)
  const canvas = document.getElementById('lv-lightning-qr');
  nostr.renderQR(canvas, lnUri, { scale: 4 })
    .then(() => { canvas.style.display = 'block'; })
    .catch(() => {});
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
