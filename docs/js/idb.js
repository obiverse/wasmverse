/* ═══════════════════════════════════════════════
   IDB — IndexedDB persistence layer

   The Letterverse's structured storage substrate.
   Replaces localStorage: unlimited quota, async,
   per-letter granularity — the iBooks layer.

   Six stores, like six movements of a symphony:

   settings  — euler state blob (replaces localStorage)
   books     — per-book progress records
   letters   — per-letter visits (bookId/letterId → {scrollPct, readAt})
   bookmarks — chapter bookmarks with notes
   highlights — text highlights with color + note
   library   — book markdown cache (instant open)

   Design principles:
   - Lazy singleton: openDB() called once, reused everywhere
   - Silent fallback: every function wraps in try/catch
   - Fire-and-forget safe: callers can skip await on writes
   - Zero blocking: IDB failure is invisible to the reader
   ═══════════════════════════════════════════════ */

const DB_NAME = 'letterverse';
const DB_VERSION = 2;  // v2: added nostr_session store

// Lazy singleton — one promise for the lifetime of the page
let _dbPromise = null;

function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      const db = e.target.result;

      // Settings: key/value store for euler state blob
      if (!db.objectStoreNames.contains('settings'))
        db.createObjectStore('settings');

      // Per-book progress (keyed by bookId)
      if (!db.objectStoreNames.contains('books'))
        db.createObjectStore('books');

      // Per-letter visits — the iBooks layer
      // Key: "bookId/letterId"  Index: bookId for getAll queries
      if (!db.objectStoreNames.contains('letters')) {
        const ls = db.createObjectStore('letters');
        ls.createIndex('by_book', 'bookId', { unique: false });
      }

      // Bookmarks (auto-id, indexed by bookId)
      if (!db.objectStoreNames.contains('bookmarks')) {
        const bms = db.createObjectStore('bookmarks', { autoIncrement: true });
        bms.createIndex('by_book', 'bookId', { unique: false });
      }

      // Highlights (uuid key, indexed by bookId and by bookId+letterId)
      if (!db.objectStoreNames.contains('highlights')) {
        const hls = db.createObjectStore('highlights');
        hls.createIndex('by_book', 'bookId', { unique: false });
        hls.createIndex('by_letter', ['bookId', 'letterId'], { unique: false });
      }

      // Book content cache (bookId → {content, etag, cachedAt})
      if (!db.objectStoreNames.contains('library'))
        db.createObjectStore('library');

      // Nostr session — single record keyed 'singleton'
      // {eph_nsec, eph_npub, bunker_npub, relay, user_npub, req_id}
      if (!db.objectStoreNames.contains('nostr_session'))
        db.createObjectStore('nostr_session');
    };

    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => {
      _dbPromise = null; // allow retry on next call
      reject(req.error);
    };
  });
  return _dbPromise;
}

// ── Generic IDB helpers ───────────────────────

function idbGet(db, store, key) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db, store, key, value) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function idbGetAllByIndex(db, store, indexName, value) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly')
      .objectStore(store)
      .index(indexName)
      .getAll(value);
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

function idbGetAll(db, store) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readonly').objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}

function idbDelete(db, store, key) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(store, 'readwrite').objectStore(store).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ── Library cache management ──────────────────

// Hard cap on library cache: 15MB.
// Keeps the whole library (33 books, ~10MB) comfortably cacheable
// while leaving room for settings, letters, and bookmarks.
// The quota-aware warmRecentBooks() in library.js enforces a
// softer check (skips proactive caching on tight-quota devices)
// before this hard cap is ever reached.
const LIBRARY_CACHE_MAX = 15 * 1024 * 1024; // 15 MB

/**
 * Evict the oldest cached books (LRU) until we have room for neededBytes.
 * Only runs when the cache is actually over budget — usually a no-op.
 */
async function evictOldestBooks(db, neededBytes) {
  const all = await idbGetAll(db, 'library');
  if (!all.length) return;

  const totalSize = all.reduce((sum, b) => sum + (b.size || 0), 0);
  if (totalSize + neededBytes <= LIBRARY_CACHE_MAX) return;

  // Oldest first — we keep the most recently accessed books
  all.sort((a, b) => a.cachedAt - b.cachedAt);

  let freed = 0;
  const target = totalSize + neededBytes - LIBRARY_CACHE_MAX;
  for (const book of all) {
    if (freed >= target) break;
    await idbDelete(db, 'library', book.bookId);
    freed += book.size || 0;
  }
}

