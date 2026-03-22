/* ═══════════════════════════════════════════════
   READER — Reading experience logic
   Hero, sidebar, chapters, scrollspy, progress,
   demos, bookmarks, highlights, study, themes
   ═══════════════════════════════════════════════ */

import { boot, persist, autoPersist, applyTheme, applyTypography, sessionStart, sessionEnd, getReadingTimeMs } from '../euler-shell.js';
import * as idb from './idb.js';
import * as nostr from './nostr-shell.js';

// Boot euler WASM + restore nostr session (parallel — both are async)
const [euler] = await Promise.all([boot(), nostr.restoreSession()]);

// Bridge: ELib compatibility layer over euler
const ELib = {
  getTheme: () => euler.current_theme(),
  setTheme: (name) => { euler.set_theme(name); applyTheme(); autoPersist(); },
  applyTheme: () => applyTheme(),
  THEMES: { midnight: true, parchment: true, sepia: true, dawn: true },
  getTypography: () => ({ fontSize: euler.font_size(), lineHeight: euler.line_height_x10() / 10, contentMax: euler.content_width() }),
  setTypography: (s) => {
    if (s.fontSize !== undefined) euler.set_font_size(s.fontSize);
    if (s.lineHeight !== undefined) euler.set_line_height(Math.round(s.lineHeight * 10));
    if (s.contentMax !== undefined) euler.set_content_width(s.contentMax);
    applyTypography();
    autoPersist();
  },
  applyTypography: () => applyTypography(),
  isBookmarked: (book, ch) => euler.is_bookmarked(book, ch),
  toggleBookmark: (book, ch) => { const r = euler.toggle_bookmark(book, ch, Date.now()); autoPersist(); return r; },
  getBookmarks: (book) => JSON.parse(euler.get_bookmarks_json(book)),
  saveHighlight: (book, h) => { euler.add_highlight(book, h.chapterId, h.text, h.color, h.id || crypto.randomUUID(), h.timestamp || Date.now()); autoPersist(); return h.id; },
  removeHighlight: (book, id) => { euler.remove_highlight(book, id); autoPersist(); },
  getHighlights: (book) => JSON.parse(euler.get_highlights_json(book)),
  exportHighlightsMarkdown: (book, title) => euler.export_study_markdown(book, title),
};

/* ═══════════════════════════════════════════════
   STATE — All module-scoped state documented here
   ═══════════════════════════════════════════════ */
let chapters = [];           // Parsed chapter objects from markdown
let currentChapterIdx = 0;   // Index of the currently visible chapter
let mouseX = 0, mouseY = 0;  // Mouse position for canvas interactions
// Also: _scrollingTo (scrollspy guard), heroActive (hero scroll listener),
// currentBookId (book ID from URL), _chapterEls (cached DOM), _activeNavEl (cached nav)

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
});

/* ═══════════════════════════════════════════════
   HERO — Interactive particle field
   Mouse-reactive sacred geometry
   ═══════════════════════════════════════════════ */
