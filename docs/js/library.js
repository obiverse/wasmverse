/* ═══════════════════════════════════════════════
   LIBRARY — Hub page logic
   Card rendering, sorting, filtering, canvas animations,
   3D tilt, continue banner, view transitions
   ═══════════════════════════════════════════════ */

import { boot, autoPersist, applyTheme, applyTypography } from '../euler-shell.js';

// Boot euler WASM — all state lives here now
const euler = await boot();

// Apply saved theme and typography immediately
applyTheme();
applyTypography();

// Bridge functions: euler replaces lib.js
function getProgress(bookId) {
  const pct = euler.get_book_progress_pct(bookId);
  const lastRead = euler.get_last_read(bookId);
  return {
    chaptersRead: Math.round(pct * 40),
    totalChapters: 40,
    lastRead: lastRead > 0 ? lastRead : null,
  };
}
function getLastReadBook() {
  const info = euler.get_continue_info();
  if (!info) return null;
  try {
    const p = JSON.parse(info);
    return { bookId: p.bookId, chaptersRead: p.chaptersRead, totalChapters: p.total, lastRead: Date.now() };
  } catch { return null; }
}

/* ═══════════════════════════════════════════════
   GLOBALS
   ═══════════════════════════════════════════════ */
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

/* ═══════════════════════════════════════════════
   FULL-SCREEN BACKGROUND — Interactive particle
   field with sacred geometry
   ═══════════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles
  const particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * 3000, y: Math.random() * 3000,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 0.4, alpha: Math.random() * 0.3 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function drawCircle(cx, cy, r, alpha) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(201,169,110,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  let frame = 0;
  function animate() {
    frame++;
    // Resize check for scrollHeight changes
    if (frame % 120 === 0) {
      const newH = document.documentElement.scrollHeight;
      if (Math.abs(h - newH) > 50) { h = canvas.height = newH; }
    }

    ctx.clearRect(0, 0, w, h);
    const t = frame * 0.003;
    const scrollY = window.scrollY;

    // Seed of Life in hero area (parallax)
    const hcx = w / 2, hcy = window.innerHeight * 0.4 - scrollY * 0.3;
    const r = Math.min(w, h > 0 ? window.innerHeight : 800) * 0.07;
    if (hcy > -r * 4 && hcy < window.innerHeight + r * 4) {
      // Breathing glow
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.6);
      const gr = ctx.createRadialGradient(hcx, hcy + scrollY, 0, hcx, hcy + scrollY, r * 3);
      gr.addColorStop(0, `rgba(201,169,110,${0.03 + breathe * 0.02})`);
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.fillRect(0, scrollY, w, window.innerHeight);

      const sy = hcy + scrollY;
      drawCircle(hcx, sy, r, 0.07);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI / 3) + t * 0.12;
        drawCircle(hcx + r * Math.cos(a), sy + r * Math.sin(a), r, 0.05);
      }
      // Second ring
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI / 3) + t * 0.12;
        const bx = hcx + r * Math.cos(a), by = sy + r * Math.sin(a);
        for (let j = -1; j <= 1; j += 2) {
          const a2 = a + j * Math.PI / 3;
          drawCircle(bx + r * Math.cos(a2), by + r * Math.sin(a2), r, 0.025);
        }
      }

      // Metatron lines
      const pts = [[hcx, sy]];
      for (let ring = 1; ring <= 2; ring++) {
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI / 3) + t * 0.08;
          pts.push([hcx + r * ring * 0.8 * Math.cos(a), sy + r * ring * 0.8 * Math.sin(a)]);
        }
      }
      ctx.lineWidth = 0.25;
      ctx.strokeStyle = `rgba(201,169,110,0.025)`;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          ctx.beginPath();
          ctx.moveTo(pts[i][0], pts[i][1]);
          ctx.lineTo(pts[j][0], pts[j][1]);
          ctx.stroke();
        }
      }
    }

    // Particles
    const mx = mouseX, my = mouseY + scrollY;
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.015;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

      // Mouse attraction (viewport coords)
      const dx = mx - p.x, dy = my - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 250 && dist > 0) {
        const f = 0.015 * (1 - dist/250);
        p.vx += (dx/dist)*f; p.vy += (dy/dist)*f;
      }
      p.vx *= 0.995; p.vy *= 0.995;

      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${a})`;
      ctx.fill();
    });

    // Connection lines
    ctx.lineWidth = 0.2;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx*dx + dy*dy;
        if (d2 < 15000) {
          ctx.strokeStyle = `rgba(201,169,110,${0.04*(1-d2/15000)})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════════════════
   ADINKRA SYMBOLS
   ═══════════════════════════════════════════════ */
