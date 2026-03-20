/* ═══════════════════════════════════════════════
   LIBRARY — Hub page logic

   The Taoist rewrite: remove strokes until only
   the essential remain.

   - No per-card canvas animations (Adinkra SVG instead)
   - No 3D tilt (CSS-only hover)
   - No display:none filtering (opacity + order)
   - No transform conflicts (CSS owns transform)
   ═══════════════════════════════════════════════ */

import { boot, autoPersist, applyTheme, applyTypography } from '../euler-shell.js';
import { drawAfricanBackground } from './african-patterns.js';

const euler = await boot();
applyTheme();
applyTypography();

let _manifestCache = null; // Cache manifest to avoid re-fetching

function getProgress(bookId) {
  const pct = euler.get_book_progress_pct(bookId);
  const lastRead = euler.get_last_read(bookId);
  // Use actual letter count from cached manifest, not hardcoded 40
  const bookMeta = _manifestCache?.books?.find(b => b.id === bookId);
  const total = bookMeta?.letters || 40;
  return {
    chaptersRead: Math.round(pct * total),
    totalChapters: total,
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
   BACKGROUND — African patterns + Seed of Life
   Throttled to ~15fps (patterns are subtle)
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

  let frame = 0;
  function animate() {
    frame++;
    // Throttle to ~15fps — patterns don't need 60
    if (frame % 4 !== 0) { requestAnimationFrame(animate); return; }

    // Resize check
    if (frame % 120 === 0) {
      const newH = document.documentElement.scrollHeight;
      if (Math.abs(h - newH) > 50) { h = canvas.height = newH; }
    }

    ctx.clearRect(0, 0, w, h);

    // African ancestral patterns
    drawAfricanBackground(ctx, w, h, performance.now());

    // Seed of Life in hero area
    const scrollY = window.scrollY;
    const hcx = w / 2, hcy = window.innerHeight * 0.35 - scrollY * 0.3;
    const r = Math.min(w, window.innerHeight || 800) * 0.06;
    if (hcy > -r * 4 && hcy < window.innerHeight + r * 4) {
      const t = frame * 0.003;
      const breathe = 0.5 + 0.5 * Math.sin(t * 0.4);
      const gr = ctx.createRadialGradient(hcx, hcy + scrollY, 0, hcx, hcy + scrollY, r * 3);
      gr.addColorStop(0, `rgba(201,169,110,${0.025 + breathe * 0.015})`);
      gr.addColorStop(1, 'transparent');
      ctx.fillStyle = gr;
      ctx.fillRect(0, scrollY, w, window.innerHeight);

      const sy = hcy + scrollY;
      ctx.lineWidth = 0.5;
      for (let ring = 0; ring < 2; ring++) {
        const count = ring === 0 ? 1 : 6;
        const radius = ring === 0 ? 0 : r;
        for (let i = 0; i < count; i++) {
          const a = (i * Math.PI / 3) + t * 0.08;
          const cx = hcx + (radius ? Math.cos(a) * radius : 0);
          const cy = sy + (radius ? Math.sin(a) * radius : 0);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201,169,110,${ring === 0 ? 0.06 : 0.04})`;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════════════════
   ADINKRA SYMBOLS — Static SVGs for card identity
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
   COMPASS PATH FILTERING
   No display:none. No layout reflow. Just opacity.
   ═══════════════════════════════════════════════ */
const COMPASS_PATHS = {
  sovereign: ['crypto', 'bitcoin', 'keys', 'lightning', 'whispers', 'cloak', 'fortress'],
  coder:     ['math', 'algorithms', 'rust', 'wasm'],
  maker:     ['electricity', 'strength', 'manufacturing', 'industry'],
  founder:   ['enterprise', 'wealth', 'governance', 'rhetoric'],
  thinker:   ['systems', 'thought', 'crypto', 'bitcoin'],
};

let activePath = null;

function initCompass() {
  document.querySelectorAll('.compass-pill[data-path]').forEach(pill => {
    pill.addEventListener('click', e => {
      e.preventDefault();
      const path = pill.dataset.path;
      const grid = document.getElementById('books-grid');

      if (activePath === path) {
        // Deselect — restore all
        activePath = null;
        grid.classList.remove('path-active');
        grid.querySelectorAll('.book-card').forEach(c => {
          c.classList.remove('in-path', 'not-in-path');
          c.style.order = '';
        });
        document.querySelectorAll('.compass-pill').forEach(p => p.classList.remove('active'));
        return;
      }

      activePath = path;
      document.querySelectorAll('.compass-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const bookIds = COMPASS_PATHS[path] || [];
      grid.classList.add('path-active');

      // Separate path cards from non-path cards
      grid.querySelectorAll('.book-card').forEach(card => {
        const id = card.dataset.book;
        if (bookIds.includes(id)) {
          card.classList.add('in-path');
          card.classList.remove('not-in-path');
          card.style.order = bookIds.indexOf(id);
        } else {
          card.classList.remove('in-path');
          card.classList.add('not-in-path');
          card.style.order = '';
        }
      });

      // Scroll to the first in-path card after a brief paint
      requestAnimationFrame(() => {
        const first = grid.querySelector('.book-card.in-path');
        if (first) {
          first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
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
   LIBRARY CONTROLS — Sort, Filter, Search
   ═══════════════════════════════════════════════ */
function initControls(manifest) {
  const section = document.querySelector('.books-section');
  const sectionLabel = section.querySelector('.section-label');
  const totalLetters = manifest.books.reduce((s, b) => s + (b.letters || 0), 0);
  const categories = [...new Set(manifest.books.map(b => b.category || 'Other'))].sort();

  const controls = document.createElement('div');
  controls.className = 'library-controls';

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
    </div>
    <div class="ctrl-group" id="sort-group">
      <button class="ctrl-btn active" data-sort="default">Default</button>
      <button class="ctrl-btn" data-sort="title">A-Z</button>
      <button class="ctrl-btn" data-sort="progress">Progress</button>
    </div>`;

  sectionLabel.after(controls);

  // Sort
  controls.querySelector('#sort-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-sort]');
    if (!btn) return;
    controls.querySelectorAll('#sort-group .ctrl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sortBooks(btn.dataset.sort);
  });

  // Filter
  controls.querySelector('#filter-group').addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    controls.querySelectorAll('#filter-group .ctrl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Clear compass when using category filter
    if (activePath) {
      activePath = null;
      document.getElementById('books-grid').classList.remove('path-active');
      document.querySelectorAll('.book-card').forEach(c => { c.classList.remove('in-path'); c.style.order = ''; });
      document.querySelectorAll('.compass-pill').forEach(p => p.classList.remove('active'));
    }

    filterBooks(btn.dataset.filter);
  });

  // Search
  let searchTimer;
  controls.querySelector('#lib-search').addEventListener('input', e => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => filterBySearch(e.target.value.toLowerCase().trim()), 200);
  });
}

