self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open('via-cache-v1');
    await cache.addAll(['/', '/index.html', '/manifest.webmanifest']);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== 'via-cache-v1').map(k => caches.delete(k)));
  })());
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const res = await fetch(event.request);
      return res;
    } catch (e) {
      const cache = await caches.open('via-cache-v1');
      const cached = await cache.match(event.request, {ignoreSearch: true});
      return cached || Response.error();
    }
  })());
});