const adinkraSVGs = {
  nsoromma: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="20" cy="20" r="8"/><line x1="20" y1="4" x2="20" y2="12"/><line x1="20" y1="28" x2="20" y2="36"/><line x1="4" y1="20" x2="12" y2="20"/><line x1="28" y1="20" x2="36" y2="20"/><line x1="8.7" y1="8.7" x2="14.3" y2="14.3"/><line x1="25.7" y1="25.7" x2="31.3" y2="31.3"/><line x1="31.3" y1="8.7" x2="25.7" y2="14.3"/><line x1="14.3" y1="25.7" x2="8.7" y2="31.3"/></svg>`,
  sankofa: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 6 C30 6 34 14 34 20 C34 28 28 34 20 34 C12 34 6 28 6 20"/><path d="M6 20 C6 14 10 10 14 10"/><circle cx="14" cy="10" r="2.5" fill="currentColor"/></svg>`,
  dwennimmen: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 8 C14 8 8 12 8 20 C8 24 10 26 14 26"/><path d="M20 8 C26 8 32 12 32 20 C32 24 30 26 26 26"/><path d="M20 32 C14 32 8 28 8 20"/><path d="M20 32 C26 32 32 28 32 20"/><line x1="20" y1="6" x2="20" y2="34"/></svg>`,
  ananse: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="20" cy="20" r="4"/><circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="16"/><line x1="20" y1="4" x2="20" y2="36"/><line x1="4" y1="20" x2="36" y2="20"/><line x1="8.7" y1="8.7" x2="31.3" y2="31.3"/><line x1="31.3" y1="8.7" x2="8.7" y2="31.3"/></svg>`,
  funtun: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M20 6 A14 14 0 0 1 20 34"/><path d="M20 6 A14 14 0 0 0 20 34"/><circle cx="20" cy="13" r="3"/><circle cx="20" cy="27" r="3"/></svg>`,
  fawohodie: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="20" cy="20" r="14"/><line x1="20" y1="6" x2="20" y2="34"/><line x1="6" y1="20" x2="34" y2="20"/><circle cx="20" cy="20" r="5"/><path d="M15 12 L20 6 L25 12"/><path d="M15 28 L20 34 L25 28"/><path d="M12 15 L6 20 L12 25"/><path d="M28 15 L34 20 L28 25"/></svg>`,
  matemasie: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M8 14 C8 10 12 8 16 8 C20 8 20 12 20 14 C20 12 20 8 24 8 C28 8 32 10 32 14 C32 18 28 20 20 20 C12 20 8 18 8 14Z"/><path d="M8 26 C8 22 12 20 16 20 C20 20 20 24 20 26 C20 24 20 20 24 20 C28 20 32 22 32 26 C32 30 28 32 20 32 C12 32 8 30 8 26Z"/><circle cx="14" cy="14" r="1.5" fill="currentColor"/><circle cx="26" cy="14" r="1.5" fill="currentColor"/><circle cx="14" cy="26" r="1.5" fill="currentColor"/><circle cx="26" cy="26" r="1.5" fill="currentColor"/></svg>`,
};

/* ═══════════════════════════════════════════════
   PER-CARD CANVAS — Unique animated pattern
   ═══════════════════════════════════════════════ */
