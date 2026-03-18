const CACHE = 'epistolary-v4';
const BASE = '/wasmverse/';

const SHELL = [
  BASE,
  BASE + 'index.html',
  BASE + 'read.html',
  BASE + 'books/manifest.json',
  BASE + 'books/wasm.md',
  BASE + 'books/rust.md',
  BASE + 'books/bitcoin.md',
  BASE + 'books/pwa.md',
  BASE + 'pkg/sorting-theater/sorting_theater.js',
  BASE + 'pkg/sorting-theater/sorting_theater_bg.wasm',
  BASE + 'pkg/stack-machine/stack_machine.js',
  BASE + 'pkg/stack-machine/stack_machine_bg.wasm',
  BASE + 'icon.svg',
  BASE + 'manifest.webmanifest',
];

// Install — cache the app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — cache-first for shell, network-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip cross-origin requests (fonts, etc.)
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => {
      if (e.request.mode === 'navigate') {
        return caches.match(BASE + 'index.html');
      }
    })
  );
});
