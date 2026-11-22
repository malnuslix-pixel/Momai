/* Mwalimu Family service worker.
   Bump VERSION whenever you change the PRECACHE list or this file. */
const VERSION = 'mf-v1';
const PRECACHE = [
  './', 'index.html', 'offline.html', 'privacy.html', 'manifest.webmanifest',
  'mf-client.js', 'feed.json', 'icons/icon-192.png', 'icons/icon-512.png'
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      // addAll fails if one file is missing, so add individually and ignore misses
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

async function networkFirst(req, fallbackUrl) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (fallbackUrl) { const fb = await cache.match(fallbackUrl); if (fb) return fb; }
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  const net = fetch(req)
    .then((res) => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return hit || (await net) || new Response('', { status: 504 });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache API calls (forms, subscribe, assistant)
  if (url.pathname.startsWith('/api/') || url.hostname.startsWith('api.')) return;

  // Pages: network first, offline page as the last resort
  if (req.mode === 'navigate') { e.respondWith(networkFirst(req, 'offline.html').then((r) => r.status === 503 ? caches.match('offline.html') : r)); return; }

  // Editorial feed: always try for fresh content
  if (url.origin === location.origin && url.pathname.endsWith('/feed.json')) { e.respondWith(networkFirst(req)); return; }

  // Fonts and same-origin static files
  if (FONT_HOSTS.includes(url.hostname) || url.origin === location.origin) { e.respondWith(staleWhileRevalidate(req)); }
});