function initCardCanvas(canvas, bookId, accent) {
  const ctx = canvas.getContext('2d');
  let w, h;
  let visible = false; // Only animate when card is on screen

  // Pause/resume based on visibility
  const visObs = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) animate(); // Restart loop when visible
  }, { rootMargin: '100px' });
  visObs.observe(canvas);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width * (window.devicePixelRatio || 1);
    h = canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }
  resize();

  // Parse accent color to RGB
  const temp = document.createElement('div');
  temp.style.color = accent;
  document.body.appendChild(temp);
  const rgb = getComputedStyle(temp).color.match(/\d+/g).map(Number);
  document.body.removeChild(temp);

  const cw = canvas.parentElement.offsetWidth;
  const ch = canvas.parentElement.offsetHeight;
  let frame = 0;

  function animate() {
    frame++;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const t = frame * 0.004;
    const cx = cw / 2, cy = ch / 2;

    if (bookId === 'wasm') {
      // Circuit/grid pattern
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.06)`;
      ctx.lineWidth = 0.5;
      const spacing = 24;
      for (let x = 0; x < cw; x += spacing) {
        const wave = Math.sin(t + x * 0.02) * 4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
        // Nodes
        for (let y = spacing/2; y < ch; y += spacing) {
          if (Math.sin(t * 2 + x * 0.1 + y * 0.1) > 0.7) {
            ctx.beginPath();
            ctx.arc(x, y + wave, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + 0.1 * Math.sin(t * 3 + x + y)})`;
            ctx.fill();
          }
        }
      }
      // Flowing data packets
      for (let i = 0; i < 8; i++) {
        const px = ((t * 30 + i * cw / 8) % cw);
        const lane = (i * spacing * 3 + spacing) % cw;
        const py = ch / 2 + Math.sin(t + i) * 20;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.4)`;
        ctx.fill();
      }
    } else if (bookId === 'rust') {
      // Crystalline/ownership pattern — interlocking rings
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2 / 5) + t * 0.15;
        const ox = cx + Math.cos(angle) * 40;
        const oy = cy + Math.sin(angle) * 20;
        const r = 25 + Math.sin(t + i) * 5;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.08 + 0.04 * Math.sin(t + i)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // Ownership arrows
        const ax = ox + r * Math.cos(t * 0.5 + i);
        const ay = oy + r * Math.sin(t * 0.5 + i);
        ctx.beginPath();
        ctx.arc(ax, ay, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.3)`;
        ctx.fill();
      }
      // Central lock symbol
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy - 5, 12, Math.PI, 0);
      ctx.stroke();
      ctx.strokeRect(cx - 14, cy - 5, 28, 20);
    } else if (bookId === 'bitcoin') {
      // Blockchain: linked blocks flowing left to right
      const blockW = 28, blockH = 18, gap = 14;
      const totalW = (blockW + gap) * 6;
      const startX = cx - totalW / 2 + ((t * 15) % (blockW + gap));
      ctx.lineWidth = 0.6;
      for (let i = -1; i < 7; i++) {
        const bx = startX + i * (blockW + gap);
        const by = cy - blockH / 2;
        // Block rectangle
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.1 + 0.05 * Math.sin(t * 2 + i)})`;
        ctx.strokeRect(bx, by, blockW, blockH);
        // Hash link to next block
        if (i < 6) {
          ctx.beginPath();
          ctx.moveTo(bx + blockW, cy);
          ctx.lineTo(bx + blockW + gap, cy);
          ctx.stroke();
          // Arrow head
          ctx.beginPath();
          ctx.moveTo(bx + blockW + gap - 3, cy - 2);
          ctx.lineTo(bx + blockW + gap, cy);
          ctx.lineTo(bx + blockW + gap - 3, cy + 2);
          ctx.stroke();
        }
        // Nonce sparks inside blocks
        const sparkX = bx + 5 + Math.sin(t * 8 + i * 3) * 8;
        const sparkY = cy + Math.cos(t * 6 + i * 2) * 4;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.2 + 0.15 * Math.sin(t * 5 + i)})`;
        ctx.fill();
      }
      // Floating hash fragments
      for (let i = 0; i < 10; i++) {
        const hx = cx + Math.sin(t * 0.7 + i * 1.1) * 80;
        const hy = cy + Math.cos(t * 0.5 + i * 0.9) * 30;
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.06)`;
        ctx.font = '6px monospace';
        ctx.fillText(((i * 0xABCD + frame) & 0xFFFF).toString(16), hx, hy);
      }
    } else if (bookId === 'pwa') {
      // Service worker interception: requests flow right, cache shield in center
      const shieldR = 22;
      // Shield circle (the service worker)
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.8);
      ctx.beginPath();
      ctx.arc(cx, cy, shieldR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.12 + breathe * 0.06})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Inner shield dot
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.2 + breathe * 0.15})`;
      ctx.fill();
      // Requests flowing inward from edges
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2 / 8) + t * 0.2;
        const progress = ((t * 0.8 + i * 0.4) % 1);
        const fromR = 70;
        const toR = shieldR + 4;
        const r = fromR - progress * (fromR - toR);
        const px = cx + Math.cos(angle) * r;
        const py = cy + Math.sin(angle) * r;
        const alpha = progress < 0.8 ? 0.3 * (1 - progress / 0.8) : 0;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.fill();
        // Trail
        const tr = r + 8;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        ctx.lineTo(cx + Math.cos(angle) * tr, cy + Math.sin(angle) * tr);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // Cached responses: orbiting dots inside the shield
      for (let i = 0; i < 5; i++) {
        const a = (i * Math.PI * 2 / 5) + t * 0.3;
        const orbitR = 12;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * orbitR, cy + Math.sin(a) * orbitR, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + 0.1 * Math.sin(t * 2 + i)})`;
        ctx.fill();
      }
    } else if (bookId === 'messages') {
      // Message relay network — nodes with flowing messages between them
      const nodes = [];
      for (let i = 0; i < 7; i++) {
        const a = (i * Math.PI * 2 / 7) + 0.3;
        const r = 35 + (i % 2) * 15;
        nodes.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
      }
      nodes.push({ x: cx, y: cy }); // central relay
      // Connection lines (web pattern)
      ctx.lineWidth = 0.4;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (Math.sqrt(dx*dx + dy*dy) < 70) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.06)`;
            ctx.stroke();
          }
        }
      }
      // Nodes (people/devices)
      for (let i = 0; i < nodes.length; i++) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i);
        const nr = i === nodes.length - 1 ? 4 : 2.5;
        ctx.beginPath();
        ctx.arc(nodes[i].x, nodes[i].y, nr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + pulse * 0.15})`;
        ctx.fill();
      }
      // Flowing message packets
      for (let i = 0; i < 5; i++) {
        const progress = ((t * 0.6 + i * 0.35) % 1);
        const from = nodes[i % nodes.length];
        const to = nodes[(i + 3) % nodes.length];
        const mx = from.x + (to.x - from.x) * progress;
        const my = from.y + (to.y - from.y) * progress;
        const alpha = Math.sin(progress * Math.PI) * 0.5;
        ctx.beginPath();
        ctx.arc(mx, my, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.fill();
      }
    } else if (bookId === 'making') {
      // Recursive fractal — the system explaining itself
      ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.08)`;
      ctx.lineWidth = 0.5;
      function drawRecursiveBox(x, y, w, h, depth) {
        if (depth <= 0 || w < 6) return;
        ctx.strokeRect(x, y, w, h);
        // Two child boxes inside (like code blocks in chapters)
        const pad = w * 0.1;
        const childW = (w - pad * 3) / 2;
        const childH = h * 0.6;
        drawRecursiveBox(x + pad, y + pad, childW, childH, depth - 1);
        drawRecursiveBox(x + pad * 2 + childW, y + pad, childW, childH, depth - 1);
      }
      const boxW = 60 + Math.sin(t * 0.3) * 5;
      const boxH = 40 + Math.cos(t * 0.4) * 3;
      drawRecursiveBox(cx - boxW/2, cy - boxH/2, boxW, boxH, 3);
      // Orbiting file icons (dots representing files)
      const files = ['index', 'read', 'sw', 'lib', 'manifest'];
      for (let i = 0; i < files.length; i++) {
        const a = (i * Math.PI * 2 / files.length) + t * 0.2;
        const orbitR = 50;
        const fx = cx + Math.cos(a) * orbitR;
        const fy = cy + Math.sin(a) * orbitR;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${0.15 + 0.1 * Math.sin(t + i)})`;
        ctx.fill();
        // Connection line to center
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.04)`;
        ctx.stroke();
      }
    } else {
      // Default: floating geometry
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI / 3) + t * 0.1;
        const r = 30;
        ctx.beginPath();
        ctx.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    if (visible) requestAnimationFrame(animate);
  }
  // Animation starts when IntersectionObserver detects visibility
}