// Respect prefers-reduced-motion
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initHero() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, stopped = false;
  const FPS_INTERVAL = 1000 / 20; // Throttle to 20fps (decorative, not interactive)
  let lastFrameTime = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle field — fewer on mobile for performance
  const particles = [];
  const PARTICLE_COUNT = window.innerWidth < 600 ? 30 : 60;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function drawCircle(cx, cy, r, alpha) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  function drawFlowerOfLife(cx, cy, r, alpha, rot) {
    drawCircle(cx, cy, r, alpha);
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI / 3) + rot;
      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      drawCircle(x, y, r, alpha);
      // Second ring
      for (let j = -1; j <= 1; j += 2) {
        const a2 = a + j * Math.PI / 3;
        drawCircle(x + r * Math.cos(a2), y + r * Math.sin(a2), r, alpha * 0.5);
      }
    }
  }

  function drawMetatron(cx, cy, r, alpha, rot) {
    const pts = [[cx, cy]];
    for (let ring = 1; ring <= 2; ring++) {
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI / 3) + rot;
        pts.push([cx + r * ring * Math.cos(a), cy + r * ring * Math.sin(a)]);
      }
    }
    ctx.strokeStyle = `rgba(201, 169, 110, ${alpha * 0.25})`;
    ctx.lineWidth = 0.35;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        ctx.beginPath();
        ctx.moveTo(pts[i][0], pts[i][1]);
        ctx.lineTo(pts[j][0], pts[j][1]);
        ctx.stroke();
      }
    }
    pts.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${alpha * 0.5})`;
      ctx.fill();
    });
  }

  function drawFractal(cx, cy, size, depth, alpha, rot) {
    if (depth <= 0 || size < 3) return;
    const pts = [];
    for (let i = 0; i < 3; i++) {
      const a = (i * 2 * Math.PI / 3) - Math.PI / 2 + rot;
      pts.push([cx + size * Math.cos(a), cy + size * Math.sin(a)]);
    }
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.forEach(p => ctx.lineTo(p[0], p[1]));
    ctx.closePath();
    ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      const mx = (pts[i][0] + pts[(i + 1) % 3][0]) / 2;
      const my = (pts[i][1] + pts[(i + 1) % 3][1]) / 2;
      drawFractal(mx, my, size * 0.45, depth - 1, alpha * 0.65, rot + 0.1);
    }
  }

  let frame = 0;
  function animate(timestamp) {
    if (stopped || reduceMotion) return;
    // Throttle to 20fps — decorative animation doesn't need 60fps
    if (timestamp - lastFrameTime < FPS_INTERVAL) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = timestamp;
    frame++;
    ctx.clearRect(0, 0, w, h);
    const t = frame * 0.004;
    const cx = w / 2, cy = h / 2;
    const r = Math.min(w, h) * 0.075;

    // Mouse influence on geometry
    const mdx = (mouseX - cx) / w;
    const mdy = (mouseY - cy) / h;
    const gx = cx + mdx * 30;
    const gy = cy + mdy * 30;

    // Breathing glow behind geometry
    const breathe = 0.5 + 0.5 * Math.sin(t * 0.8);
    const glowR = r * 3.5;
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
    grad.addColorStop(0, `rgba(201, 169, 110, ${0.04 + breathe * 0.03})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(gx - glowR, gy - glowR, glowR * 2, glowR * 2);

    // Central sacred geometry (reacts to mouse)
    drawFlowerOfLife(gx, gy, r, 0.14, t * 0.15);
    drawMetatron(gx, gy, r * 0.85, 0.1, -t * 0.12 + mdx * 0.3);

    // Corner fractals
    const cs = Math.min(w, h) * 0.11;
    drawFractal(w * 0.1, h * 0.12, cs, 3, 0.055, t * 0.08);
    drawFractal(w * 0.9, h * 0.12, cs, 3, 0.055, -t * 0.08);
    drawFractal(w * 0.1, h * 0.88, cs, 3, 0.055, -t * 0.06);
    drawFractal(w * 0.9, h * 0.88, cs, 3, 0.055, t * 0.06);

    // Particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Mouse attraction
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200 && dist > 0) {
        const force = 0.02 * (1 - dist / 200);
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${a})`;
      ctx.fill();
    });

    // Connection lines between nearby particles
    ctx.lineWidth = 0.3;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = dx * dx + dy * dy;
        if (d < 12000) {
          const a = 0.06 * (1 - d / 12000);
          ctx.strokeStyle = `rgba(201, 169, 110, ${a})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Orbiting points
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI / 8) + t * 0.35;
      const orbitR = r * 2.6 + Math.sin(t * 1.2 + i * 0.7) * 20;
      const x = gx + orbitR * Math.cos(a);
      const y = gy + orbitR * Math.sin(a);
      ctx.beginPath();
      ctx.arc(x, y, 1.2 + Math.sin(t + i) * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${0.15 + 0.1 * Math.sin(t * 2 + i)})`;
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }
  animate();

  // Button mouse tracking for radial highlight
  const btn = document.getElementById('enter-btn');
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });

  window._stopHero = () => { stopped = true; };
})();

/* ═══════════════════════════════════════════════
   READING PARTICLES — Ambient energy while reading
   ═══════════════════════════════════════════════ */
(function initReadingParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, active = false;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = [];
  for (let i = 0; i < 35; i++) {
    pts.push({
      x: Math.random() * 3000,
      y: Math.random() * 3000,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.2 - 0.05,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.25 + 0.05,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  function animate() {
    if (!active) return;
    ctx.clearRect(0, 0, w, h);
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.015;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }

  window._startReadingParticles = () => { active = true; animate(); };
})();

/* ═══════════════════════════════════════════════
   ADINKRA SYMBOLS
   ═══════════════════════════════════════════════ */
const adinkra = {
  nsoromma: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <circle cx="20" cy="20" r="8"/>
    <line x1="20" y1="4" x2="20" y2="12"/><line x1="20" y1="28" x2="20" y2="36"/>
    <line x1="4" y1="20" x2="12" y2="20"/><line x1="28" y1="20" x2="36" y2="20"/>
    <line x1="8.7" y1="8.7" x2="14.3" y2="14.3"/><line x1="25.7" y1="25.7" x2="31.3" y2="31.3"/>
    <line x1="31.3" y1="8.7" x2="25.7" y2="14.3"/><line x1="14.3" y1="25.7" x2="8.7" y2="31.3"/>
  </svg>`,
  sankofa: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M20 6 C30 6 34 14 34 20 C34 28 28 34 20 34 C12 34 6 28 6 20"/>
    <path d="M6 20 C6 14 10 10 14 10"/>
    <circle cx="14" cy="10" r="2.5" fill="currentColor"/>
  </svg>`,
  dwennimmen: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M20 8 C14 8 8 12 8 20 C8 24 10 26 14 26"/>
    <path d="M20 8 C26 8 32 12 32 20 C32 24 30 26 26 26"/>
    <path d="M20 32 C14 32 8 28 8 20"/><path d="M20 32 C26 32 32 28 32 20"/>
    <line x1="20" y1="6" x2="20" y2="34"/>
  </svg>`,
  ananse: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <circle cx="20" cy="20" r="4"/><circle cx="20" cy="20" r="10"/><circle cx="20" cy="20" r="16"/>
    <line x1="20" y1="4" x2="20" y2="36"/><line x1="4" y1="20" x2="36" y2="20"/>
    <line x1="8.7" y1="8.7" x2="31.3" y2="31.3"/><line x1="31.3" y1="8.7" x2="8.7" y2="31.3"/>
  </svg>`,
  funtun: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M20 6 A14 14 0 0 1 20 34"/><path d="M20 6 A14 14 0 0 0 20 34"/>
    <circle cx="20" cy="13" r="3"/><circle cx="20" cy="27" r="3"/>
  </svg>`,
  matemasie: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2">
    <path d="M8 14 C8 10 12 8 16 8 C20 8 20 12 20 14 C20 12 20 8 24 8 C28 8 32 10 32 14 C32 18 28 20 20 20 C12 20 8 18 8 14Z"/>
    <path d="M8 26 C8 22 12 20 16 20 C20 20 20 24 20 26 C20 24 20 20 24 20 C28 20 32 22 32 26 C32 30 28 32 20 32 C12 32 8 30 8 26Z"/>
    <circle cx="14" cy="14" r="1.5" fill="currentColor"/><circle cx="26" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="14" cy="26" r="1.5" fill="currentColor"/><circle cx="26" cy="26" r="1.5" fill="currentColor"/>
  </svg>`,
};

const adinkraKeys = Object.keys(adinkra);
function getAdinkraSVG(i) { return adinkra[adinkraKeys[i % adinkraKeys.length]]; }

function makeSacredDivider(i) {
  return `<div class="sacred-divider">
    <span class="line"></span>
    <span class="symbol">${getAdinkraSVG(i)}</span>
    <span class="line"></span>
  </div>`;
}

/* ═══════════════════════════════════════════════
   PARSER
   ═══════════════════════════════════════════════ */
function parseTreatise(md) {
  const lines = md.split('\n');
  const chs = [];
  let cur = null, part = '';

  for (const line of lines) {
    if (/^## Part \w+:/.test(line)) part = line.replace(/^## /, '');
    if (/^### Letter \d+/.test(line) || /^## Preface/.test(line) || /^## Epilogue/.test(line)) {
      if (cur) chs.push(cur);
      const title = line.replace(/^#{2,3}\s+/, '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      cur = { title, id, part, lines: [line] };
    } else if (cur) {
      cur.lines.push(line);
    }
  }
  if (cur) chs.push(cur);
  return chs;
}

/* ═══════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════ */
function buildNavigation(chs) {
  const tree = document.getElementById('nav-tree');
  const parts = new Map();

  chs.forEach((ch, i) => {
    const key = ch.part || 'Introduction';
    if (!parts.has(key)) parts.set(key, []);
    parts.get(key).push({ ...ch, index: i });
  });

  let html = '';
  let pi = 0;
  parts.forEach((letters, name) => {
    html += `<div class="nav-part" data-part="${pi}">
      <div class="nav-part-title" onclick="this.parentElement.classList.toggle('collapsed')">
        <span class="chevron">&#9660;</span>
        <span>${name === 'Introduction' ? 'Preface' : name}</span>
      </div>
      <div class="nav-letters">`;
    letters.forEach(ch => {
      const short = ch.title.length > 42 ? ch.title.substring(0, 40) + '\u2026' : ch.title;
      html += `<a class="nav-letter" data-target="${ch.id}" data-index="${ch.index}">${short}</a>`;
    });
    html += `</div></div>`;
    pi++;
  });

  tree.innerHTML = html;

  // Event delegation for chapter navigation (module-scoped, no inline onclick)
  tree.addEventListener('click', e => {
    const link = e.target.closest('.nav-letter');
    if (link) {
      e.preventDefault();
      scrollToChapter(link.dataset.target);
    }
    // Toggle part collapse
    const partHeader = e.target.closest('.nav-part-header');
    if (partHeader) {
      const part = partHeader.parentElement;
      part.classList.toggle('collapsed');
    }
  });
}

/* ═══════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════ */
function renderChapters(chs) {
  const content = document.getElementById('content');
  marked.setOptions({ breaks: false, gfm: true });

  const demoTitles = {
    'sorting-theater': 'Sorting Theater — TAOCP Vol. 3 Made Alive',
    'stack-machine': 'Stack Machine — Knuth\'s MIX Reborn',
    'circuit-sim': 'Circuit Simulator — Ohm\'s Law Made Tangible',
  };

  function demoReplace(_, demoId) {
    return `<div class="demo-panel" data-demo="${demoId}" id="demo-${demoId}">
      <div class="demo-header">
        <span class="demo-title">${demoTitles[demoId] || demoId}</span>
        <span class="demo-badge">live wasm</span>
      </div>
      <div class="demo-content"><div class="demo-loading"><div class="spinner"></div>Loading Wasm module\u2026</div></div>
    </div>`;
  }

  let html = '';
  chs.forEach((ch, i) => {
    // Replace demo markers BEFORE markdown parsing (marked passes HTML comments through invisibly)
    let raw = ch.lines.join('\n');
    raw = raw.replace(/<!--\s*DEMO:([\w-]+)\s*-->/g, demoReplace);
    let rendered = marked.parse(raw);
    // Also catch the escaped form in case marked escapes it in some configurations
    rendered = rendered.replace(/&lt;!--\s*DEMO:([\w-]+)\s*--&gt;/g, demoReplace);

    html += `<article class="chapter" id="${ch.id}" data-index="${i}">
      <div class="chapter-marker">${getAdinkraSVG(i)}</div>
      ${rendered}
    </article>`;
    if (i < chs.length - 1) html += makeSacredDivider(i);
  });

  content.innerHTML = html;

  // Add copy buttons to code blocks
  content.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'code-copy';
    btn.textContent = 'copy';
    btn.onclick = () => {
      const code = pre.querySelector('code');
      if (code) {
        navigator.clipboard.writeText(code.textContent).then(() => {
          btn.textContent = 'copied';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
        });
      }
    };
    pre.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════════
   SCROLLSPY + REVEAL
   ═══════════════════════════════════════════════ */
let _scrollingTo = false; // Guard: suppress scrollspy during programmatic scroll
let _chapterEls = []; // Cached chapter DOM elements
let _activeNavEl = null; // Cache: currently active nav element (avoid querySelectorAll)

function initObservers() {
  // Cache chapter elements once (avoid querySelectorAll on every scroll)
  _chapterEls = Array.from(document.querySelectorAll('.chapter'));

  let spyTicking = false;
  function updateScrollspy() {
    if (_scrollingTo) return;
    spyTicking = false;

    const targetY = window.innerHeight * 0.2;
    let bestIdx = 0;
    let bestDist = Infinity;

    // Use cached elements instead of querySelectorAll every frame
    for (const el of _chapterEls) {
      const rect = el.getBoundingClientRect();
      if (rect.top <= targetY && rect.bottom > targetY) {
        const idx = parseInt(el.dataset.index);
        if (!isNaN(idx)) { bestIdx = idx; bestDist = 0; }
      } else {
        const dist = Math.abs(rect.top - targetY);
        const idx = parseInt(el.dataset.index);
        if (!isNaN(idx) && dist < bestDist && rect.top <= targetY + 100) {
          bestDist = dist; bestIdx = idx;
        }
      }
    }

    if (bestIdx === currentChapterIdx) return;
    currentChapterIdx = bestIdx;

    const ch = chapters[bestIdx];
    if (!ch) return;

    // Update nav: remove active from cached element only (not querySelectorAll)
    if (_activeNavEl) _activeNavEl.classList.remove('active');
    const navItem = document.querySelector(`.nav-letter[data-target="${ch.id}"]`);
    if (navItem) {
      navItem.classList.add('active');
      _activeNavEl = navItem; // Cache for next update
      navItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      const part = navItem.closest('.nav-part');
      if (part) part.classList.remove('collapsed');
    }

    // Update chapter indicator
    const indicator = document.getElementById('chapter-indicator');
    if (indicator) {
      const short = ch.title.length > 50 ? ch.title.substring(0, 48) + '\u2026' : ch.title;
      indicator.textContent = `${bestIdx + 1} / ${chapters.length} \u2014 ${short}`;
    }

    // Persist reading progress AND scroll position
    saveReadingProgress(bestIdx + 1, chapters.length);
    // Also save scroll position so returning to this book restores here
    const scrollFraction = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    euler.on_scroll_book(currentBookId, scrollFraction, ch.id);
    autoPersist();
  }

  window.addEventListener('scroll', () => {
    if (!spyTicking && !_scrollingTo) {
      spyTicking = true;
      requestAnimationFrame(updateScrollspy);
    }
  }, { passive: true });

  // Reveal on scroll
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target); // Only animate once
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.02 });

  document.querySelectorAll('.chapter').forEach(el => {
    reveal.observe(el);
  });
}

/* ═══════════════════════════════════════════════
   PROGRESS + BACK TO TOP
   ═══════════════════════════════════════════════ */
function initProgress() {
  const bar = document.getElementById('reading-progress-bar');
  const topBar = document.getElementById('top-progress');
  const btn = document.getElementById('back-to-top');
  const indicator = document.getElementById('chapter-indicator');
  const kbHint = document.getElementById('keyboard-hint');
  let hideTimer;

  function update() {
    const st = window.scrollY;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    const pct = dh > 0 ? (st / dh) * 100 : 0;
    bar.style.width = pct + '%';
    topBar.style.width = pct + '%';

    if (st > 400) {
      btn.classList.add('show');
      indicator.classList.add('show');
    } else {
      btn.classList.remove('show');
      indicator.classList.remove('show');
    }

    // Show keyboard hint briefly on first scroll
    if (st > 100 && st < 600) {
      kbHint.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => kbHint.classList.remove('show'), 4000);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════
   ACTIONS
   ═══════════════════════════════════════════════ */
function enterScroll(skipScrollReset) {
  const hero = document.getElementById('hero');
  const app = document.getElementById('app');

  hero.classList.add('exiting');
  app.style.display = 'grid';

  // Wait for hero exit animation
  setTimeout(() => {
    hero.classList.add('hidden');
    app.classList.add('visible');
    // Only reset scroll to top for new readers, not returning ones
    if (!skipScrollReset) window.scrollTo(0, 0);
    if (window._startReadingParticles) window._startReadingParticles();
    if (window._stopHero) window._stopHero();
  }, 600);
}

function scrollToChapter(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // Suppress scroll-based scrollspy during programmatic scroll
  _scrollingTo = true;

  // Update nav highlight immediately
  const idx = parseInt(el.dataset?.index);
  if (!isNaN(idx)) {
    currentChapterIdx = idx;
    document.querySelectorAll('.nav-letter').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-letter[data-target="${id}"]`);
    if (navItem) {
      navItem.classList.add('active');
      navItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      const part = navItem.closest('.nav-part');
      if (part) part.classList.remove('collapsed');
    }
  }

  // Scroll to the chapter
  const offset = 20;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });

  // Re-enable scrollspy after scroll animation settles.
  // The scroll-based spy only runs via rAF when _scrollingTo is false,
  // so there's no race — we just need to wait for the scroll to finish.
  const checkSettled = () => {
    // Poll until scroll position stabilizes
    let lastY = window.scrollY;
    const poll = setInterval(() => {
      if (Math.abs(window.scrollY - lastY) < 2) {
        clearInterval(poll);
        setTimeout(() => { _scrollingTo = false; }, 100);
      }
      lastY = window.scrollY;
    }, 100);
    // Hard timeout safety net
    setTimeout(() => { clearInterval(poll); _scrollingTo = false; }, 3000);
  };
  // Start checking after a brief initial delay
  setTimeout(checkSettled, 300);

  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

