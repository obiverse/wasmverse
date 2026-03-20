/* ═══════════════════════════════════════════════
   AFRICAN PATTERNS — Procedural ancestral art

   8 pattern families from across the continent.
   Zero textures. Pure mathematics. Infinite scale.

   Ported from Obiverse mobile (Dart CustomPainter)
   to Canvas2D for the Letterverse.
   ═══════════════════════════════════════════════ */

const GOLD = [201, 169, 110]; // fire-gold
const AMBER = [184, 134, 45]; // fire-amber
const DIM = [139, 94, 26];    // fire-dim
const EMBER = [160, 110, 32]; // fire-ember

// Seeded RNG for deterministic patterns
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Pattern 0: Bogolan (Malian Mudcloth) ────── */
function drawBogolan(ctx, w, h, opacity, seed) {
  const rng = seededRandom(seed);
  const spacing = 28 + Math.floor(rng() * 12);
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;

  ctx.lineWidth = 0.8;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing;
      const y = row * spacing;

      // Crosses at intersections
      const crossSize = 3 + rng() * 2;
      ctx.strokeStyle = `rgba(${DIM[0]},${DIM[1]},${DIM[2]},${opacity * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(x - crossSize, y);
      ctx.lineTo(x + crossSize, y);
      ctx.moveTo(x, y - crossSize);
      ctx.lineTo(x, y + crossSize);
      ctx.stroke();

      // Diamonds between rows (offset)
      if (row % 2 === 1 && col % 2 === 0) {
        const ds = 4 + rng() * 2;
        const dx = x + spacing / 2;
        const dy = y + spacing / 2;
        ctx.strokeStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${opacity * 0.35})`;
        ctx.beginPath();
        ctx.moveTo(dx, dy - ds);
        ctx.lineTo(dx + ds, dy);
        ctx.lineTo(dx, dy + ds);
        ctx.lineTo(dx - ds, dy);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  // Vertical accent lines
  ctx.strokeStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${opacity * 0.15})`;
  ctx.lineWidth = 0.4;
  for (let col = 0; col < cols; col += 3) {
    ctx.beginPath();
    ctx.moveTo(col * spacing, 0);
    ctx.lineTo(col * spacing, h);
    ctx.stroke();
  }
}

/* ── Pattern 1: Adinkra (Akan Sacred Symbols) ── */
function drawAdinkra(ctx, w, h, opacity, seed) {
  const rng = seededRandom(seed);
  const spacing = 44 + Math.floor(rng() * 10);
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + (row % 2) * spacing / 2;
      const y = row * spacing;
      const symbol = Math.floor(rng() * 4);

      ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${opacity * 0.4})`;
      ctx.lineWidth = 0.7;

      if (symbol === 0) {
        // Gye Nyame — circle with spiral
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 3; a += 0.15) {
          const r = 2 + a * 1.2;
          const px = x + Math.cos(a) * r;
          const py = y + Math.sin(a) * r;
          a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (symbol === 1) {
        // Dwennimmen — two mirrored spirals (ram's horns)
        for (const dir of [-1, 1]) {
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 2; a += 0.15) {
            const r = 2 + a * 1.5;
            const px = x + Math.cos(a) * r * dir * 0.6;
            const py = y + Math.sin(a) * r * 0.6 - 2;
            a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (symbol === 2) {
        // Sankofa — heart-like loop
        ctx.beginPath();
        ctx.moveTo(x, y + 6);
        ctx.bezierCurveTo(x - 8, y - 2, x - 4, y - 8, x, y - 4);
        ctx.bezierCurveTo(x + 4, y - 8, x + 8, y - 2, x, y + 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y - 5, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${opacity * 0.3})`;
        ctx.fill();
      } else {
        // Nea Onnim — nested squares
        for (let s = 3; s <= 7; s += 2) {
          ctx.strokeRect(x - s, y - s, s * 2, s * 2);
        }
      }
    }
  }

  // Connecting dot grid
  ctx.fillStyle = `rgba(${DIM[0]},${DIM[1]},${DIM[2]},${opacity * 0.15})`;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + spacing / 2;
      const y = row * spacing + spacing / 2;
      ctx.beginPath();
      ctx.arc(x, y, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ── Pattern 2: Kente (Asante Woven Strips) ──── */
function drawKente(ctx, w, h, opacity, seed) {
  const rng = seededRandom(seed);
  const stripWidth = 20 + Math.floor(rng() * 10);
  const strips = Math.ceil(w / stripWidth) + 1;
  const colors = [GOLD, AMBER, EMBER, DIM];

  for (let s = 0; s < strips; s++) {
    const x = s * stripWidth;
    const color = colors[s % colors.length];
    const cellH = stripWidth * (1.0 + rng() * 0.5);
    const cells = Math.ceil(h / cellH) + 1;
    const pattern = Math.floor(rng() * 3);

    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${opacity * 0.3})`;
    ctx.lineWidth = 0.5;

    // Strip border
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();

    for (let c = 0; c < cells; c++) {
      const cy = c * cellH;

      // Cell separator
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x + stripWidth, cy);
      ctx.stroke();

      if (pattern === 0) {
        // Diagonal hatching
        for (let d = 0; d < cellH + stripWidth; d += 4) {
          ctx.beginPath();
          ctx.moveTo(x + Math.min(d, stripWidth), cy + Math.max(0, d - stripWidth));
          ctx.lineTo(x + Math.max(0, d - cellH), cy + Math.min(d, cellH));
          ctx.stroke();
        }
      } else if (pattern === 1) {
        // X pattern
        ctx.beginPath();
        ctx.moveTo(x + 2, cy + 2);
        ctx.lineTo(x + stripWidth - 2, cy + cellH - 2);
        ctx.moveTo(x + stripWidth - 2, cy + 2);
        ctx.lineTo(x + 2, cy + cellH - 2);
        ctx.stroke();
      } else {
        // Chevron
        const mid = x + stripWidth / 2;
        for (let v = 0; v < cellH; v += 6) {
          ctx.beginPath();
          ctx.moveTo(x + 2, cy + v + 3);
          ctx.lineTo(mid, cy + v);
          ctx.lineTo(x + stripWidth - 2, cy + v + 3);
          ctx.stroke();
        }
      }
    }
  }
}

/* ── Pattern 3: Nsibidi (Igbo Ancient Script) ─── */
function drawNsibidi(ctx, w, h, opacity, seed) {
  const rng = seededRandom(seed);
  const spacing = 38 + Math.floor(rng() * 8);
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;

  ctx.strokeStyle = `rgba(${EMBER[0]},${EMBER[1]},${EMBER[2]},${opacity * 0.4})`;
  ctx.lineWidth = 0.8;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * spacing + (row % 2) * spacing * 0.5;
      const y = row * spacing;
      const sym = Math.floor(rng() * 5);

      if (sym === 0) {
        // Eye of awareness
        ctx.beginPath();
        ctx.ellipse(x, y, 7, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${EMBER[0]},${EMBER[1]},${EMBER[2]},${opacity * 0.3})`;
        ctx.fill();
      } else if (sym === 1) {
        // Bond/unity — overlapping circles
        ctx.beginPath();
        ctx.arc(x - 3, y, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 3, y, 5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (sym === 2) {
        // River path — wavy line
        ctx.beginPath();
        for (let t = -8; t <= 8; t += 0.5) {
          const px = x + t;
          const py = y + Math.sin(t * 0.8) * 3;
          t === -8 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (sym === 3) {
        // Star crossroads — 4-pointed
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = i * Math.PI / 2;
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(a) * 6, y + Math.sin(a) * 6);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Spiral — creation
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = a * 0.8;
          const px = x + Math.cos(a) * r;
          const py = y + Math.sin(a) * r;
          a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }
  }
}

/* ── Pattern 4: Savanna Silhouette ──────────── */
function drawSavanna(ctx, w, h, opacity, seed) {
  const rng = seededRandom(seed);

  // 3 rolling hill layers
  for (let layer = 0; layer < 3; layer++) {
    const baseY = h * (0.55 + layer * 0.12);
    const amp = 12 + rng() * 10;
    const freq = 0.006 + rng() * 0.01;
    const phase = rng() * Math.PI * 2;

    ctx.strokeStyle = `rgba(${DIM[0]},${DIM[1]},${DIM[2]},${opacity * (0.15 - layer * 0.03)})`;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = baseY + Math.sin(x * freq + phase) * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Acacia trees (1-3)
  const trees = 1 + Math.floor(rng() * 3);
  for (let t = 0; t < trees; t++) {
    const tx = w * (0.15 + rng() * 0.7);
    const ty = h * (0.55 + rng() * 0.15);
    const th = 20 + rng() * 15;
    const canopyW = 12 + rng() * 8;

    ctx.strokeStyle = `rgba(${DIM[0]},${DIM[1]},${DIM[2]},${opacity * 0.2})`;
    ctx.lineWidth = 0.8;

    // Trunk
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx, ty - th);
    ctx.stroke();

    // Umbrella canopy
    ctx.beginPath();
    ctx.moveTo(tx - canopyW, ty - th);
    ctx.bezierCurveTo(tx - canopyW * 0.5, ty - th - 8, tx + canopyW * 0.5, ty - th - 8, tx + canopyW, ty - th);
    ctx.stroke();
  }
}

/* ── Master Renderer ───────────────────────── */
const patterns = [drawBogolan, drawAdinkra, drawKente, drawNsibidi, drawSavanna];

export function drawAfricanBackground(ctx, w, h, time) {
  // Cycle through patterns slowly (each lasts ~30 seconds)
  // Use subtle crossfade between them
  const cycleDuration = 30;
  const totalDuration = cycleDuration * patterns.length;
  const t = (time / 1000) % totalDuration;
  const currentIndex = Math.floor(t / cycleDuration);
  const progress = (t % cycleDuration) / cycleDuration;

  // Base opacity with breathing
  const breathe = 0.04 + 0.015 * Math.sin(time * 0.0003);

  // Draw current pattern
  const fadeIn = Math.min(1, progress * 5);        // First 20% fading in
  const fadeOut = Math.min(1, (1 - progress) * 5);  // Last 20% fading out
  const alpha = fadeIn * fadeOut;

  patterns[currentIndex](ctx, w, h, breathe * alpha, currentIndex * 12345 + 42);

  // During crossfade, blend next pattern
  if (progress > 0.8) {
    const nextIndex = (currentIndex + 1) % patterns.length;
    const nextAlpha = (progress - 0.8) * 5; // 0→1 over last 20%
    patterns[nextIndex](ctx, w, h, breathe * nextAlpha, nextIndex * 12345 + 42);
  }
}