function sortBooks(key) {
  const grid = document.getElementById('books-grid');
  const cards = [...grid.querySelectorAll('.book-card')];

  if (key === 'title') {
    cards.sort((a, b) => a.querySelector('.card-title').textContent.localeCompare(b.querySelector('.card-title').textContent));
  } else if (key === 'progress') {
    cards.sort((a, b) => {
      const pa = parseFloat(a.dataset.progress || 0);
      const pb = parseFloat(b.dataset.progress || 0);
      return pb - pa;
    });
  }

  cards.forEach(card => grid.appendChild(card));
}

function filterBooks(category) {
  const grid = document.getElementById('books-grid');
  grid.querySelectorAll('.book-card').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
}

function filterBySearch(query) {
  document.querySelectorAll('.book-card').forEach(card => {
    if (!query || card.textContent.toLowerCase().includes(query)) {
      card.classList.remove('filtered-out');
    } else {
      card.classList.add('filtered-out');
    }
  });
}

/* ═══════════════════════════════════════════════
   CARD REVEAL ON SCROLL
   ═══════════════════════════════════════════════ */
function initCardReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px', threshold: 0.01 });

  document.querySelectorAll('.book-card').forEach(card => observer.observe(card));

  // Fallback
  setTimeout(() => {
    document.querySelectorAll('.book-card:not(.revealed)').forEach(c => c.classList.add('revealed'));
  }, 1500);
}

/* ═══════════════════════════════════════════════
   VIEW TRANSITIONS
   ═══════════════════════════════════════════════ */
function initViewTransitions() {
  if (!document.startViewTransition) return;
  document.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const href = card.getAttribute('href');
      document.startViewTransition(() => { window.location.href = href; });
    });
  });
}

/* ═══════════════════════════════════════════════
   LOAD LIBRARY — The single entry point
   ═══════════════════════════════════════════════ */
async function loadLibrary() {
  try {
    const res = await fetch('books/manifest.json');
    const manifest = await res.json();
    _manifestCache = manifest; // Cache for getProgress() and other consumers
    euler.load_manifest(JSON.stringify(manifest));
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';

    manifest.books.forEach((book, idx) => {
      const symbol = adinkraSVGs[book.symbol] || adinkraSVGs.nsoromma;
      const progress = getProgress(book.id);
      const pct = book.letters > 0 ? Math.min(progress.chaptersRead / book.letters, 1) : 0;
      const pctLabel = pct > 0 ? `${Math.round(pct * 100)}%` : '';

      const card = document.createElement('a');
      card.className = 'book-card';
      card.href = `read.html?book=${book.id}`;
      card.dataset.book = book.id;
      card.dataset.category = book.category || 'Other';
      card.dataset.progress = pct.toFixed(2);
      card.style.setProperty('--card-accent', book.accent || '#c9a96e');
      // Stagger reveal via CSS custom property
      card.style.setProperty('--reveal-delay', `${idx * 0.04}s`);

      card.innerHTML = `
        <div class="card-header" style="color:${book.accent || '#c9a96e'}">
          <div class="card-symbol">${symbol}</div>
          ${pctLabel ? `<div class="card-pct">${pctLabel}</div>` : ''}
        </div>
        <div class="card-body">
          <div class="card-title">${book.title}</div>
          <div class="card-meta">
            <strong>${book.letters}</strong> letters &middot;
            <strong>${book.parts}</strong> parts
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    initCardReveal();
    initContinueBanner(manifest);
    initControls(manifest);
    initCompass();
    initViewTransitions();

  } catch (err) {
    document.getElementById('books-grid').innerHTML =
      `<p style="color:#8b3a3a;text-align:center;padding:2rem">Failed to load library: ${err.message}</p>`;
  }
}

loadLibrary();