/* ═══════════════════════════════════════════════
   READING PROGRESS — uses lib.js
   ═══════════════════════════════════════════════ */
function makeProgressRing(pct, accent, size) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const targetOffset = circ * (1 - pct);
  // Start at full offset (empty), animate to target on reveal
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
    <circle class="progress-arc" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${accent}" stroke-width="3"
      stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
      data-target="${targetOffset}"
      stroke-linecap="round" transform="rotate(-90 ${size/2} ${size/2})"
      style="transition:stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)"/>
  </svg>`;
}

/* ═══════════════════════════════════════════════
   CARD REVEAL ON SCROLL
   ═══════════════════════════════════════════════ */
function initCardReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '100px 0px 0px 0px', threshold: 0.01 });

  document.querySelectorAll('.book-card').forEach(card => observer.observe(card));

  // Fallback: if any card is still hidden after 2s, force reveal
  // (handles edge cases where observer doesn't fire)
  setTimeout(() => {
    document.querySelectorAll('.book-card:not(.revealed)').forEach(card => {
      card.classList.add('revealed');
    });
  }, 2000);
}

/* ═══════════════════════════════════════════════
   3D CARD TILT + HOLOGRAPHIC SHEEN
   ═══════════════════════════════════════════════ */
function init3DTilt() {
  document.querySelectorAll('.book-card').forEach(card => {
    const sheen = card.querySelector('.card-sheen');
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10; // ±5°
      const rotateX = (0.5 - y) * 10;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
      if (sheen) {
        sheen.style.setProperty('--sheen-x', (x * 100) + '%');
        sheen.style.setProperty('--sheen-y', (y * 100) + '%');
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ═══════════════════════════════════════════════
   CONTINUE READING BANNER
   ═══════════════════════════════════════════════ */
function initContinueBanner(manifest) {
  const last = getLastReadBook();
  if (!last) return;
  const book = manifest.books.find(b => b.id === last.bookId);
  if (!book) return;

  const pct = Math.round((last.chaptersRead / last.totalChapters) * 100);
  const banner = document.createElement('div');
  banner.className = 'continue-banner';
  banner.style.setProperty('--continue-accent', book.accent || '#c9a96e');
  banner.innerHTML = `
    <a href="read.html?book=${book.id}">
      <div class="continue-info">
        <div class="continue-label">Continue Reading</div>
        <div class="continue-title">${book.title}</div>
        <div class="continue-progress">Letter ${last.chaptersRead} of ${last.totalChapters} &middot; ${pct}% complete</div>
      </div>
      <div class="continue-arrow">&rarr;</div>
    </a>`;

  const section = document.querySelector('.books-section');
  section.parentNode.insertBefore(banner, section);
}

/* ═══════════════════════════════════════════════
   LIBRARY CONTROLS — Sort, Filter, View, Search
   ═══════════════════════════════════════════════ */
let allBooks = [];
let allManifest = null;

function initControls(manifest) {
  allManifest = manifest;
  allBooks = manifest.books.map(b => ({
    ...b,
    category: b.category || 'Other',
    progress: getProgress(b.id),
  }));

  const section = document.querySelector('.books-section');
  const sectionLabel = section.querySelector('.section-label');

  // Compute stats
  const totalLetters = manifest.books.reduce((s, b) => s + (b.letters || 0), 0);
  const categories = [...new Set(manifest.books.map(b => b.category || 'Other'))].sort();

  const controls = document.createElement('div');
  controls.className = 'library-controls';

  // Category filter buttons
  const catBtns = categories.map(c => {
    const count = manifest.books.filter(b => b.category === c).length;
    return `<button class="ctrl-btn" data-filter="${c}">${c} <span class="ctrl-count">${count}</span></button>`;
  }).join('');

  controls.innerHTML = `
    <div class="lib-stats">${manifest.books.length} treatises &middot; ${totalLetters} letters</div>
    <input type="search" class="lib-search" id="lib-search" placeholder="Search treatises... (or \u2318K for deep search)">
    <div class="ctrl-group ctrl-categories" id="filter-group">
      <button class="ctrl-btn active" data-filter="all">All <span class="ctrl-count">${manifest.books.length}</span></button>
      ${catBtns}
      <button class="ctrl-btn" data-filter="reading">Reading</button>
      <button class="ctrl-btn" data-filter="new">New</button>
    </div>
    <div class="ctrl-group" id="sort-group">
      <button class="ctrl-btn active" data-sort="default">Default</button>
      <button class="ctrl-btn" data-sort="title">A-Z</button>
      <button class="ctrl-btn" data-sort="recent">Recent</button>
      <button class="ctrl-btn" data-sort="progress">Progress</button>
    </div>
    <div class="ctrl-group" id="view-group">
      <button class="ctrl-btn active" data-view="grid" title="Grid view">&#9638;</button>
      <button class="ctrl-btn" data-view="list" title="List view">&#9776;</button>
    </div>`;

  sectionLabel.after(controls);

  // Sort handlers
  controls.querySelector('#sort-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    controls.querySelectorAll('#sort-group .ctrl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBooks(btn.dataset.sort, getCurrentFilter());
  });

  // Filter handlers
  controls.querySelector('#filter-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    controls.querySelectorAll('#filter-group .ctrl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderBooks(getCurrentSort(), btn.dataset.filter);
  });

  // View toggle
  controls.querySelector('#view-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-view]');
    if (!btn) return;
    controls.querySelectorAll('#view-group .ctrl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const grid = document.getElementById('books-grid');
    grid.classList.toggle('list-mode', btn.dataset.view === 'list');
  });

  // Search (simple text filter for now, WASM search in Phase 4)
  let searchTimeout;
  controls.querySelector('#lib-search').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const q = e.target.value.toLowerCase().trim();
      filterBySearch(q);
    }, 200);
  });
}

function getCurrentSort() {
  return document.querySelector('#sort-group .ctrl-btn.active')?.dataset.sort || 'default';
}
function getCurrentFilter() {
  return document.querySelector('#filter-group .ctrl-btn.active')?.dataset.filter || 'all';
}

function filterBySearch(query) {
  const cards = document.querySelectorAll('.book-card');
  cards.forEach(card => {
    if (!query) {
      card.style.display = '';
      return;
    }
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

function renderBooks(sortKey, filterKey) {
  let books = [...allBooks];

  // Filter
  if (filterKey === 'reading') {
    books = books.filter(b => b.progress.chaptersRead > 0 && b.progress.chaptersRead < b.letters);
  } else if (filterKey === 'new') {
    books = books.filter(b => !b.progress.chaptersRead);
  } else if (filterKey && filterKey !== 'all') {
    // Category filter
    books = books.filter(b => (b.category || 'Other') === filterKey);
  }

  // Sort
  if (sortKey === 'title') {
    books.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortKey === 'recent') {
    books.sort((a, b) => (b.progress.lastRead || 0) - (a.progress.lastRead || 0));
  } else if (sortKey === 'progress') {
    books.sort((a, b) => {
      const pa = b.letters > 0 ? b.progress.chaptersRead / b.letters : 0;
      const pb = a.letters > 0 ? a.progress.chaptersRead / a.letters : 0;
      return pa - pb;
    });
  }

  // Reorder DOM
  const grid = document.getElementById('books-grid');
  const cardMap = {};
  grid.querySelectorAll('.book-card').forEach(card => {
    const bookId = card.querySelector('.card-anim')?.dataset.book;
    if (bookId) cardMap[bookId] = card;
  });

  // Hide cards not in filtered set
  Object.values(cardMap).forEach(card => card.style.display = 'none');

  // Show and reorder
  books.forEach(book => {
    const card = cardMap[book.id];
    if (card) {
      card.style.display = '';
      grid.appendChild(card); // move to end = reorder
    }
  });
}

/* ═══════════════════════════════════════════════
   VIEW TRANSITIONS — Library → Reader
   ═══════════════════════════════════════════════ */
function initViewTransitions() {
  if (!document.startViewTransition) return;
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const href = card.getAttribute('href');
      document.startViewTransition(() => {
        window.location.href = href;
      });
    });
  });
}

/* ═══════════════════════════════════════════════
   LOAD LIBRARY
   ═══════════════════════════════════════════════ */
async function loadLibrary() {
  try {
    const res = await fetch('books/manifest.json');
    const manifest = await res.json();
    euler.load_manifest(JSON.stringify(manifest));
    const grid = document.getElementById('books-grid');

    // Clear skeleton placeholder cards
    grid.innerHTML = '';

    manifest.books.forEach((book, idx) => {
      const symbol = adinkraSVGs[book.symbol] || adinkraSVGs.nsoromma;
      const progress = getProgress(book.id);
      const pct = book.letters > 0 ? Math.min(progress.chaptersRead / book.letters, 1) : 0;
      const pctLabel = pct > 0 ? `${Math.round(pct * 100)}%` : 'New';

      const card = document.createElement('a');
      card.className = 'book-card';
      card.href = `read.html?book=${book.id}`;
      card.style.setProperty('--card-accent', book.accent || '#c9a96e');
      card.style.setProperty('--card-glow', (book.accent || '#c9a96e') + '18');
      card.style.transitionDelay = `${idx * 0.1}s`;

      card.dataset.category = book.category || 'Other';
      card.innerHTML = `
        <div class="card-sheen"></div>
        <div class="card-canvas-wrap">
          <canvas class="card-anim" data-book="${book.id}" data-accent="${book.accent || '#c9a96e'}"></canvas>
          <div class="progress-ring-wrap">
            ${makeProgressRing(pct, book.accent || '#c9a96e', 70)}
            <div class="progress-text">${pctLabel}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${book.title}</div>
          <div class="card-subtitle">${book.subtitle}</div>
          <p class="card-desc">${book.description}</p>
          <div class="card-meta">
            <strong>${book.letters}</strong> letters &middot;
            <strong>${book.parts}</strong> parts
            ${progress.lastRead ? `&middot; last read ${new Date(progress.lastRead).toLocaleDateString()}` : ''}
          </div>
          <div class="card-enter">
            ${pct > 0 && pct < 1 ? 'Continue Reading' : pct >= 1 ? 'Read Again' : 'Begin Reading'}
            <span class="arrow">&rarr;</span>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Init per-card canvases
    document.querySelectorAll('.card-anim').forEach(c => {
      initCardCanvas(c, c.dataset.book, c.dataset.accent);
    });

    // Init scroll reveal with progress ring animation
    initCardReveal();

    // Animate progress rings when cards are revealed
    setTimeout(() => {
      document.querySelectorAll('.progress-arc').forEach(arc => {
        arc.setAttribute('stroke-dashoffset', arc.dataset.target);
      });
    }, 400);

    // Init 3D tilt + holographic sheen
    init3DTilt();

    // Init continue reading banner
    initContinueBanner(manifest);

    // Init sort/filter/search controls
    initControls(manifest);

    // Init view transitions
    initViewTransitions();

  } catch (err) {
    document.getElementById('books-grid').innerHTML =
      `<p style="color:#8b3a3a;text-align:center;padding:2rem">Failed to load library: ${err.message}</p>`;
  }
}

loadLibrary();

