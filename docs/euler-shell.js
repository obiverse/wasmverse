/* ═══════════════════════════════════════════════
   EULER SHELL — The thin JS bridge

   Euler (WASM) is the brain. This is the nervous system.
   It connects WASM decisions to DOM actions.
   ═══════════════════════════════════════════════ */

let euler = null;
let _persistTimer = null;

/**
 * Boot the euler framework.
 * Loads WASM, migrates old state, hydrates.
 * Must be called before any other function.
 */
export async function boot() {
  const { default: init, Euler } = await import('./pkg/euler/euler.js');
  await init('./pkg/euler/euler_bg.wasm');

  euler = new Euler();

  // Try new unified state first
  const saved = localStorage.getItem('euler_state');
  if (saved) {
    euler.hydrate(saved);
  } else {
    // Migrate from old multi-key format
    migrateOldState();
  }

  return euler;
}

/**
 * Get the euler instance (null if not booted)
 */
export function get() {
  return euler;
}

/**
 * Persist state to localStorage immediately
 */
export function persist() {
  if (!euler) return;
  localStorage.setItem('euler_state', euler.dehydrate());
}

/**
 * Smart persist — uses requestIdleCallback when available (saves battery),
 * falls back to 500ms debounce. Safe to call on every state change.
 */
export function autoPersist() {
  clearTimeout(_persistTimer);
  if (window.requestIdleCallback) {
    // Persist when the browser is idle — no jank, no battery drain
    _persistTimer = requestIdleCallback(() => persist(), { timeout: 2000 });
  } else {
    // Fallback: debounced setTimeout
    _persistTimer = setTimeout(persist, 500);
  }
}

/**
 * Apply current theme to DOM via CSS custom properties
 */
export function applyTheme(bookAccent) {
  if (!euler) return;
  const json = bookAccent
    ? euler.theme_css_json_with_accent(bookAccent)
    : euler.theme_css_json();
  const vars = JSON.parse(json);
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(vars)) {
    root.style.setProperty(prop, val);
  }
  document.body.dataset.theme = euler.current_theme();
}

/**
 * Apply current typography settings to DOM
 */
export function applyTypography() {
  if (!euler) return;
  const root = document.documentElement;
  root.style.setProperty('--font-size', euler.font_size() + 'px');
  root.style.setProperty('--line-height', (euler.line_height_x10() / 10).toFixed(1));
  root.style.setProperty('--content-max', euler.content_width() + 'ch');
}

/**
 * Migrate from old localStorage keys (lib.js format) to euler unified state
 */
function migrateOldState() {
  if (!euler) return;

  const migrated = {};

  // Old progress format: { bookId: { chaptersRead, totalChapters, lastRead } }
  try {
    const progress = JSON.parse(localStorage.getItem('epistolary_progress') || '{}');
    const reading = {};
    for (const [id, p] of Object.entries(progress)) {
      reading[id] = {
        chaptersRead: p.chaptersRead || 0,
        totalChapters: p.totalChapters || 0,
        scrollPosition: 0,
        currentChapterId: '',
        // Handle both ISO string and timestamp
        lastRead: typeof p.lastRead === 'string' ? new Date(p.lastRead).getTime() : (p.lastRead || 0),
      };
    }
    migrated.reading = reading;
  } catch {}

  // Old theme: just a string name
  try {
    const theme = JSON.parse(localStorage.getItem('epistolary_theme') || 'null');
    if (theme) migrated.theme = theme;
  } catch {}

  // Old typography: { fontSize, lineHeight, contentMax }
  try {
    const typo = JSON.parse(localStorage.getItem('epistolary_typography') || 'null');
    if (typo) {
      migrated.fontSize = typo.fontSize || 19;
      migrated.lineHeight = Math.round((typo.lineHeight || 1.85) * 10);
      migrated.contentWidth = typo.contentMax || 72;
    }
  } catch {}

  // Old bookmarks: { bookId: [{ chapterId, timestamp }] }
  try {
    const bm = JSON.parse(localStorage.getItem('epistolary_bookmarks') || 'null');
    if (bm) migrated.bookmarks = bm;
  } catch {}

  // Old highlights: { bookId: [{ id, chapterId, text, color, note, timestamp }] }
  try {
    const hl = JSON.parse(localStorage.getItem('epistolary_highlights') || 'null');
    if (hl) migrated.highlights = hl;
  } catch {}

  if (Object.keys(migrated).length > 0) {
    euler.hydrate(JSON.stringify(migrated));
    // Persist in new format and clean up old keys
    persist();
    localStorage.removeItem('epistolary_progress');
    localStorage.removeItem('epistolary_theme');
    localStorage.removeItem('epistolary_typography');
    localStorage.removeItem('epistolary_bookmarks');
    localStorage.removeItem('epistolary_highlights');
  }
}
