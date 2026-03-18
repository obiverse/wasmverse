/* ═══════════════════════════════════════════════
   THE EPISTOLARY LIBRARY — Shared State Module
   Centralized persistence for progress, themes,
   typography, bookmarks, highlights, and study data
   ═══════════════════════════════════════════════ */

const KEYS = {
  progress:   'epistolary_progress',
  pwa:        'epistolary_pwa',
  theme:      'epistolary_theme',
  typography: 'epistolary_typography',
  bookmarks:  'epistolary_bookmarks',
  highlights: 'epistolary_highlights',
};

// ── Generic storage helpers ───────────────────
function _get(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

function _set(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Reading Progress ──────────────────────────
export function getProgress(bookId) {
  const all = _get(KEYS.progress, {});
  return bookId ? (all[bookId] || { chaptersRead: 0, totalChapters: 0, lastRead: null })
                : all;
}

export function saveProgress(bookId, data) {
  const all = _get(KEYS.progress, {});
  all[bookId] = { ...all[bookId], ...data, lastRead: Date.now() };
  _set(KEYS.progress, all);
}

export function getLastReadBook() {
  const all = _get(KEYS.progress, {});
  let latest = null;
  for (const [id, p] of Object.entries(all)) {
    if (p.lastRead && p.chaptersRead > 0 && p.chaptersRead < p.totalChapters) {
      if (!latest || p.lastRead > latest.lastRead) {
        latest = { bookId: id, ...p };
      }
    }
  }
  return latest;
}

// ── Themes ────────────────────────────────────
export const THEMES = {
  midnight:  { '--bg-deep': '#06060e', '--bg': '#0a0a14', '--bg-elevated': '#0f0f1e', '--bg-code': '#0c0c18', '--text': '#ddd5c4', '--text-dim': '#9e9684', '--text-bright': '#f0e8d8', '--gold': '#c9a96e', '--gold-bright': '#e4c98a', '--gold-dim': '#8b6914', '--gold-glow': 'rgba(201,169,110,0.12)', '--border': '#1e1e30', '--border-subtle': '#16162a' },
  parchment: { '--bg-deep': '#efe8d8', '--bg': '#faf7f0', '--bg-elevated': '#f4efe4', '--bg-code': '#ece5d4', '--text': '#2a2520', '--text-dim': '#6b6358', '--text-bright': '#1a1510', '--gold': '#8b6914', '--gold-bright': '#6b4f1d', '--gold-dim': '#b8951f', '--gold-glow': 'rgba(139,105,20,0.12)', '--border': '#d8ceb8', '--border-subtle': '#e2d9c8' },
  sepia:     { '--bg-deep': '#ede3cc', '--bg': '#f5edd8', '--bg-elevated': '#efe7d0', '--bg-code': '#e8e0c8', '--text': '#3d3229', '--text-dim': '#7a6e5e', '--text-bright': '#2a2118', '--gold': '#6b4f1d', '--gold-bright': '#523a12', '--gold-dim': '#9e7a30', '--gold-glow': 'rgba(107,79,29,0.12)', '--border': '#d0c4aa', '--border-subtle': '#dbd0b8' },
  dawn:      { '--bg-deep': '#1a1520', '--bg': '#201a2a', '--bg-elevated': '#281f35', '--bg-code': '#1e1828', '--text': '#d8cce0', '--text-dim': '#9a8ba8', '--text-bright': '#efe4f8', '--gold': '#b088d0', '--gold-bright': '#c8a0e8', '--gold-dim': '#7a5a9a', '--gold-glow': 'rgba(176,136,208,0.12)', '--border': '#352a45', '--border-subtle': '#2a2038' },
};

export function getTheme() {
  return _get(KEYS.theme, 'midnight');
}

export function setTheme(name) {
  if (!THEMES[name]) return;
  _set(KEYS.theme, name);
  applyTheme(name);
}

export function applyTheme(name) {
  const vars = THEMES[name || getTheme()];
  if (!vars) return;
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(vars)) {
    root.style.setProperty(prop, val);
  }
  document.body.dataset.theme = name || getTheme();
}

// ── Typography ────────────────────────────────
const TYPO_DEFAULTS = { fontSize: 19, lineHeight: 1.85, contentMax: 72 };

export function getTypography() {
  return { ...TYPO_DEFAULTS, ..._get(KEYS.typography, {}) };
}

export function setTypography(settings) {
  const typo = { ...getTypography(), ...settings };
  _set(KEYS.typography, typo);
  applyTypography(typo);
}

export function applyTypography(settings) {
  const t = settings || getTypography();
  const root = document.documentElement;
  root.style.setProperty('--font-size', t.fontSize + 'px');
  root.style.setProperty('--line-height', String(t.lineHeight));
  root.style.setProperty('--content-max', t.contentMax + 'ch');
}

// ── Bookmarks ─────────────────────────────────
export function getBookmarks(bookId) {
  const all = _get(KEYS.bookmarks, {});
  return bookId ? (all[bookId] || []) : all;
}

export function toggleBookmark(bookId, chapterId) {
  const all = _get(KEYS.bookmarks, {});
  if (!all[bookId]) all[bookId] = [];
  const idx = all[bookId].findIndex(b => b.chapterId === chapterId);
  if (idx >= 0) {
    all[bookId].splice(idx, 1);
    _set(KEYS.bookmarks, all);
    return false; // removed
  } else {
    all[bookId].push({ chapterId, timestamp: Date.now() });
    _set(KEYS.bookmarks, all);
    return true; // added
  }
}

export function isBookmarked(bookId, chapterId) {
  return getBookmarks(bookId).some(b => b.chapterId === chapterId);
}

// ── Highlights ────────────────────────────────
export function getHighlights(bookId) {
  const all = _get(KEYS.highlights, {});
  return bookId ? (all[bookId] || []) : all;
}

export function saveHighlight(bookId, highlight) {
  const all = _get(KEYS.highlights, {});
  if (!all[bookId]) all[bookId] = [];
  // highlight: { id, chapterId, text, color, startOffset, endOffset, note?, timestamp }
  highlight.timestamp = highlight.timestamp || Date.now();
  highlight.id = highlight.id || crypto.randomUUID();
  all[bookId].push(highlight);
  _set(KEYS.highlights, all);
  return highlight.id;
}

export function updateHighlight(bookId, highlightId, patch) {
  const all = _get(KEYS.highlights, {});
  if (!all[bookId]) return;
  const h = all[bookId].find(h => h.id === highlightId);
  if (h) Object.assign(h, patch);
  _set(KEYS.highlights, all);
}

export function removeHighlight(bookId, highlightId) {
  const all = _get(KEYS.highlights, {});
  if (!all[bookId]) return;
  all[bookId] = all[bookId].filter(h => h.id !== highlightId);
  _set(KEYS.highlights, all);
}

// ── Highlight Colors ──────────────────────────
export const HIGHLIGHT_COLORS = {
  gold:    { bg: 'rgba(201,169,110,0.25)', border: 'rgba(201,169,110,0.5)' },
  coral:   { bg: 'rgba(205,92,92,0.25)',   border: 'rgba(205,92,92,0.5)' },
  teal:    { bg: 'rgba(72,166,166,0.25)',   border: 'rgba(72,166,166,0.5)' },
  lavender:{ bg: 'rgba(148,120,196,0.25)',  border: 'rgba(148,120,196,0.5)' },
};

// ── Export Highlights as Markdown ──────────────
export function exportHighlightsMarkdown(bookId, bookTitle) {
  const highlights = getHighlights(bookId);
  const bookmarks = getBookmarks(bookId);
  let md = `# Study Notes: ${bookTitle}\n\n`;
  md += `*Exported ${new Date().toLocaleDateString()}*\n\n---\n\n`;

  if (bookmarks.length) {
    md += `## Bookmarks\n\n`;
    bookmarks.forEach(b => {
      md += `- ${b.chapterId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} *(${new Date(b.timestamp).toLocaleDateString()})*\n`;
    });
    md += '\n---\n\n';
  }

  if (highlights.length) {
    md += `## Highlights\n\n`;
    let currentChapter = '';
    highlights.sort((a, b) => (a.chapterId || '').localeCompare(b.chapterId || ''));
    highlights.forEach(h => {
      if (h.chapterId !== currentChapter) {
        currentChapter = h.chapterId;
        md += `### ${currentChapter.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}\n\n`;
      }
      md += `> "${h.text}" *(${h.color})*\n`;
      if (h.note) md += `>\n> **Note:** ${h.note}\n`;
      md += '\n';
    });
  }

  return md;
}

// ── UUID Polyfill ─────────────────────────────
if (!crypto.randomUUID) {
  crypto.randomUUID = () => {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    );
  };
}
