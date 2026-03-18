const CACHE = 'epistolary-v2';

const SHELL = [
  '/',
  '/index.html',
  '/read.html',
  '/books/manifest.json',
  '/books/wasm.md',
  '/books/rust.md',
  '/pkg/sorting-theater/sorting_theater.js',
  '/pkg/sorting-theater/sorting_theater_bg.wasm',
  '/pkg/stack-machine/stack_machine.js',
  '/pkg/stack-machine/stack_machine_bg.wasm',
  '/pwa.js',
  '/icon.svg',
  '/manifest.webmanifest',
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

  // Skip cross-origin requests (fonts, etc.) — let them go to network
  if (url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;

      return fetch(e.request).then(response => {
        // Cache successful GET responses
        if (response.ok && e.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback for navigation
      if (e.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});