/* ═══════════════════════════════════════════════
   KEYBOARD NAVIGATION
   ═══════════════════════════════════════════════ */
document.addEventListener('keydown', (e) => {
  // Don't intercept when typing in inputs or using modifier keys
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const hero = document.getElementById('hero');
  if (!hero.classList.contains('hidden')) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterScroll(); }
    return;
  }

  switch (e.key) {
    case 'j': // Next chapter
      e.preventDefault();
      if (currentChapterIdx < chapters.length - 1) {
        scrollToChapter(chapters[currentChapterIdx + 1].id);
      }
      break;
    case 'k': // Prev chapter
      e.preventDefault();
      if (currentChapterIdx > 0) {
        scrollToChapter(chapters[currentChapterIdx - 1].id);
      }
      break;
    case 't': // Top
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 's': // Toggle sidebar
      e.preventDefault();
      toggleSidebar();
      break;
    case 'Escape':
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebar-overlay').classList.remove('open');
      break;
  }
});

/* ═══════════════════════════════════════════════
   EVENT BINDINGS
   ═══════════════════════════════════════════════ */
document.getElementById('enter-btn').addEventListener('click', enterScroll);
document.getElementById('mobile-toggle').addEventListener('click', toggleSidebar);
document.getElementById('sidebar-overlay').addEventListener('click', toggleSidebar);
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Hero scroll detection
let heroActive = true;
window.addEventListener('scroll', () => {
  if (!heroActive) return;
  if (window.scrollY > window.innerHeight * 0.4) {
    heroActive = false;
    enterScroll();
  }
}, { passive: true });

