/* ═══════════════════════════════════════════════
   SERVICE WORKER — The Letterverse

   Strategy: Network-first, cache as you go.

   No precache list. No version tokens. No complexity.

   - Online: always fetch from network, cache the response
   - Offline: serve from cache
   - New SW: purge old cache, claim clients

   This is the only correct architecture for a static site
   that deploys via GitHub Pages. The network is the source
   of truth. The cache is a backup, not a primary.
   ═══════════════════════════════════════════════ */

const CACHE = 'letterverse-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only handle same-origin GET requests
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Cache successful responses for offline use
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      })
      .catch(() =>
        // Network failed — serve from cache (offline mode)
        caches.match(e.request)
      )
  );
});
