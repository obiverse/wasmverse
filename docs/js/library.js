/* ═══════════════════════════════════════════════
   LIBRARY — Hub page logic

   The Taoist rewrite: remove strokes until only
   the essential remain.

   - No per-card canvas animations (Adinkra SVG instead)
   - No 3D tilt (CSS-only hover)
   - No display:none filtering (opacity + order)
   - No transform conflicts (CSS owns transform)
   ═══════════════════════════════════════════════ */

import { boot, applyTheme, applyTypography } from '../euler-shell.js';
import { drawAfricanBackground } from './african-patterns.js';
import { generateCertificate } from './certificate.js';
import * as idb from './idb.js';
import * as nostr from './nostr-shell.js';

const [euler] = await Promise.all([boot(), nostr.restoreSession()]);
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
   THE HERALD — What's New banner for returning readers

   Fetches changelog.json, compares version against
   last-seen, shows a banner with new entries.
   Fire-and-forget: offline or fetch failure = silent.
   ═══════════════════════════════════════════════ */
const HERALD_KEY = 'letterverse_herald_v';

async function initHerald() {
  try {
    const resp = await fetch('changelog.json');
    if (!resp.ok) return;
    const log = await resp.json();

    const seen = parseInt(localStorage.getItem(HERALD_KEY) || '0', 10);

    // First visit: store current version, no banner
    if (!seen) {
      localStorage.setItem(HERALD_KEY, String(log.version));
      return;
    }

    // Nothing new
    if (log.version <= seen) return;

    const fresh = log.entries.filter(e => e.v > seen);
    if (!fresh.length) return;

    const banner = document.createElement('div');
    banner.className = 'herald-banner';
    banner.innerHTML = `
      <div class="herald-summary">
        <span class="herald-icon">&#9881;</span>
        <span class="herald-text">${heraldSummary(fresh)}</span>
        <button class="herald-toggle" aria-label="Expand details">&#9662;</button>
        <button class="herald-dismiss" aria-label="Dismiss">&times;</button>
      </div>
      <div class="herald-details" hidden>
        ${fresh.map(e => `
          <div class="herald-entry">
            <span class="herald-date">${e.date}</span>
            <span class="herald-desc">${e.summary}</span>
          </div>`).join('')}
      </div>`;

    // Toggle details
    banner.querySelector('.herald-toggle').addEventListener('click', () => {
      const details = banner.querySelector('.herald-details');
      const btn = banner.querySelector('.herald-toggle');
      const open = details.hidden;
      details.hidden = !open;
      btn.textContent = open ? '\u25B4' : '\u25BE';
    });

    // Dismiss
    banner.querySelector('.herald-dismiss').addEventListener('click', () => {
      localStorage.setItem(HERALD_KEY, String(log.version));
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(-10px)';
      setTimeout(() => banner.remove(), 300);
    });

    const section = document.querySelector('.books-section');
    section.parentNode.insertBefore(banner, section);
  } catch (_) { /* offline or error — silent */ }
}

function heraldSummary(entries) {
  if (entries.length === 1) return entries[0].summary;
  const bookType = entries.filter(e => e.type === 'book').length;
  const letterType = entries.filter(e => e.type === 'letters').length;
  const parts = [];
  if (bookType) parts.push(`${bookType} new treatise${bookType > 1 ? 's' : ''}`);
  if (letterType) parts.push(`new letters in ${letterType} book${letterType > 1 ? 's' : ''}`);
  if (!parts.length) return `${entries.length} updates since your last visit`;
  return parts.join(' &middot; ') + ' since your last visit';
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

    // Update label from manifest (no hardcoded count)
    document.getElementById('library-label').textContent =
      `The Library — ${manifest.books.length} Treatises`;

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
          <div class="card-header-right">
            ${book.topic ? `<div class="card-topic" style="color:${book.accent || '#c9a96e'}">${book.topic}</div>` : ''}
            ${pctLabel ? `<div class="card-pct">${pctLabel}</div>` : ''}
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${book.title}</div>
          ${book.description ? `<div class="card-desc">${book.description}</div>` : ''}
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
    initHerald();
    initControls(manifest);
    initCompass();
    initViewTransitions();
    warmRecentBooks(manifest); // fire-and-forget — never blocks render
    initSovereignCompass(manifest); // fire-and-forget — personalises after auth
    initApprenticeship(manifest); // fire-and-forget — quiz + curriculum

  } catch (err) {
    document.getElementById('books-grid').innerHTML =
      `<p style="color:#8b3a3a;text-align:center;padding:2rem">Failed to load library: ${err.message}</p>`;
  }
}