/* ═══════════════════════════════════════════════
   WASM DEMOS — Lazy-loaded interactive panels
   ═══════════════════════════════════════════════ */
function initDemos() {
  const observer = new IntersectionObserver(async (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && !entry.target.dataset.initialized) {
        entry.target.dataset.initialized = 'true';
        const demoId = entry.target.dataset.demo;
        try {
          if (demoId === 'sorting-theater') await initSortingDemo(entry.target);
          else if (demoId === 'stack-machine') await initStackDemo(entry.target);
          else if (demoId === 'circuit-sim') await initCircuitDemo(entry.target);
        } catch (err) {
          entry.target.querySelector('.demo-content').innerHTML =
            `<div class="demo-error">Failed to load demo: ${err.message}</div>`;
        }
      }
    }
  }, { rootMargin: '400px' });

  document.querySelectorAll('.demo-panel').forEach(el => observer.observe(el));
}

/* ── Sorting Theater ─────────────────────────── */
async function initSortingDemo(panel) {
  const { default: init, SortingTheater } = await import('../pkg/sorting-theater/sorting_theater.js');
  const wasm = await init('./pkg/sorting-theater/sorting_theater_bg.wasm');

  const SIZE = 48;
  let theater = new SortingTheater(SIZE, 0);
  let playing = false;
  let speed = 3; // steps per frame
  let animId = null;

  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-canvas-wrap"><canvas id="sorting-canvas" height="200"></canvas></div>
    <div class="demo-controls" id="sorting-algos"></div>
    <div class="demo-controls" id="sorting-actions"></div>
    <div class="demo-stats" id="sorting-stats"></div>
  `;

  const canvas = document.getElementById('sorting-canvas');
  const ctx = canvas.getContext('2d');

  // Algorithm buttons
  const algos = ['Bubble', 'Insertion', 'Selection', 'Quicksort', 'Heapsort', 'Merge'];
  const algoBtns = document.getElementById('sorting-algos');
  algos.forEach((name, idx) => {
    const btn = document.createElement('button');
    btn.className = 'demo-btn' + (idx === 0 ? ' active' : '');
    btn.textContent = name;
    btn.onclick = () => {
      playing = false;
      theater.set_algorithm(idx);
      algoBtns.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      draw();
      updateStats();
    };
    algoBtns.appendChild(btn);
  });

  // Action buttons
  const actions = document.getElementById('sorting-actions');
  const mkBtn = (text, cls, fn) => {
    const b = document.createElement('button');
    b.className = 'demo-btn ' + cls;
    b.textContent = text;
    b.onclick = fn;
    actions.appendChild(b);
    return b;
  };

  const playBtn = mkBtn('\u25B6 Play', 'primary', () => {
    if (theater.is_done()) { theater.reset(); }
    playing = !playing;
    playBtn.textContent = playing ? '\u23F8 Pause' : '\u25B6 Play';
    if (playing) animate();
  });

  mkBtn('Step', '', () => {
    playing = false;
    playBtn.textContent = '\u25B6 Play';
    theater.step();
    draw();
    updateStats();
  });

  mkBtn('Reset', '', () => {
    playing = false;
    playBtn.textContent = '\u25B6 Play';
    theater.reset();
    draw();
    updateStats();
  });

  mkBtn('Shuffle', '', () => {
    playing = false;
    playBtn.textContent = '\u25B6 Play';
    theater.randomize();
    draw();
    updateStats();
  });

  mkBtn('Faster', '', () => { speed = Math.min(speed * 2, 64); });
  mkBtn('Slower', '', () => { speed = Math.max(Math.floor(speed / 2), 1); });

  function draw() {
    const w = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
    const h = canvas.height = 200 * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    const cw = canvas.clientWidth, ch = 200;

    ctx.clearRect(0, 0, cw, ch);

    const ptr = theater.data_ptr();
    const data = new Uint32Array(wasm.memory.buffer, ptr, SIZE);
    const ha = theater.highlight_a();
    const hb = theater.highlight_b();
    const barW = Math.max(1, (cw - SIZE) / SIZE);
    const gap = 1;
    const maxVal = SIZE;

    for (let i = 0; i < SIZE; i++) {
      const val = data[i];
      const barH = (val / maxVal) * (ch - 10);
      const x = i * (barW + gap) + gap;
      const y = ch - barH;

      if (i === ha || i === hb) {
        ctx.fillStyle = '#e4c98a';
        ctx.shadowColor = 'rgba(201, 169, 110, 0.5)';
        ctx.shadowBlur = 8;
      } else if (theater.is_done()) {
        ctx.fillStyle = '#4a7a5a';
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#5a5a6e';
        ctx.shadowBlur = 0;
      }

      ctx.fillRect(x, y, barW, barH);
      ctx.shadowBlur = 0;
    }
  }

  function updateStats() {
    document.getElementById('sorting-stats').innerHTML =
      `<span>${theater.algorithm_name()}</span> &mdash; ` +
      `Comparisons: <span>${theater.comparisons()}</span> &middot; ` +
      `Swaps: <span>${theater.swaps()}</span>` +
      (theater.is_done() ? ' &middot; <span>Done!</span>' : '') +
      ` &middot; Speed: <span>${speed}x</span>`;
  }

  function animate() {
    if (!playing) return;
    const alive = theater.step_n(speed);
    draw();
    updateStats();
    if (!alive) {
      playing = false;
      playBtn.textContent = '\u25B6 Play';
      draw();
      updateStats();
      return;
    }
    animId = requestAnimationFrame(animate);
  }

  draw();
  updateStats();
}

/* ── Stack Machine ───────────────────────────── */
async function initStackDemo(panel) {
  const { default: init, StackMachine } = await import('../pkg/stack-machine/stack_machine.js');
  const wasm = await init('./pkg/stack-machine/stack_machine_bg.wasm');

  const vm = new StackMachine();
  let playing = false;
  let animId = null;

  const programs = {
    'Arithmetic: (3+4)×2': 'PUSH 3\nPUSH 4\nADD\nPUSH 2\nMUL\nOUTPUT\nHALT',
    'Fibonacci (first 10)': [
      '# Fibonacci: compute first 10 numbers',
      '# mem[0] = a, mem[1] = b, mem[2] = counter',
      'PUSH 0\nPUSH 0\nSTORE',   // a = 0
      'PUSH 1\nPUSH 1\nSTORE',   // b = 1
      'PUSH 2\nPUSH 10\nSTORE',  // counter = 10
      '# output a',
      'PUSH 0\nLOAD\nOUTPUT',
      '# temp = a + b',
      'PUSH 0\nLOAD',
      'PUSH 1\nLOAD',
      'ADD',
      '# a = b',
      'PUSH 1\nLOAD',
      'PUSH 0\nSWAP\nSTORE',
      '# b = temp (still on stack)',
      'PUSH 1\nSWAP\nSTORE',
      '# counter--',
      'PUSH 2\nLOAD\nPUSH 1\nSUB',
      'DUP\nPUSH 2\nSWAP\nSTORE',
      '# if counter > 0, loop',
      'JNZ 27',
      'HALT',
    ].join('\n'),
    'Countdown (10 to 1)': 'PUSH 10\nDUP\nOUTPUT\nPUSH 1\nSUB\nDUP\nJNZ 1\nDROP\nHALT',
  };

  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-controls" id="stack-programs"></div>
    <div class="stack-vm-grid">
      <div class="stack-vm-panel"><h4>Program</h4><div class="values" id="stack-program"></div></div>
      <div class="stack-vm-panel"><h4>Stack</h4><div class="values" id="stack-values"></div></div>
    </div>
    <div class="demo-output" id="stack-output"></div>
    <div class="demo-error" id="stack-error"></div>
    <div class="demo-controls" id="stack-actions"></div>
    <div class="demo-stats" id="stack-stats"></div>
  `;

  // Program selector
  const progBtns = document.getElementById('stack-programs');
  let firstProg = true;
  for (const [name, src] of Object.entries(programs)) {
    const btn = document.createElement('button');
    btn.className = 'demo-btn' + (firstProg ? ' active' : '');
    btn.textContent = name;
    btn.onclick = () => {
      playing = false;
      vm.load_program(src);
      progBtns.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderVM();
    };
    progBtns.appendChild(btn);
    if (firstProg) { vm.load_program(src); firstProg = false; }
  }

  // Action buttons
  const actions = document.getElementById('stack-actions');
  const mkBtn = (text, cls, fn) => {
    const b = document.createElement('button');
    b.className = 'demo-btn ' + cls;
    b.textContent = text;
    b.onclick = fn;
    actions.appendChild(b);
    return b;
  };

  const playBtn = mkBtn('\u25B6 Play', 'primary', () => {
    if (vm.is_halted()) vm.reset();
    playing = !playing;
    playBtn.textContent = playing ? '\u23F8 Pause' : '\u25B6 Play';
    if (playing) animateVM();
  });

  mkBtn('Step', '', () => {
    playing = false;
    playBtn.textContent = '\u25B6 Play';
    vm.step();
    renderVM();
  });

  mkBtn('Reset', '', () => {
    playing = false;
    playBtn.textContent = '\u25B6 Play';
    vm.reset();
    renderVM();
  });

  function renderVM() {
    // Program listing with PC highlight
    const disasm = vm.disassemble();
    const pc = vm.pc();
    const lines = disasm.split('\n').filter(l => l);
    let progHTML = '';
    for (const line of lines) {
      const addr = parseInt(line.split(':')[0]);
      const isActive = addr === pc && !vm.is_halted();
      progHTML += `<div class="program-line${isActive ? ' active' : ''}">${line}</div>`;
    }
    document.getElementById('stack-program').innerHTML = progHTML;

    // Stack
    const depth = vm.stack_depth();
    let stackHTML = '';
    if (depth > 0) {
      const ptr = vm.stack_ptr();
      const stack = new Int32Array(wasm.memory.buffer, ptr, depth);
      for (let i = depth - 1; i >= 0; i--) {
        const isTop = i === depth - 1;
        stackHTML += `<span class="stack-val${isTop ? ' new' : ''}">${stack[i]}</span> `;
      }
    } else {
      stackHTML = '<span style="color:var(--text-dim);font-size:0.7rem">(empty)</span>';
    }
    document.getElementById('stack-values').innerHTML = stackHTML;

    // Output
    const outLen = vm.output_len();
    let outHTML = '';
    if (outLen > 0) {
      const outPtr = vm.output_ptr();
      const out = new Int32Array(wasm.memory.buffer, outPtr, outLen);
      outHTML = 'Output: ' + Array.from(out).join(', ');
    }
    document.getElementById('stack-output').innerHTML = outHTML;

    // Error
    const err = vm.get_error();
    document.getElementById('stack-error').textContent = err;

    // Stats
    document.getElementById('stack-stats').innerHTML =
      `PC: <span>${vm.pc()}</span> &middot; ` +
      `Steps: <span>${vm.step_count()}</span> &middot; ` +
      `Stack depth: <span>${vm.stack_depth()}</span>` +
      (vm.is_halted() ? ' &middot; <span>HALTED</span>' : '');
  }

  let stepDelay = 0;
  function animateVM() {
    if (!playing) return;
    stepDelay++;
    if (stepDelay % 8 === 0) { // Slow enough to watch
      const alive = vm.step();
      renderVM();
      if (!alive) {
        playing = false;
        playBtn.textContent = '\u25B6 Play';
        return;
      }
    }
    requestAnimationFrame(animateVM);
  }

  renderVM();
}

