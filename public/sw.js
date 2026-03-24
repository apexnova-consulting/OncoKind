/* OncoKind PWA — only cache immutable Next.js build files. All HTML/RSC/API: network. */
const CACHE_NAME = 'oncokind-v4-static';

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => {
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

function isNextStatic(url) {
  return url.pathname.startsWith('/_next/static/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isNextStatic(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then(
          (cached) =>
            cached ||
            fetch(request).then((res) => {
              if (res && res.status === 200 && res.type === 'basic') {
                cache.put(request, res.clone());
              }
              return res;
            })
        )
      )
    );
    return;
  }

  // Everything else (pages, RSC, JSON, images): always network — no stale UI after deploy
  event.respondWith(fetch(request));
});