/* ═══════════════════════════════════════════════
   PROACTIVE BOOK WARMING — Quota-aware preload

   After the library renders, silently pre-cache
   the reader's most recently-read books into IDB
   so they open instantly on next visit.

   Guards (all must pass before any fetch):
   1. Not data-saver mode / slow connection
   2. Storage estimate shows >10 MB available
   3. Book not already cached in IDB
   ═══════════════════════════════════════════════ */
async function warmRecentBooks(manifest) {
  try {
    // Guard 1: respect data-saver and slow connections
    const conn = navigator.connection;
    if (conn?.saveData || ['slow-2g', '2g'].includes(conn?.effectiveType)) return;

    // Guard 2: only warm if there is comfortable headroom
    if (navigator.storage?.estimate) {
      const { quota, usage } = await navigator.storage.estimate();
      if (quota - usage < 10 * 1024 * 1024) return; // <10 MB available — skip
    }

    // Find books the reader has actually opened, sorted newest-first
    const recentIds = manifest.books
      .map(b => ({ id: b.id, file: b.file, lastRead: euler.get_last_read(b.id) }))
      .filter(b => b.lastRead > 0)
      .sort((a, b) => b.lastRead - a.lastRead)
      .slice(0, 3); // warm the 3 most recent — enough to feel instant

    for (const book of recentIds) {
      // Guard 3: skip if already cached
      const already = await idb.getCachedBook(book.id);
      if (already) continue;

      // Fetch quietly in the background — reader never waits for this
      fetch(book.file)
        .then(async res => {
          if (!res.ok) return;
          const content = await res.text();
          const etag = res.headers.get('etag') || res.headers.get('last-modified') || '';
          idb.cacheBook(book.id, content, etag);
        })
        .catch(() => {});
    }
  } catch {}
}

/* ═══════════════════════════════════════════════
   SOVEREIGN COMPASS — personalised next-book hints
   Runs after library renders. Fetches attestations
   from relay, marks next recommended books on cards.
   ═══════════════════════════════════════════════ */