/* ── Circuit Simulator ───────────────────────── */
async function initCircuitDemo(panel) {
  const { default: init, CircuitSim } = await import('../pkg/circuit-sim/circuit_sim.js');
  const wasm = await init('./pkg/circuit-sim/circuit_sim_bg.wasm');

  const sim = new CircuitSim();
  sim.load_preset('series2');

  const content = panel.querySelector('.demo-content');
  content.innerHTML = `
    <div class="demo-controls" id="circuit-presets"></div>
    <div class="demo-stats" id="circuit-summary" style="white-space:pre-wrap;line-height:1.8;margin:0.8rem 0"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;margin-top:0.6rem">
      <div>
        <div class="demo-stats" style="margin-bottom:0.3rem"><strong style="color:var(--gold)">Ohm's Law Calculator</strong></div>
        <div style="display:flex;gap:0.4rem;flex-wrap:wrap">
          <input id="ohm-v" type="number" placeholder="V (volts)" style="width:80px;padding:0.3rem;background:var(--bg-code);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-code);font-size:0.7rem">
          <input id="ohm-i" type="number" placeholder="I (amps)" style="width:80px;padding:0.3rem;background:var(--bg-code);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-code);font-size:0.7rem">
          <input id="ohm-r" type="number" placeholder="R (ohms)" style="width:80px;padding:0.3rem;background:var(--bg-code);border:1px solid var(--border);border-radius:4px;color:var(--text);font-family:var(--font-code);font-size:0.7rem">
          <button class="demo-btn primary" id="ohm-calc">Calculate</button>
        </div>
        <div class="demo-stats" id="ohm-result" style="margin-top:0.4rem"></div>
      </div>
      <div>
        <div class="demo-stats" style="margin-bottom:0.3rem"><strong style="color:var(--gold)">Voltage Control</strong></div>
        <input id="voltage-slider" type="range" min="1" max="24" step="0.5" value="12" style="width:100%;accent-color:var(--gold)">
        <div class="demo-stats" id="voltage-label">12.0 V</div>
      </div>
    </div>
  `;

  // Preset buttons
  const presets = [
    ['Series (2R)', 'series2'],
    ['Parallel (2R)', 'parallel2'],
    ['Series (3R)', 'series3'],
    ['Mixed', 'mixed'],
    ['Voltage Divider', 'voltage_divider'],
    ['LED Circuit', 'led_circuit'],
  ];
  const presetsEl = document.getElementById('circuit-presets');
  presets.forEach(([label, id], i) => {
    const btn = document.createElement('button');
    btn.className = 'demo-btn' + (i === 0 ? ' active' : '');
    btn.textContent = label;
    btn.onclick = () => {
      presetsEl.querySelectorAll('.demo-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sim.load_preset(id);
      document.getElementById('voltage-slider').value = sim.source_voltage();
      render();
    };
    presetsEl.appendChild(btn);
  });

  // Voltage slider
  document.getElementById('voltage-slider').addEventListener('input', e => {
    sim.set_voltage(parseFloat(e.target.value));
    render();
  });

  // Ohm's law calculator
  document.getElementById('ohm-calc').addEventListener('click', () => {
    const v = document.getElementById('ohm-v').value;
    const i = document.getElementById('ohm-i').value;
    const r = document.getElementById('ohm-r').value;
    const vv = v ? parseFloat(v) : -1;
    const ii = i ? parseFloat(i) : -1;
    const rr = r ? parseFloat(r) : -1;
    const filled = (v ? 1 : 0) + (i ? 1 : 0) + (r ? 1 : 0);
    if (filled !== 2) {
      document.getElementById('ohm-result').textContent = 'Fill exactly 2 fields, leave 1 empty';
      return;
    }
    document.getElementById('ohm-result').innerHTML = '<span style="color:var(--gold)">' + CircuitSim.ohms_law(vv, ii, rr) + '</span>';
  });

  function render() {
    document.getElementById('voltage-label').textContent = sim.source_voltage().toFixed(1) + ' V';
    document.getElementById('circuit-summary').innerHTML = sim.summary()
      .replace(/Source:/g, '<strong style="color:var(--gold)">Source:</strong>')
      .replace(/R\d+/g, '<span style="color:var(--gold)">$&</span>');
  }

  render();
}

/* ═══════════════════════════════════════════════
   READING PROGRESS — IDB + Euler state
   Per-letter granularity: the iBooks layer.
   ═══════════════════════════════════════════════ */
let currentBookId = 'wasm';
let _sovereignPromptShown = false;
let _attestationPublished = false;

function saveReadingProgress(chaptersRead, totalChapters) {
  euler.on_chapter_enter(currentBookId, chaptersRead, totalChapters, Date.now());
  // Per-letter tracking: record the specific letter visited in IDB
  const ch = chaptersRead > 0 ? chapters[chaptersRead - 1] : null;
  if (ch) {
    const scrollPct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    idb.markLetterRead(currentBookId, ch.id, scrollPct); // fire-and-forget
  }

  // First letter completed — offer sovereign identity if not connected
  if (chaptersRead === 1 && !_sovereignPromptShown && !nostr.isConnected()) {
    _sovereignPromptShown = true;
    _showSovereignPrompt();
  }

  // Publish progress to relay (fire-and-forget)
  if (nostr.isConnected()) {
    const pct = Math.round((chaptersRead / totalChapters) * 100);
    nostr.publishProgress(currentBookId, chaptersRead, pct);
  }

  // Book complete — publish attestation once
  if (chaptersRead === totalChapters && nostr.isConnected() && !_attestationPublished) {
    _attestationPublished = true;
    const bookTitle = document.title.split('—')[0]?.trim() || currentBookId;
    nostr.publishAttestation(currentBookId, totalChapters, bookTitle);
    _showAttestationMoment(totalChapters, bookTitle);
  }

  autoPersist();
}

function _showSovereignPrompt() {
  // Don't show if already dismissed this session
  if (sessionStorage.getItem('lv-sovereign-prompt-dismissed')) return;

  const bar = document.createElement('div');
  bar.className = 'sovereign-prompt';
  bar.innerHTML =
    'You\'ve completed Letter\u00A01. This progress lives only on this device. ' +
    '<button class="sovereign-prompt-btn">Connect wallet to make it permanent</button>' +
    '<button class="sovereign-prompt-close" aria-label="Dismiss">\u00D7</button>';

  bar.querySelector('.sovereign-prompt-btn').addEventListener('click', () => {
    bar.remove();
    // Open identity modal on the hub (reader is a separate page — deep link back)
    window.open('index.html', '_blank');
  });
  bar.querySelector('.sovereign-prompt-close').addEventListener('click', () => {
    sessionStorage.setItem('lv-sovereign-prompt-dismissed', '1');
    bar.remove();
  });

  document.body.appendChild(bar);
  // Animate in
  requestAnimationFrame(() => bar.classList.add('visible'));
}

function _showAttestationMoment(letterCount, bookTitle) {
  const banner = document.createElement('div');
  banner.className = 'attestation-banner';
  banner.innerHTML =
    `<span class="attestation-icon">&#9670;</span>` +
    `<span><strong>${bookTitle}</strong> &mdash; ${letterCount} letters completed. ` +
    `Your attestation is on the Nostr relay.</span>` +
    `<button class="attestation-close" aria-label="Dismiss">\u00D7</button>`;

  banner.querySelector('.attestation-close').addEventListener('click', () => banner.remove());
  document.body.appendChild(banner);
  requestAnimationFrame(() => banner.classList.add('visible'));
  setTimeout(() => banner.remove(), 8000);
}

/* ═══════════════════════════════════════════════
   THEME ENGINE
   ═══════════════════════════════════════════════ */
function initThemeEngine(book) {
  const { applyTheme, getTheme, setTheme, THEMES } = ELib;
  const savedTheme = getTheme();

  // Apply saved theme (but preserve book accent)
  if (savedTheme !== 'midnight') {
    applyTheme(savedTheme);
  }
  // Re-apply book accent after theme
  if (book.accent) {
    document.documentElement.style.setProperty('--gold', book.accent);
  }

  // Mark active swatch
  document.querySelectorAll('.theme-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.theme === savedTheme);
  });

  // Swatch click handlers
  document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const name = swatch.dataset.theme;
      setTheme(name);
      // Re-apply book accent
      if (book.accent) {
        document.documentElement.style.setProperty('--gold', book.accent);
      }
      document.querySelectorAll('.theme-swatch').forEach(s =>
        s.classList.toggle('active', s.dataset.theme === name)
      );
    });
  });

  // Toggle theme panel
  document.getElementById('btn-theme').addEventListener('click', () => {
    const panel = document.getElementById('theme-panel');
    const typoPanel = document.getElementById('typo-panel');
    typoPanel.classList.remove('open');
    panel.classList.toggle('open');
  });
}

