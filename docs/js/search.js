/* ═══════════════════════════════════════════════
   SEARCH — Global Cmd+K search across all books
   Uses Euler's TF-IDF index for real ranked results
   ═══════════════════════════════════════════════ */

import { get as getEuler } from '../euler-shell.js';

let overlay, input, resultsEl, statusEl;
let indexed = false;
let focusIdx = -1;
let manifest = null;
let bookTitles = {};

/* ── Build the DOM ─────────────────────────── */
function createModal() {
  overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-modal">
      <div class="search-input-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input class="search-input" type="text" placeholder="Search all treatises\u2026" autocomplete="off" spellcheck="false">
        <span class="search-kbd">ESC</span>
      </div>
      <div class="search-status" id="search-status"></div>
      <div class="search-results" id="search-results">
        <div class="search-empty">Type to search across all letters</div>
      </div>
      <div class="search-footer">
        <span>\u2191\u2193 navigate</span>
        <span>\u23CE open</span>
        <span>esc close</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  input = overlay.querySelector('.search-input');
  resultsEl = overlay.querySelector('#search-results');
  statusEl = overlay.querySelector('#search-status');

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Input handler with debounce
  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => search(input.value.trim()), 150);
  });

  // Keyboard navigation inside modal
  input.addEventListener('keydown', e => {
    const items = resultsEl.querySelectorAll('.search-result');
    if (e.key === 'Escape') { close(); e.preventDefault(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1, items); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1, items); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      const focused = resultsEl.querySelector('.search-result.focused') || items[0];
      if (focused) { window.location.href = focused.href; close(); }
    }
  });
}

/* ── Open / Close ──────────────────────────── */
export function open() {
  if (!overlay) createModal();
  overlay.classList.add('open');
  input.value = '';
  resultsEl.innerHTML = '<div class="search-empty">Type to search across all letters</div>';
  statusEl.textContent = '';
  focusIdx = -1;
  setTimeout(() => input.focus(), 50);

  // Index books lazily on first open
  if (!indexed) indexAllBooks();
}

export function close() {
  if (!overlay) return;
  overlay.classList.remove('open');
  input.blur();
}

export function toggle() {
  if (overlay?.classList.contains('open')) close();
  else open();
}

/* ── Index all books into Euler's TF-IDF engine ── */
async function indexAllBooks() {
  const euler = getEuler();
  if (!euler) { statusEl.textContent = 'Euler not loaded'; return; }

  statusEl.textContent = 'Indexing treatises\u2026';

  try {
    // Fetch manifest
    const res = await fetch('books/manifest.json');
    manifest = await res.json();

    // Build title map
    for (const book of manifest.books) {
      bookTitles[book.id] = book.title;
    }

    // Fetch ALL books in parallel (not sequential — 33 books × ~100KB each)
    const fetchResults = await Promise.allSettled(
      manifest.books.map(async (book) => {
        const bookRes = await fetch(book.file);
        if (!bookRes.ok) return null;
        return { id: book.id, md: await bookRes.text() };
      })
    );

    // Index chapters from successful fetches
    let totalChapters = 0;
    for (const result of fetchResults) {
      if (result.status !== 'fulfilled' || !result.value) continue;
      const { id, md } = result.value;
      const chapters = splitIntoChapters(md);
      for (const ch of chapters) {
        euler.index_book(id + ':' + ch.id, ch.title, ch.content);
        totalChapters++;
      }
    }

    indexed = true;
    statusEl.textContent = `${manifest.books.length} treatises, ${totalChapters} chapters indexed`;
    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2000);
  } catch (err) {
    statusEl.textContent = 'Failed to index: ' + err.message;
  }
}

/* ── Split markdown into chapters for per-letter indexing ── */
function splitIntoChapters(md) {
  const lines = md.split('\n');
  const chapters = [];
  let current = null;

  for (const line of lines) {
    if (/^### Letter \d+/.test(line) || /^## Preface/.test(line) || /^## Epilogue/.test(line)) {
      if (current) chapters.push(current);
      const title = line.replace(/^#{2,3}\s+/, '');
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
      current = { title, id, content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  }
  if (current) chapters.push(current);
  return chapters;
}

/* ── Execute search ──────────────────────────── */
function search(query) {
  const euler = getEuler();
  if (!euler || !query) {
    resultsEl.innerHTML = '<div class="search-empty">Type to search across all letters</div>';
    statusEl.textContent = '';
    focusIdx = -1;
    return;
  }

  if (!indexed) {
    resultsEl.innerHTML = '<div class="search-empty">Indexing\u2026</div>';
    return;
  }

  const json = euler.search_library(query, 20);
  const results = JSON.parse(json);

  if (results.length === 0) {
    resultsEl.innerHTML = `<div class="search-empty">No results for \u201c${escHtml(query)}\u201d</div>`;
    statusEl.textContent = '';
    focusIdx = -1;
    return;
  }

  statusEl.textContent = `${results.length} result${results.length > 1 ? 's' : ''}`;
  focusIdx = -1;

  resultsEl.innerHTML = results.map((r, i) => {
    // docId format: "bookId:chapter-slug"
    const [bookId, ...chapterParts] = r.id.split(':');
    const chapterId = chapterParts.join(':');
    const bookTitle = bookTitles[bookId] || bookId;
    const href = `read.html?book=${bookId}#${chapterId}`;

    // Highlight query terms in snippet
    const snippet = highlightTerms(r.snippet, query);

    return `<a class="search-result" href="${href}" data-index="${i}">
      <div class="search-result-book">${escHtml(bookTitle)}</div>
      <div class="search-result-title">${escHtml(r.title)}</div>
      <div class="search-result-snippet">${snippet}</div>
    </a>`;
  }).join('');
}

/* ── Highlight query terms in snippet ─────── */
function highlightTerms(text, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  let html = escHtml(text);
  for (const term of terms) {
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    html = html.replace(regex, '<mark>$1</mark>');
  }
  return html;
}

/* ── Arrow key navigation ─────────────────── */
function moveFocus(dir, items) {
  if (items.length === 0) return;
  items.forEach(el => el.classList.remove('focused'));
  focusIdx = Math.max(0, Math.min(items.length - 1, focusIdx + dir));
  items[focusIdx].classList.add('focused');
  items[focusIdx].scrollIntoView({ block: 'nearest' });
}

/* ── Escape HTML ──────────────────────────── */
function escHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Global keyboard shortcut ─────────────── */
document.addEventListener('keydown', e => {
  // Cmd+K or Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    toggle();
    return;
  }
  // / to open search (when not in input)
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
    e.preventDefault();
    open();
  }
});