async function initSovereignCompass(manifest) {
  if (!nostr.isConnected()) return;
  try {
    const records = await nostr.fetchProgress();
    const completed = new Set(
      records
        .filter(r => r.t === 'letterverse-attestation' && r.book)
        .map(r => r.book)
    );
    if (completed.size === 0) return;

    // Collect next-book recommendations from completed books
    const nextIds = new Set();
    for (const book of manifest.books) {
      if (completed.has(book.id) && Array.isArray(book.next)) {
        book.next.forEach(id => { if (!completed.has(id)) nextIds.add(id); });
      }
    }
    if (nextIds.size === 0) return;

    // Badge completed cards and highlight next cards
    const grid = document.getElementById('books-grid');
    grid.querySelectorAll('.book-card').forEach(card => {
      const id = card.dataset.book;
      if (completed.has(id)) {
        card.classList.add('sovereign-done');
        const sym = card.querySelector('.card-symbol');
        if (sym && !sym.querySelector('.done-mark')) {
          const mark = document.createElement('span');
          mark.className = 'done-mark';
          mark.title = 'Attestation on relay';
          mark.textContent = '◉';
          sym.appendChild(mark);
        }
      }
      if (nextIds.has(id)) {
        card.classList.add('sovereign-next');
        if (!card.querySelector('.next-badge')) {
          const badge = document.createElement('div');
          badge.className = 'next-badge';
          badge.textContent = 'Next for you';
          card.querySelector('.card-header')?.appendChild(badge);
        }
      }
    });

    // Check for completed compass paths → celebration
    checkPathCompletions(completed, manifest);

    // Add "Your Path" pill to the compass if not already there
    const compassScroll = document.querySelector('.compass-scroll');
    if (compassScroll && !document.getElementById('compass-your-path')) {
      const pill = document.createElement('a');
      pill.className = 'compass-pill active';
      pill.id = 'compass-your-path';
      pill.href = '#library';
      pill.innerHTML =
        `<span class="compass-icon">&#9670;</span>` +
        `<span class="compass-name">Your Path</span>` +
        `<span class="compass-trail">${[...nextIds].slice(0, 4).join(' \u2192 ')}</span>`;
      pill.addEventListener('click', e => {
        e.preventDefault();
        const isActive = pill.classList.contains('active');
        grid.querySelectorAll('.book-card').forEach(c => {
          c.classList.remove('in-path', 'not-in-path');
          c.style.order = '';
        });
        if (!isActive) {
          grid.classList.add('path-active');
          grid.querySelectorAll('.book-card').forEach(c => {
            if (nextIds.has(c.dataset.book)) {
              c.classList.add('in-path');
            } else {
              c.classList.add('not-in-path');
            }
          });
          pill.classList.add('active');
        } else {
          grid.classList.remove('path-active');
          pill.classList.remove('active');
        }
      });
      compassScroll.prepend(pill);
    }
  } catch {}
}

/* ═══════════════════════════════════════════════
   SCROLL CERTIFICATE — Path completion celebration

   Detects when all books in a Compass path are
   completed. Shows celebration overlay. Offers
   downloadable PNG certificate.
   ═══════════════════════════════════════════════ */
const CELEBRATED_KEY = 'letterverse_celebrated_paths';

function getCelebratedPaths() {
  try { return JSON.parse(localStorage.getItem(CELEBRATED_KEY) || '[]'); } catch { return []; }
}

function markPathCelebrated(pathName) {
  const paths = getCelebratedPaths();
  if (!paths.includes(pathName)) {
    paths.push(pathName);
    localStorage.setItem(CELEBRATED_KEY, JSON.stringify(paths));
  }
}

function checkPathCompletions(completedBooks, manifest) {
  const celebrated = getCelebratedPaths();

  for (const [pathName, bookIds] of Object.entries(COMPASS_PATHS)) {
    if (celebrated.includes(pathName)) continue;
    if (!bookIds.every(id => completedBooks.has(id))) continue;

    // Path completed! Show celebration
    const books = bookIds
      .map(id => manifest.books.find(b => b.id === id))
      .filter(Boolean)
      .map(b => ({ title: b.title, symbol: b.symbol, accent: b.accent }));

    showCelebration(pathName, books);
    break; // One celebration at a time
  }
}