/* ═══════════════════════════════════════════════
   TYPOGRAPHY CONTROLS
   ═══════════════════════════════════════════════ */
function initTypographyControls() {
  const { getTypography, setTypography, applyTypography } = ELib;
  const typo = getTypography();
  applyTypography(typo);

  // Set slider values
  const sizeSlider = document.getElementById('typo-size');
  const heightSlider = document.getElementById('typo-height');
  const widthSlider = document.getElementById('typo-width');
  sizeSlider.value = typo.fontSize;
  heightSlider.value = typo.lineHeight;
  widthSlider.value = typo.contentMax;
  document.getElementById('typo-size-val').textContent = typo.fontSize;
  document.getElementById('typo-height-val').textContent = typo.lineHeight;
  document.getElementById('typo-width-val').textContent = typo.contentMax + 'ch';

  sizeSlider.addEventListener('input', e => {
    const v = +e.target.value;
    document.getElementById('typo-size-val').textContent = v;
    setTypography({ fontSize: v });
  });
  heightSlider.addEventListener('input', e => {
    const v = +e.target.value;
    document.getElementById('typo-height-val').textContent = v;
    setTypography({ lineHeight: v });
  });
  widthSlider.addEventListener('input', e => {
    const v = +e.target.value;
    document.getElementById('typo-width-val').textContent = v + 'ch';
    setTypography({ contentMax: v });
  });

  // Toggle typography panel
  document.getElementById('btn-typo').addEventListener('click', () => {
    const panel = document.getElementById('typo-panel');
    const themePanel = document.getElementById('theme-panel');
    themePanel.classList.remove('open');
    panel.classList.toggle('open');
  });
}

/* ═══════════════════════════════════════════════
   SIDEBAR TABS — Contents / Study
   ═══════════════════════════════════════════════ */
function initSidebarTabs() {
  const tabs = document.querySelectorAll('.sidebar-tab');
  const navTree = document.getElementById('nav-tree');
  const studyPanel = document.getElementById('study-panel-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      navTree.style.display = target === 'contents' ? '' : 'none';
      studyPanel.classList.toggle('open', target === 'study');
    });
  });
}

/* ═══════════════════════════════════════════════
   BOOKMARKS
   ═══════════════════════════════════════════════ */
