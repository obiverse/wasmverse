const VERSION = 'epistolary-v10';
const BASE = '/wasmverse/';

// Core shell — precached on install for offline support
const PRECACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'read.html',
  BASE + 'css/base.css',
  BASE + 'css/library.css',
  BASE + 'css/reader.css',
  BASE + 'js/library.js',
  BASE + 'js/reader.js',
  BASE + 'euler-shell.js',
  BASE + 'pwa.js',
  BASE + 'books/manifest.json',
  BASE + 'icon.svg',
  BASE + 'manifest.webmanifest',
];

// Books — cached on first access (stale-while-revalidate)
// so we don't block install on large downloads
const BOOKS_PREFIX = BASE + 'books/';
const PKG_PREFIX = BASE + 'pkg/';

// Install — precache shell only (fast install)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge ALL old caches, claim clients, notify for reload
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Notify all open pages that a new version is active
        self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// Fetch strategy:
// - Navigation requests: network-first (always get latest HTML)
// - Books (.md): stale-while-revalidate (show cached, update in bg)
// - Wasm/JS bundles: cache-first (immutable build artifacts)
// - Everything else: network-first with cache fallback
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip cross-origin (fonts CDN, etc.)
  if (url.origin !== location.origin) return;

  // ?purge escape hatch — always go to network, never serve from cache
  if (url.search.includes('purge')) {
    e.respondWith(fetch(e.request));
    return;
  }

  const path = url.pathname;

  // Navigation — always try network first for latest content
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(VERSION).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match(BASE + 'index.html')))
    );
    return;
  }

  // Books (.md) — stale-while-revalidate (instant load + background update)
  if (path.startsWith(BOOKS_PREFIX) && path.endsWith('.md')) {
    e.respondWith(
      caches.open(VERSION).then(cache =>
        cache.match(e.request).then(cached => {
          const fetchPromise = fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Wasm + JS bundles — cache-first (immutable artifacts)
  if (path.startsWith(PKG_PREFIX)) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(VERSION).then(c => c.put(e.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Everything else — network-first with cache fallback
  e.respondWith(
    fetch(e.request)
      .then(response => {
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(VERSION).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