async function showCelebration(pathName, books) {
  const overlay = document.getElementById('celebration-overlay');
  const content = document.getElementById('celebration-content');
  if (!overlay || !content) return;

  const pathTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1) + '\u2019s Path';
  const profile = nostr.getProfile?.() || {};
  const readerName = profile.name || nostr.getPubkeyDisplay?.() || 'Sovereign Reader';
  const pubkey = nostr.getPubkey?.() || '';
  const dateStr = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });

  content.innerHTML = `
    <div class="celebration-title">Path Complete</div>
    <div class="celebration-path">${pathTitle}</div>
    <div class="celebration-books">
      ${books.map(b => `<span class="celebration-book" style="color:${b.accent || '#c9a96e'}">${b.title}</span>`).join(' \u2192 ')}
    </div>
    <div class="celebration-subtitle">Your attestation is on the Nostr relay.</div>
    <div class="celebration-actions">
      <button class="celebration-download" id="cert-download">Download Certificate</button>
      <button class="celebration-dismiss" id="cert-dismiss">Continue</button>
    </div>
    <div class="celebration-lightning">
      <a href="#" data-lightning="letterverse@breez.tips" class="celebration-zap">
        &#9889; Support the library \u2014 5000 sats
      </a>
    </div>`;

  overlay.hidden = false;

  // Publish path attestation
  nostr.publishPathAttestation(pathName, books.map(b => b.title));

  // Animate celebration canvas
  const canvas = document.getElementById('celebration-canvas');
  if (canvas) drawCelebrationParticles(canvas);

  // Download certificate
  document.getElementById('cert-download')?.addEventListener('click', async () => {
    const btn = document.getElementById('cert-download');
    btn.textContent = 'Generating\u2026';
    btn.disabled = true;
    try {
      const blob = await generateCertificate({
        pathName,
        readerName,
        books,
        pubkey,
        date: dateStr,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `letterverse-${pathName}-certificate.png`;
      a.click();
      URL.revokeObjectURL(url);
      btn.textContent = '\u2713 Downloaded';
    } catch {
      btn.textContent = 'Failed \u2014 try again';
      btn.disabled = false;
    }
  });

  // Dismiss
  document.getElementById('cert-dismiss')?.addEventListener('click', () => {
    markPathCelebrated(pathName);
    overlay.hidden = true;
  });

  overlay.querySelector('.celebration-close')?.addEventListener('click', () => {
    markPathCelebrated(pathName);
    overlay.hidden = true;
  });

  // Wire lightning link if connect.js is available
  try {
    const { wireLightningLinks } = await import('./connect.js');
    wireLightningLinks('.celebration-lightning [data-lightning]');
  } catch {}
}

function drawCelebrationParticles(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 1 + Math.random() * 2,
    dx: (Math.random() - 0.5) * 0.5,
    dy: -0.3 - Math.random() * 0.5,
    a: 0.3 + Math.random() * 0.5,
  }));

  let frame = 0;
  function draw() {
    if (frame > 200 || canvas.closest('[hidden]')) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.a *= 0.995;
      if (p.y < 0) { p.y = h; p.a = 0.3 + Math.random() * 0.5; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,169,110,${p.a})`;
      ctx.fill();
    });
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════
   APPRENTICESHIP ENGINE — "Find Your Path" quiz

   5 questions → personalised 8/12/16 week curriculum.
   Persisted to IDB. Displayed above book grid on
   return visits.
   ═══════════════════════════════════════════════ */

const QUIZ_QUESTIONS = [
  {
    id: 'builds',
    text: 'What do you build?',
    options: [
      { label: 'Software & Apps',       tags: ['wasm', 'rust', 'pwa', 'algorithms', 'making'] },
      { label: 'Hardware & Electronics', tags: ['electricity', 'strength', 'manufacturing', 'industry'] },
      { label: 'Businesses & Teams',     tags: ['enterprise', 'wealth', 'governance', 'rhetoric'] },
      { label: 'Ideas & Writing',        tags: ['rhetoric', 'thought', 'systems', 'canvas'] },
      { label: 'Nothing yet — show me',  tags: ['math', 'enterprise', 'bitcoin'] },
    ]
  },
  {
    id: 'learn',
    text: 'What do you most want to understand?',
    options: [
      { label: 'How money really works',           tags: ['bitcoin', 'wealth', 'lightning', 'keys'] },
      { label: 'How to build things that last',     tags: ['rust', 'wasm', 'algorithms', 'euler', 'making'] },
      { label: 'How to protect my digital life',    tags: ['crypto', 'keys', 'whispers', 'cloak', 'fortress'] },
      { label: 'How systems and societies work',    tags: ['systems', 'governance', 'thought', 'rhetoric'] },
      { label: 'How the physical world works',      tags: ['electricity', 'strength', 'manufacturing', 'math'] },
    ]
  },
  {
    id: 'math',
    text: 'How comfortable are you with mathematics?',
    options: [
      { label: 'Very — I enjoy proofs',       tags: ['math', 'algorithms', 'crypto'] },
      { label: 'Somewhat — I can follow along', tags: ['math'] },
      { label: 'Not yet — start from zero',    tags: ['enterprise', 'rhetoric'] },
    ]
  },
  {
    id: 'time',
    text: 'How much time per week can you dedicate?',
    options: [
      { label: '1\u20132 hours',  planSize: 8 },
      { label: '3\u20135 hours',  planSize: 12 },
      { label: '5+ hours',       planSize: 16 },
    ]
  },
  {
    id: 'goal',
    text: 'What is your ultimate goal?',
    options: [
      { label: 'Build a product',           tags: ['wasm', 'pwa', 'rust', 'enterprise', 'making'] },
      { label: 'Financial sovereignty',      tags: ['bitcoin', 'lightning', 'keys', 'wealth'] },
      { label: 'Deep understanding',         tags: ['math', 'systems', 'thought', 'euler', 'crypto'] },
      { label: 'Career transformation',      tags: ['rust', 'algorithms', 'wasm', 'pwa', 'enterprise'] },
    ]
  }
];

function initApprenticeship(manifest) {
  const trigger = document.getElementById('quiz-trigger');
  const overlay = document.getElementById('quiz-overlay');
  if (!trigger || !overlay) return;

  // Check for existing curriculum and render it
  idb.loadCurriculum().then(plan => {
    if (plan) renderCurriculum(plan, manifest);
  });

  trigger.addEventListener('click', e => {
    e.preventDefault();
    idb.loadCurriculum().then(existing => {
      if (existing) {
        // Scroll to curriculum if it exists
        const el = document.querySelector('.curriculum-section');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
      }
      openQuiz(manifest);
    });
  });

  overlay.querySelector('.quiz-close').addEventListener('click', () => {
    overlay.hidden = true;
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.hidden = true;
  });
}

function openQuiz(manifest) {
  const overlay = document.getElementById('quiz-overlay');
  const body = document.getElementById('quiz-body');
  const progress = document.getElementById('quiz-progress');
  overlay.hidden = false;

  let step = 0;
  const answers = {};

  function renderStep() {
    const q = QUIZ_QUESTIONS[step];
    progress.textContent = `${step + 1} of ${QUIZ_QUESTIONS.length}`;

    body.innerHTML = `
      <div class="quiz-question">${q.text}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) =>
          `<button class="quiz-option" data-idx="${i}">${opt.label}</button>`
        ).join('')}
      </div>`;

    body.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const opt = q.options[parseInt(btn.dataset.idx)];
        answers[q.id] = opt;
        step++;
        if (step < QUIZ_QUESTIONS.length) {
          renderStep();
        } else {
          finishQuiz(manifest, answers);
        }
      });
    });
  }

  renderStep();
}

function finishQuiz(manifest, answers) {
  const overlay = document.getElementById('quiz-overlay');
  const body = document.getElementById('quiz-body');
  const progress = document.getElementById('quiz-progress');
  progress.textContent = '';

  // Score books by tag overlap
  const tagCounts = {};
  for (const ans of Object.values(answers)) {
    if (ans.tags) ans.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
  }

  const planSize = answers.time?.planSize || 12;
  const scored = manifest.books.map(book => {
    let score = 0;
    // Direct tag match (book.id matches a tag)
    if (tagCounts[book.id]) score += tagCounts[book.id] * 3;
    // Category match
    const cat = (book.category || '').toLowerCase();
    if (tagCounts[cat]) score += tagCounts[cat];
    // Next-field overlap (books recommended by high-scored books get a boost)
    if (book.next) book.next.forEach(n => { if (tagCounts[n]) score += 1; });
    return { ...book, score };
  });

  // Sort by score, take top N
  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, planSize).filter(b => b.score > 0);

  // Respect prerequisites: if A.next contains B, A should come before B
  selected.sort((a, b) => {
    if (a.next?.includes(b.id)) return -1;
    if (b.next?.includes(a.id)) return 1;
    return b.score - a.score;
  });

  // Group into weeks (1-2 books/week based on letter count)
  const weeks = [];
  let weekBooks = [];
  let weekLetters = 0;
  const lettersPerWeek = Math.ceil(selected.reduce((s, b) => s + b.letters, 0) / Math.ceil(selected.length / 1.5));

  selected.forEach(book => {
    weekBooks.push({ id: book.id, title: book.title, letters: book.letters, accent: book.accent, symbol: book.symbol });
    weekLetters += book.letters;
    if (weekLetters >= lettersPerWeek || weekBooks.length >= 2) {
      weeks.push({ weekNum: weeks.length + 1, books: weekBooks });
      weekBooks = [];
      weekLetters = 0;
    }
  });
  if (weekBooks.length) weeks.push({ weekNum: weeks.length + 1, books: weekBooks });

  const plan = { weeks, createdAt: Date.now(), answers: Object.fromEntries(
    Object.entries(answers).map(([k, v]) => [k, v.label])
  )};

  // Save to IDB
  idb.saveCurriculum(plan);

  // Show result in quiz modal
  body.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-title">Your ${weeks.length}-Week Curriculum</div>
      <div class="quiz-result-subtitle">${selected.length} treatises selected for you</div>
      <div class="quiz-weeks">
        ${weeks.map(w => `
          <div class="quiz-week">
            <div class="quiz-week-num">Week ${w.weekNum}</div>
            ${w.books.map(b => `
              <a href="read.html?book=${b.id}" class="quiz-week-book" style="--card-accent:${b.accent || '#c9a96e'}">
                ${b.title} <span class="quiz-week-letters">${b.letters} letters</span>
              </a>`).join('')}
          </div>`).join('')}
      </div>
      <div class="quiz-actions">
        <button class="quiz-option quiz-done">Begin the Journey</button>
        <button class="quiz-retake">Retake Quiz</button>
      </div>
    </div>`;

  body.querySelector('.quiz-done')?.addEventListener('click', () => {
    overlay.hidden = true;
    renderCurriculum(plan, manifest);
  });

  body.querySelector('.quiz-retake')?.addEventListener('click', () => {
    idb.clearCurriculum();
    const existing = document.querySelector('.curriculum-section');
    if (existing) existing.remove();
    openQuiz(manifest);
  });
}