function initBookmarks() {
  const { isBookmarked, toggleBookmark } = ELib;

  // Add bookmark buttons to each chapter header
  document.querySelectorAll('.chapter').forEach(ch => {
    const id = ch.id;
    const h3 = ch.querySelector('h3');
    if (!h3) return;

    const btn = document.createElement('button');
    btn.className = 'bookmark-btn' + (isBookmarked(currentBookId, id) ? ' active' : '');
    btn.innerHTML = '&#9856;'; // bookmark symbol
    btn.title = 'Bookmark this letter';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const added = toggleBookmark(currentBookId, id);
      btn.classList.toggle('active', added);
      updateNavBookmarkDots();
      refreshStudyPanel();
    });

    h3.style.position = 'relative';
    h3.appendChild(btn);

    // Share to Nostr — only when authenticated
    if (nostr.isConnected()) {
      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-btn';
      shareBtn.innerHTML = '&#8599;'; // ↗
      shareBtn.title = 'Share this letter to Nostr';
      shareBtn.addEventListener('click', e => {
        e.stopPropagation();
        _openSharePopover(shareBtn, chapters[parseInt(ch.dataset?.index ?? '0')] || { title: h3.textContent.trim() }, id);
      });
      h3.appendChild(shareBtn);
    }
  });

  updateNavBookmarkDots();
}

function _openSharePopover(anchorBtn, chObj, chapterId) {
  // One popover at a time
  document.querySelectorAll('.share-popover').forEach(p => p.remove());

  const url  = `${location.origin}${location.pathname}?book=${currentBookId}#${chapterId}`;
  const text = `"${chObj?.title ?? chapterId}"\n— from The Epistolary Library\n\n${url}`;

  const pop = document.createElement('div');
  pop.className = 'share-popover';
  pop.innerHTML =
    `<textarea class="share-textarea">${text}</textarea>` +
    `<div class="share-popover-row">` +
      `<button class="share-publish-btn">Publish to Nostr &#8599;</button>` +
      `<button class="share-cancel-btn">Cancel</button>` +
    `</div>` +
    `<p class="share-status"></p>`;

  // Insert after the chapter h3
  const h3 = anchorBtn.closest('h3');
  if (h3) h3.after(pop);
  else anchorBtn.closest('.chapter')?.prepend(pop);

  pop.querySelector('.share-publish-btn').addEventListener('click', async () => {
    const content = pop.querySelector('.share-textarea').value.trim();
    if (!content) return;
    const ok = await nostr.publishNote(content);
    const statusEl = pop.querySelector('.share-status');
    statusEl.textContent = ok ? '✓ Published to Nostr' : 'Connection error — try again';
    statusEl.style.color = ok ? 'var(--gold-bright)' : '';
    if (ok) setTimeout(() => pop.remove(), 2500);
  });

  pop.querySelector('.share-cancel-btn').addEventListener('click', () => pop.remove());
}

function updateNavBookmarkDots() {
  const { getBookmarks } = ELib;
  const bookmarks = getBookmarks(currentBookId);
  // Remove existing dots
  document.querySelectorAll('.nav-bookmark-dot').forEach(d => d.remove());
  // Add dots to nav items
  bookmarks.forEach(b => {
    const navLink = document.querySelector(`[data-chapter="${b.chapterId}"]`);
    if (navLink && !navLink.querySelector('.nav-bookmark-dot')) {
      const dot = document.createElement('span');
      dot.className = 'nav-bookmark-dot';
      navLink.appendChild(dot);
    }
  });
}

/* ═══════════════════════════════════════════════
   HIGHLIGHTS
   ═══════════════════════════════════════════════ */
function initHighlights() {
  const toolbar = document.getElementById('highlight-toolbar');
  let savedSelection = null;

  // Show toolbar on text selection in chapters
  document.getElementById('content').addEventListener('mouseup', e => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) {
      toolbar.classList.remove('show');
      return;
    }

    // Only highlight within chapter content
    const anchor = sel.anchorNode?.parentElement?.closest?.('.chapter');
    const focus = sel.focusNode?.parentElement?.closest?.('.chapter');
    if (!anchor || !focus || anchor !== focus) {
      toolbar.classList.remove('show');
      return;
    }

    savedSelection = { sel: sel.getRangeAt(0).cloneRange(), chapterId: anchor.id, text: sel.toString().trim() };

    // Position toolbar above selection
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    toolbar.style.left = (rect.left + rect.width / 2 - 60) + 'px';
    toolbar.style.top = (rect.top - 45 + window.scrollY) + 'px';
    toolbar.classList.add('show');
  });

  // Hide toolbar on click outside
  document.addEventListener('mousedown', e => {
    if (!toolbar.contains(e.target)) {
      toolbar.classList.remove('show');
    }
  });

  // Color button clicks
  toolbar.querySelectorAll('.hl-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!savedSelection) return;
      const color = btn.dataset.color;
      applyHighlight(savedSelection, color);
      toolbar.classList.remove('show');
      window.getSelection()?.removeAllRanges();
      savedSelection = null;
      refreshStudyPanel();
    });
  });

  // Restore saved highlights
  restoreHighlights();
}

function applyHighlight(selData, color) {
  const { saveHighlight } = ELib;
  const id = saveHighlight(currentBookId, {
    chapterId: selData.chapterId,
    text: selData.text,
    color: color,
  });

  // Wrap selection in highlight span
  try {
    const range = selData.sel;
    const span = document.createElement('span');
    span.className = 'text-highlight';
    span.dataset.color = color;
    span.dataset.highlightId = id;
    span.title = 'Click to remove';
    range.surroundContents(span);

    span.addEventListener('click', () => {
      ELib.removeHighlight(currentBookId, span.dataset.highlightId);
      const text = document.createTextNode(span.textContent);
      span.replaceWith(text);
      refreshStudyPanel();
    });
  } catch (e) {
    // surroundContents fails if selection spans elements — fallback
    console.warn('Highlight wrap failed (cross-element selection):', e.message);
  }
}

function restoreHighlights() {
  const highlights = ELib.getHighlights(currentBookId);
  highlights.forEach(h => {
    const chapter = document.getElementById(h.chapterId);
    if (!chapter) return;

    // Find the text within the chapter and wrap it
    const walker = document.createTreeWalker(chapter, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
      const idx = node.textContent.indexOf(h.text);
      if (idx >= 0) {
        const range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + h.text.length);
        const span = document.createElement('span');
        span.className = 'text-highlight';
        span.dataset.color = h.color;
        span.dataset.highlightId = h.id;
        span.title = 'Click to remove';
        try {
          range.surroundContents(span);
          span.addEventListener('click', () => {
            ELib.removeHighlight(currentBookId, span.dataset.highlightId);
            const text = document.createTextNode(span.textContent);
            span.replaceWith(text);
            refreshStudyPanel();
          });
        } catch (e) { /* cross-element — skip */ }
        break; // Only first match
      }
    }
  });
}

/* ═══════════════════════════════════════════════
   STUDY PANEL
   ═══════════════════════════════════════════════ */
let _currentBook = null;

