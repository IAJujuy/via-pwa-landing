// sw.js — Función VIA (Project Pages compatible)
const CACHE = 'via-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './apple-touch-icon.png'
];

// Install: precache básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: limpia cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: 
// - Navegación (HTML): network-first, fallback a index.html
// - Otros GET del mismo origen: network con cache fallback (y guarda en caché)
// - Si falla todo: Response.error()
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Navegación (SPA / páginas)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          return fresh;
        } catch (e) {
          const cache = await caches.open(CACHE);
          return (await cache.match('./index.html')) || Response.error();
        }
      })()
    );
    return;
  }

  // Misma-origen: intenta red y cachea; si falla, sirve caché
  if (url.origin === self.location.origin) {
    event.respondWith(
      (async () => {
        try {
          const net = await fetch(req);
          // Cachea copias de éxito
          const cache = await caches.open(CACHE);
          cache.put(req, net.clone());
          return net;
        } catch (e) {
          const cache = await caches.open(CACHE);
          const cached = await cache.match(req, { ignoreSearch: true });
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // Terceros: red con fallback a caché si existiera
  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch (e) {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req, { ignoreSearch: true });
        return cached || Response.error();
      }
    })()
  );
});
