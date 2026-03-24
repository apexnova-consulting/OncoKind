/* OncoKind PWA Service Worker - minimal installable + offline shell */
const CACHE_NAME = 'oncokind-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const clone = res.clone();
        if (
          url.pathname.startsWith('/_next/static/') ||
          url.pathname === '/' ||
          url.pathname.startsWith('/dashboard') ||
          url.pathname.startsWith('/journey') ||
          url.pathname.startsWith('/reports') ||
          url.pathname.startsWith('/login') ||
          url.pathname.startsWith('/signup')
        ) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return res;
      });
    })
  );
});