function initStudyPanel(book) {
  _currentBook = book;
  refreshStudyPanel();

  document.getElementById('study-export').addEventListener('click', () => {
    const md = ELib.exportHighlightsMarkdown(currentBookId, book.title);
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBookId}-study-notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function refreshStudyPanel() {
  const bookmarks = ELib.getBookmarks(currentBookId);
  const highlights = ELib.getHighlights(currentBookId);

  // Bookmarks section
  const bmContainer = document.getElementById('study-bookmarks');
  if (bookmarks.length) {
    bmContainer.innerHTML = `<div class="study-section-title">Bookmarks</div>` +
      bookmarks.map(b => `<div class="study-item" data-chapter="${b.chapterId}">&#9856; ${b.chapterId.replace(/-/g, ' ')}</div>`).join('');
    bmContainer.querySelectorAll('.study-item').forEach(item => {
      item.addEventListener('click', () => {
        const el = document.getElementById(item.dataset.chapter);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  } else {
    bmContainer.innerHTML = '';
  }

  // Highlights section
  const hlContainer = document.getElementById('study-highlights');
  if (highlights.length) {
    const colorMap = { gold: '#c9a96e', coral: '#cd5c5c', teal: '#48a6a6', lavender: '#9478c4' };
    hlContainer.innerHTML = `<div class="study-section-title">Highlights</div>` +
      highlights.map(h => `<div class="study-item" data-chapter="${h.chapterId}"><span class="study-color-dot" style="background:${colorMap[h.color] || '#c9a96e'}"></span>"${h.text.slice(0, 60)}${h.text.length > 60 ? '...' : ''}"${h.note ? `<br><small style="color:var(--text-dim)">${h.note}</small>` : ''}</div>`).join('');
    hlContainer.querySelectorAll('.study-item').forEach(item => {
      item.addEventListener('click', () => {
        const el = document.getElementById(item.dataset.chapter);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  } else {
    hlContainer.innerHTML = '';
  }
}

async function init() {
  try {
    // Read book ID from URL param
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book') || 'wasm';
    currentBookId = bookId;

    // Signal SW to prefetch next books in compass path
    if (window.signalReading) window.signalReading(bookId);

    // Fetch manifest
    const manifestRes = await fetch('books/manifest.json');
    const manifest = await manifestRes.json();
    const book = manifest.books.find(b => b.id === bookId);

    if (!book) {
      document.getElementById('loading').innerHTML =
        `<p style="color:var(--accent-crimson)">Book "${bookId}" not found. <a href="index.html" style="color:var(--gold)">Back to library</a></p>`;
      return;
    }

    // Load manifest into euler for progress tracking
    euler.load_manifest(JSON.stringify(manifest));
    euler.on_book_open(bookId);
    sessionStart(bookId); // begin reading session timer

    // Populate hero dynamically
    document.getElementById('hero-title').textContent = book.title;
    document.getElementById('hero-subtitle').textContent = book.subtitle;
    document.getElementById('hero-manner').textContent = book.manner;
    document.title = book.title;

    // SEO: update meta tags for this book
    const pageUrl = window.location.href;
    const setMeta = (sel, attr, val) => {
      const el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };
    setMeta('meta[name="description"]', 'content', book.description);
    setMeta('link[rel="canonical"]', 'href', pageUrl);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:title"]', 'content', book.title);
    setMeta('meta[property="og:description"]', 'content', book.description);
    setMeta('meta[name="twitter:title"]', 'content', book.title);
    setMeta('meta[name="twitter:description"]', 'content', book.description);

    // Structured data
    const jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (jsonLd) {
      jsonLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title,
        "description": book.description,
        "url": pageUrl,
        "inLanguage": "en",
        "numberOfPages": book.letters,
        "author": { "@type": "Organization", "name": "OBIVERSE", "url": "https://obiverse.net" },
        "publisher": { "@type": "Organization", "name": "OBIVERSE", "url": "https://obiverse.net" },
        "image": "https://obiverse.github.io/wasmverse/og-image.png"
      });
    }

    // Dynamic hero button text from euler
    document.getElementById('enter-btn').textContent = euler.hero_button_text(bookId);

    // Apply book accent color + theme
    applyTheme(book.accent || '');
    applyTypography();

    // Determine if we should skip the hero:
    // 1. URL has a hash fragment (user clicked a deep link) — always skip
    // 2. Returning reader (has progress) — skip
    const hashTarget = window.location.hash ? window.location.hash.slice(1) : '';
    const skipHero = hashTarget || !euler.should_show_hero(bookId);

    if (skipHero) {
      const hero = document.getElementById('hero');
      const app = document.getElementById('app');
      hero.classList.add('hidden');
      app.style.display = 'grid';
      app.classList.add('visible');
      // CRITICAL: disable the hero scroll listener so it doesn't
      // call enterScroll() → window.scrollTo(0,0) after 600ms
      heroActive = false;
    }

    // IDB-first book load: instant from cache, background-refresh if content changed
    let md;
    const cached = await idb.getCachedBook(bookId);
    if (cached?.content) {
      md = cached.content;
      // Background: check if remote content has changed (ETag / Last-Modified)
      fetch(book.file).then(async res => {
        if (!res.ok) return;
        const newEtag = res.headers.get('etag') || res.headers.get('last-modified') || '';
        if (!newEtag || newEtag !== cached.etag) {
          const fresh = await res.text();
          idb.cacheBook(bookId, fresh, newEtag); // update cache silently
        }
      }).catch(() => {});
    } else {
      // No cache yet — fetch from network and store for next visit
      const res = await fetch(book.file);
      if (!res.ok) throw new Error('Failed to load ' + book.file);
      md = await res.text();
      const etag = res.headers.get('etag') || res.headers.get('last-modified') || '';
      idb.cacheBook(bookId, md, etag); // fire-and-forget
    }
    chapters = parseTreatise(md);
    renderChapters(chapters);
    buildNavigation(chapters);
    initObservers();
    initProgress();
    initDemos();
    initThemeEngine(book);
    initTypographyControls();
    initSidebarTabs();
    initBookmarks();
    initHighlights();
    initStudyPanel(book);

    // Scroll priority: 1) URL hash fragment, 2) saved scroll position, 3) top
    const scrollTarget = hashTarget || euler.get_scroll_target(bookId);
    if (scrollTarget) {
      // Suppress scrollspy during restoration to prevent it from
      // overwriting progress when early chapters are briefly visible
      _scrollingTo = true;

      // Wait for DOM layout to settle, then scroll
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) {
          const offset = 20;
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'auto' }); // instant, not smooth

          // Update nav highlight manually
          const idx = parseInt(el.dataset?.index);
          if (!isNaN(idx)) {
            currentChapterIdx = idx;
            document.querySelectorAll('.nav-letter').forEach(n => n.classList.remove('active'));
            const navItem = document.querySelector(`.nav-letter[data-target="${scrollTarget}"]`);
            if (navItem) {
              navItem.classList.add('active');
              navItem.scrollIntoView({ block: 'nearest', behavior: 'auto' });
              const part = navItem.closest('.nav-part');
              if (part) part.classList.remove('collapsed');
            }
          }
        }
        // Re-enable scrollspy after restoration settles
        setTimeout(() => { _scrollingTo = false; }, 500);
      }, 300); // 300ms gives DOM time to layout
    }

    // Save scroll position on scroll (throttled)
    let scrollSaveTimer = null;
    window.addEventListener('scroll', () => {
      if (_scrollingTo) return; // Don't save during programmatic scrolls
      clearTimeout(scrollSaveTimer);
      scrollSaveTimer = setTimeout(() => {
        const scrollFraction = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        const currentChapter = document.querySelector('.chapter.visible')?.id || '';
        euler.on_scroll_book(bookId, scrollFraction, currentChapter);
        autoPersist();
      }, 1000);
    }, { passive: true });

    // Persist state immediately when user leaves (tab close, navigate away)
    // visibilitychange is more reliable than beforeunload on mobile
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sessionEnd(bookId);   // accumulate reading time before saving
        persist();            // Immediate, not debounced
      } else {
        sessionStart(bookId); // restart timer when tab returns to focus
      }
    });
    window.addEventListener('beforeunload', () => {
      sessionEnd(bookId);
      persist();
    });

  } catch (err) {
    document.getElementById('loading').innerHTML =
      `<p style="color:var(--accent-crimson)">Could not load the treatise. ${err.message}. <a href="index.html" style="color:var(--gold)">Back to library</a></p>`;
  }
}

init();

