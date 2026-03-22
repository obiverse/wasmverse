/* ═══════════════════════════════════════════════════════════════════════
   PORTAL — Sovereign account panel for the Letterverse

   The iBooks account flow — your reading life made visible:

   Identity    — Nostr pubkey + relay status
   Journey     — letters read, books started, books completed
   Shelf       — all 33 books with CSS conic-gradient progress rings
   Relay       — attestations fetched from Nostr (KIND 30078)
   Patronage   — Lightning zap address
   Exit        — disconnect

   Data:
   IDB (local)  → letters read per book (fast, offline)
   Nostr relay  → attestations (authoritative, cross-device)
   ═══════════════════════════════════════════════════════════════════════ */

import * as idb   from './idb.js';
import * as nostr from './nostr-shell.js';
import { lnurlEncode, LIGHTNING_ADDR } from './connect.js';

let _manifest = null;

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Open the portal panel. Fetches data and renders before opening.
 * Wire the close + disconnect buttons before calling.
 */
export async function open() {
  if (!nostr.isConnected()) return;
  await _render();
  document.getElementById('portal-overlay').hidden = false;
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() =>
    document.getElementById('portal').classList.add('open')
  );
}

/**
 * Close the portal panel with slide-out animation.
 */
export function close() {
  document.getElementById('portal').classList.remove('open');
  setTimeout(() => {
    document.getElementById('portal-overlay').hidden = true;
    document.body.style.overflow = '';
  }, 320);
}

// ── Render ────────────────────────────────────────────────────────────────

async function _render() {
  // Manifest (fetched once, cached)
  if (!_manifest) {
    try {
      _manifest = await fetch('books/manifest.json').then(r => r.json());
    } catch { _manifest = { books: [] }; }
  }

  // ── Identity ──────────────────────────────────────────────────────────
  const display = nostr.getPubkeyDisplay() ?? (nostr.getPubkey()?.slice(0, 12) + '…');
  document.getElementById('portal-pubkey').textContent = display;

  const { relay, connected } = nostr.getRelayStatus();
  document.getElementById('portal-relay').textContent = relay.replace('wss://', '');
  document.getElementById('portal-relay-dot').classList.toggle('connected', connected);

  // ── Local stats (IDB) ─────────────────────────────────────────────────
  const allLetters   = await idb.getAllLettersRead();
  const lettersByBook = {};
  for (const l of allLetters) {
    (lettersByBook[l.bookId] = lettersByBook[l.bookId] || []).push(l);
  }
  document.getElementById('portal-stat-letters').textContent = allLetters.length;
  document.getElementById('portal-stat-started').textContent = Object.keys(lettersByBook).length;

  // ── Relay stats (attestations) ────────────────────────────────────────
  const records      = await nostr.fetchProgress().catch(() => []);
  const attestations = records.filter(r => r.t === 'letterverse-attestation');
  document.getElementById('portal-stat-completed').textContent = attestations.length;

  // ── Shelf ─────────────────────────────────────────────────────────────
  _renderShelf(lettersByBook, attestations);

  // ── Lightning QR ───────────────────────────────────────────────────────
  const qrCanvas = document.getElementById('portal-zap-qr');
  if (qrCanvas) {
    try {
      await nostr.renderQR(qrCanvas, lnurlEncode(LIGHTNING_ADDR), { scale: 3, light: 0xffffff });
      qrCanvas.style.display = 'block';
    } catch {}
  }

  // ── Attestations list ─────────────────────────────────────────────────
  const attestSection = document.getElementById('portal-attests-section');
  if (attestations.length > 0) {
    document.getElementById('portal-attests-list').innerHTML =
      attestations.map(a =>
        `<div class="portal-attest-item">◉ ${_esc(a.title || a.book)}</div>`
      ).join('');
    attestSection.hidden = false;
  } else {
    attestSection.hidden = true;
  }
}

function _renderShelf(lettersByBook, attestations) {
  const shelf = document.getElementById('portal-shelf');
  if (!shelf || !_manifest?.books?.length) return;
  shelf.innerHTML = '';

  const attestedIds = new Set(attestations.map(a => a.book));

  for (const book of _manifest.books) {
    const read  = (lettersByBook[book.id] || []).length;
    const total = book.letters || 1;
    const pct   = Math.min(100, Math.round((read / total) * 100));
    const done  = attestedIds.has(book.id);

    const tile = document.createElement('a');
    tile.href      = `read.html?book=${book.id}`;
    tile.className = 'portal-shelf-tile' + (done ? ' attested' : '');
    tile.title     = book.title;
    tile.innerHTML =
      `<div class="portal-ring" style="--pct:${pct}">` +
        `<div class="portal-ring-inner${done ? ' done' : ''}">${done ? '◉' : (pct > 0 ? pct + '%' : '')}</div>` +
      `</div>` +
      `<div class="portal-tile-id">${book.id}</div>`;
    shelf.appendChild(tile);
  }
}

function _esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