// ── Public API ────────────────────────────────

/**
 * Open the database. Safe to call multiple times.
 * Called by euler-shell.js at boot.
 */
export async function init() {
  try { await openDB(); } catch { /* IDB unavailable — Safari private, quota, etc. */ }
}

/**
 * Save the euler state blob. Replaces localStorage.setItem('euler_state').
 * Falls back to localStorage if IDB is unavailable.
 */
export async function saveSettings(json) {
  try {
    const db = await openDB();
    await idbPut(db, 'settings', 'euler_state', json);
  } catch {
    // Graceful degradation: keep localStorage as emergency backup
    try { localStorage.setItem('euler_state', json); } catch {}
  }
}

/**
 * Load the euler state blob. Replaces localStorage.getItem('euler_state').
 * Returns null if nothing saved yet.
 */
export async function loadSettings() {
  try {
    const db = await openDB();
    return await idbGet(db, 'settings', 'euler_state');
  } catch {
    return localStorage.getItem('euler_state');
  }
}

/**
 * Record that a specific letter was visited. The iBooks layer.
 * Fire-and-forget safe — callers need not await.
 *
 * @param {string} bookId   — e.g. "wasm"
 * @param {string} letterId — e.g. "letter-12-on-ownership"
 * @param {number} scrollPct — 0.0–1.0 scroll position within the letter
 */
export async function markLetterRead(bookId, letterId, scrollPct) {
  try {
    const db = await openDB();
    await idbPut(db, 'letters', `${bookId}/${letterId}`, {
      bookId,
      letterId,
      scrollPct: scrollPct ?? 0,
      readAt: Date.now(),
    });
  } catch {}
}

/**
 * Get all letters visited for a book.
 * Returns array of {bookId, letterId, scrollPct, readAt}.
 * Returns [] if nothing saved or IDB unavailable.
 */
export async function getLettersRead(bookId) {
  try {
    const db = await openDB();
    return await idbGetAllByIndex(db, 'letters', 'by_book', bookId);
  } catch { return []; }
}

/**
 * Cache a book's markdown content for instant offline open.
 * Tracks byte size and evicts the oldest cached books (LRU) if
 * the 15MB library budget would be exceeded. Fire-and-forget safe.
 *
 * @param {string} bookId
 * @param {string} content — raw markdown
 * @param {string} etag    — ETag or Last-Modified header value
 */
export async function cacheBook(bookId, content, etag) {
  try {
    const db = await openDB();
    // Measure actual UTF-8 size (Blob is the most accurate cross-browser method)
    const size = new Blob([content]).size;
    // Evict oldest books if needed — usually a no-op
    await evictOldestBooks(db, size);
    await idbPut(db, 'library', bookId, {
      bookId,       // stored in value for eviction lookup
      content,
      etag: etag || '',
      cachedAt: Date.now(),
      size,
    });
  } catch {}
}

/**
 * Get cached book content.
 * Returns {content, etag, cachedAt} or null.
 */
export async function getCachedBook(bookId) {
  try {
    const db = await openDB();
    return await idbGet(db, 'library', bookId);
  } catch { return null; }
}

// ── Nostr session ─────────────────────────────────────────────────────────

/**
 * Persist the active Nostr session object.
 * Called after each stage of the NIP-46 handshake.
 */
export async function saveNostrSession(session) {
  try {
    const db = await openDB();
    await idbPut(db, 'nostr_session', 'singleton', session);
  } catch {}
}

/**
 * Load the persisted Nostr session (for silent reconnect on next load).
 * Returns null if none saved.
 */
export async function loadNostrSession() {
  try {
    const db = await openDB();
    return await idbGet(db, 'nostr_session', 'singleton');
  } catch { return null; }
}

/**
 * Remove the Nostr session (sign out).
 */
export async function clearNostrSession() {
  try {
    const db = await openDB();
    await idbDelete(db, 'nostr_session', 'singleton');
  } catch {}
}