function renderCurriculum(plan, manifest) {
  // Remove existing curriculum section if any
  document.querySelector('.curriculum-section')?.remove();

  const section = document.createElement('div');
  section.className = 'curriculum-section';

  const allBooks = plan.weeks.flatMap(w => w.books);
  section.innerHTML = `
    <div class="curriculum-header">
      <div class="curriculum-label">Your Curriculum</div>
      <div class="curriculum-meta">${plan.weeks.length} weeks &middot; ${allBooks.length} treatises</div>
      <button class="curriculum-retake" title="Retake quiz">&#8634;</button>
    </div>
    <div class="curriculum-timeline">
      ${plan.weeks.map(w => `
        <div class="curriculum-week">
          <div class="curriculum-week-marker">W${w.weekNum}</div>
          ${w.books.map(b => {
            const prog = euler.get_book_progress_pct(b.id);
            const pct = Math.round(prog * 100);
            return `<a href="read.html?book=${b.id}" class="curriculum-book" style="--card-accent:${b.accent || '#c9a96e'}">
              <span class="curriculum-book-title">${b.title}</span>
              ${pct > 0 ? `<span class="curriculum-book-pct">${pct}%</span>` : ''}
            </a>`;
          }).join('')}
        </div>`).join('')}
    </div>`;

  section.querySelector('.curriculum-retake').addEventListener('click', () => {
    idb.clearCurriculum();
    section.remove();
    openQuiz(manifest);
  });

  const booksSection = document.querySelector('.books-section');
  booksSection.parentNode.insertBefore(section, booksSection);
}

loadLibrary();
