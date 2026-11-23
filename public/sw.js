// ==============================================================================
// MWALIMU FAMILY - PRODUCTION SERVICE WORKER (V9 RESILIENT RUNTIME)
// Zero-FOUC, Network-First for HTML, Stale Chunk Elimination
// ==============================================================================

const SW_VERSION = 'mf-v9-production';
const CACHE_STATIC = `mf-static-${SW_VERSION}`;
const CACHE_RUNTIME = `mf-runtime-${SW_VERSION}`;

// Pre-cached offline fallback page only
const OFFLINE_URL = '/offline';
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/favicon.ico',
  '/manifest.webmanifest'
];

// 1. INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. ACTIVATE: Purge any older cache versions immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_STATIC && key !== CACHE_RUNTIME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH STRATEGY:
// - HTML Documents: STRICT NETWORK-FIRST (NEVER serve stale HTML that links to deleted CSS chunks!)
// - Static Next.js Assets (_next/static): Cache-First / Stale-While-Revalidate (hashed, immutable)
// - APIs & Dev Chunks: ALWAYS BYPASS
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // A. Bypass localhost dev HMR and all API routes
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/_next/webpack-hmr')
  ) {
    return;
  }

  // B. HTML Navigation requests -> STRICT NETWORK-FIRST
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          // If valid response, return fresh HTML
          if (networkRes && networkRes.status === 200) {
            return networkRes;
          }
          return networkRes;
        })
        .catch(async () => {
          // Device is completely offline -> Serve the offline fallback page
          const cache = await caches.open(CACHE_STATIC);
          const cachedOffline = await cache.match(OFFLINE_URL);
          return cachedOffline || new Response('Offline - please reconnect to internet.', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        })
    );
    return;
  }

  // C. Immutable Next.js static assets (_next/static) -> Cache-first with network fallback
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_RUNTIME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        });
      })
    );
    return;
  }
});
