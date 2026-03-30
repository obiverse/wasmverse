/* ═══════════════════════════════════════════════
   SCROLL CERTIFICATE — Canvas-rendered completion credential

   Generates a beautiful A4 landscape certificate with
   sacred geometry, Adinkra border, reader name, path,
   books completed, and Nostr pubkey as verification.
   ═══════════════════════════════════════════════ */

const W = 1754;  // A4 landscape @150dpi
const H = 1240;
const GOLD = '#c9a96e';
const GOLD_DIM = '#8b6914';
const BG = '#0a0a14';
const TEXT = '#ddd5c4';
const TEXT_BRIGHT = '#f0e8d8';

/**
 * Generate a certificate PNG blob.
 * @param {Object} opts
 * @param {string} opts.pathName - e.g. "sovereign"
 * @param {string} opts.readerName - from Nostr profile or manual input
 * @param {Array}  opts.books - [{title, symbol, accent}]
 * @param {string} opts.pubkey - Nostr pubkey for verification
 * @param {string} opts.date - completion date string
 * @returns {Promise<Blob>} PNG blob
 */
export async function generateCertificate({ pathName, readerName, books, pubkey, date }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Sacred geometry border
  drawBorder(ctx);

  // Seed of Life watermark (center)
  drawSeedOfLife(ctx, W / 2, H / 2, 180, 'rgba(201,169,110,0.06)');

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = '600 28px Cormorant Garamond, Palatino, serif';
  ctx.fillText('THE EPISTOLARY LIBRARY', W / 2, 160);

  ctx.fillStyle = TEXT_BRIGHT;
  ctx.font = '700 52px Playfair Display, Palatino, serif';
  ctx.fillText('Scroll Certificate', W / 2, 230);

  // Path name
  ctx.fillStyle = GOLD;
  ctx.font = '600 32px Cormorant Garamond, Palatino, serif';
  const pathTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1) + "'s Path";
  ctx.fillText(pathTitle, W / 2, 310);

  // Divider
  drawDivider(ctx, W / 2 - 200, 340, 400);

  // Reader name
  ctx.fillStyle = TEXT_BRIGHT;
  ctx.font = '700 44px Playfair Display, Palatino, serif';
  ctx.fillText(readerName || 'Sovereign Reader', W / 2, 410);

  // Subtitle
  ctx.fillStyle = TEXT;
  ctx.font = '400 22px Crimson Pro, Georgia, serif';
  ctx.fillText('has completed the following treatises:', W / 2, 460);

  // Books list
  const cols = Math.min(books.length, 4);
  const colW = 380;
  const startX = W / 2 - (cols * colW) / 2 + colW / 2;
  const startY = 520;

  books.forEach((book, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * colW;
    const y = startY + row * 50;

    ctx.fillStyle = book.accent || GOLD;
    ctx.font = '600 20px Cormorant Garamond, Palatino, serif';
    ctx.fillText(book.title, x, y);
  });

  // Date
  const dateY = startY + Math.ceil(books.length / cols) * 50 + 40;
  ctx.fillStyle = GOLD_DIM;
  ctx.font = '400 18px JetBrains Mono, Consolas, monospace';
  ctx.fillText(date || new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }), W / 2, dateY);

  // Verification
  if (pubkey) {
    ctx.fillStyle = 'rgba(201,169,110,0.4)';
    ctx.font = '400 14px JetBrains Mono, Consolas, monospace';
    ctx.fillText(`Verified: ${pubkey.slice(0, 16)}\u2026${pubkey.slice(-8)}`, W / 2, H - 80);
  }

  // Footer
  ctx.fillStyle = 'rgba(201,169,110,0.3)';
  ctx.font = '400 14px Crimson Pro, Georgia, serif';
  ctx.fillText('obiverse.github.io/wasmverse', W / 2, H - 50);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

function drawBorder(ctx) {
  const m = 40; // margin
  const r = 12; // corner radius

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 2;

  // Outer border
  ctx.beginPath();
  ctx.roundRect(m, m, W - 2 * m, H - 2 * m, r);
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(m + 8, m + 8, W - 2 * (m + 8), H - 2 * (m + 8), r);
  ctx.stroke();

  // Corner Adinkra accents (simple diamond at each corner)
  const corners = [[m + 30, m + 30], [W - m - 30, m + 30], [m + 30, H - m - 30], [W - m - 30, H - m - 30]];
  ctx.fillStyle = GOLD;
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx + 8, cy);
    ctx.lineTo(cx, cy + 8);
    ctx.lineTo(cx - 8, cy);
    ctx.closePath();
    ctx.fill();
  });
}

function drawDivider(ctx, x, y, width) {
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();

  // Center diamond
  const cx = x + width / 2;
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(cx, y - 5);
  ctx.lineTo(cx + 5, y);
  ctx.lineTo(cx, y + 5);
  ctx.lineTo(cx - 5, y);
  ctx.closePath();
  ctx.fill();
}

function drawSeedOfLife(ctx, cx, cy, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Central circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // 6 surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}
