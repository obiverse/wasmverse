/* ═══════════════════════════════════════════════
   SERVICE WORKER — The Intelligent Letterverse Cache

   Five strategies, like five senses. Each asset type
   gets the strategy that matches its nature.

   ┌─────────────────────────────────────────────────┐
   │ Asset Type      │ Strategy                      │
   ├─────────────────┼───────────────────────────────┤
   │ HTML (navigate) │ Network-first, stale fallback │
   │ CSS / JS        │ Stale-while-revalidate        │
   │ .md books       │ Stale-while-revalidate        │
   │ .wasm modules   │ Cache-first (immutable build) │
   │ Fonts / images  │ Cache-first (never change)    │
   └─────────────────────────────────────────────────┘

   Plus:
   - Update detection: background fetches that return
     different content set a flag → next navigation
     shows "New content available" toast
   - Predictive prefetch: when a book is opened,
     prefetch likely next books in the compass path
   ═══════════════════════════════════════════════ */

// Cache version: update this on any deploy. build.sh does it
// automatically, but you can also just change this string.
// Any change to sw.js triggers browser re-install of the SW,
// which purges the old cache via the activate handler below.
const CACHE = 'lv-fd858a2';
const UPDATE_FLAG = 'lv-update-ready';

/* ── Lifecycle ─────────────────────────────── */

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      // Precache the shell — just the navigable pages + core assets
      cache.addAll([
        './',
        './read.html',
        './css/base.css',
        './css/library.css',
        './css/reader.css',
        './css/search.css',
        './css/theme-toggle.css',
        './euler-shell.js',
        './js/idb.js',
        './js/library.js',
        './js/african-patterns.js',
        './js/reader.js',
        './js/search.js',
        './js/theme-global.js',
        './js/nostr-shell.js',
        './pwa.js',
        './icon.svg',
        './books/manifest.json',
      ]).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch Router ──────────────────────────── */

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const path = url.pathname;

  // Classify the request
  if (req.mode === 'navigate' || path.endsWith('.html') || path.endsWith('/')) {
    e.respondWith(networkFirst(req));
  } else if (path.endsWith('.wasm')) {
    e.respondWith(cacheFirst(req));
  } else if (path.match(/\.(woff2?|ttf|otf|eot)$/)) {
    e.respondWith(cacheFirst(req));
  } else if (path.endsWith('.svg') || path.endsWith('.png') || path.endsWith('.ico')) {
    e.respondWith(cacheFirst(req));
  } else if (path.endsWith('.md')) {
    e.respondWith(staleWhileRevalidate(req, true));
  } else {
    // CSS, JS, JSON — stale-while-revalidate
    e.respondWith(staleWhileRevalidate(req, true));
  }
});

/* ── Strategy: Network First ───────────────── *
 * For HTML navigation. Always try network.
 * Fall back to cache for offline reading.     */

async function networkFirst(req) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    return cached || new Response('Offline — cached page not available', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/* ── Strategy: Stale-While-Revalidate ──────── *
 * Serve cache instantly (fast UX), then fetch
 * fresh copy in background. If content changed,
 * flag for update toast on next navigation.    */

async function staleWhileRevalidate(req, detectChanges) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);

  // Background revalidation (don't await)
  const fetchPromise = fetch(req).then(async res => {
    if (!res.ok) return res;

    // Detect content changes
    if (detectChanges && cached) {
      const oldEtag = cached.headers.get('etag');
      const newEtag = res.headers.get('etag');
      const oldModified = cached.headers.get('last-modified');
      const newModified = res.headers.get('last-modified');

      if ((oldEtag && newEtag && oldEtag !== newEtag) ||
          (oldModified && newModified && oldModified !== newModified)) {
        // Content changed — flag for update toast
        flagUpdate();
      }
    }

    cache.put(req, res.clone());
    return res;
  }).catch(() => {});

  // Return cached immediately if available, otherwise wait for network
  if (cached) {
    // Fire and forget the revalidation
    fetchPromise;
    return cached;
  }

  // No cache — must wait for network
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

/* ── Strategy: Cache First ─────────────────── *
 * For immutable assets (wasm, fonts, images).
 * Once cached, never re-fetch.                */

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

/* ── Update Detection ──────────────────────── *
 * When SWR detects changed content, notify
 * all clients so they can show an update toast */

function flagUpdate() {
  self.clients.matchAll({ type: 'window' }).then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'UPDATE_AVAILABLE' });
    });
  });
}

/* ── Predictive Prefetch ───────────────────── *
 * When a client tells us they opened a book,
 * we prefetch the next books in the path.     */

const COMPASS_PATHS = {
  sovereign: ['crypto', 'bitcoin', 'keys', 'lightning', 'whispers', 'cloak', 'fortress'],
  coder:     ['math', 'algorithms', 'rust', 'wasm'],
  maker:     ['electricity', 'strength', 'manufacturing', 'industry'],
  founder:   ['enterprise', 'wealth', 'governance', 'rhetoric'],
  thinker:   ['systems', 'thought', 'crypto', 'bitcoin'],
};

self.addEventListener('message', e => {
  if (e.data?.type === 'READING_BOOK') {
    const bookId = e.data.bookId;
    prefetchNextBooks(bookId);
  }
  if (e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function prefetchNextBooks(currentBookId) {
  const cache = await caches.open(CACHE);

  for (const path of Object.values(COMPASS_PATHS)) {
    const idx = path.indexOf(currentBookId);
    if (idx === -1) continue;

    // Prefetch next 2 books in the path
    const nextBooks = path.slice(idx + 1, idx + 3);
    for (const bookId of nextBooks) {
      const url = `./books/${bookId}.md`;
      const already = await cache.match(url);
      if (!already) {
        fetch(url).then(res => {
          if (res.ok) cache.put(url, res);
        }).catch(() => {});
      }
    }
    break; // Only prefetch from the first matching path
  }
}
