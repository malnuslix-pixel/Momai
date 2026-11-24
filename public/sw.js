// ==============================================================================
// MWALIMU FAMILY - PRODUCTION SERVICE WORKER (V10 RESILIENT RUNTIME)
// Zero-FOUC, Network-First for HTML, Strict RSC Bypass, Guaranteed MIME Types
// ==============================================================================

const SW_VERSION = 'mf-v10-resilient';
const CACHE_STATIC = `mf-static-${SW_VERSION}`;
const CACHE_RUNTIME = `mf-runtime-${SW_VERSION}`;

// Pre-cached offline fallback assets
const OFFLINE_URL = '/offline';
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/favicon.ico',
  '/manifest.webmanifest'
];

// Fallback HTML if cache match fails while offline
const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Offline | Mwalimu Family</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #1a3d1b; color: #fff; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; text-align: center; }
    .card { background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 14px; padding: 2rem; max-width: 420px; }
    h1 { font-size: 1.6rem; margin-top: 0; color: #ffffff; }
    p { color: #d1dcd2; line-height: 1.6; margin-bottom: 1.5rem; }
    button { background: #f59e0b; color: #112812; font-weight: 700; border: none; padding: 0.75rem 1.6rem; border-radius: 8px; cursor: pointer; font-size: 1rem; }
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size: 3rem; margin-bottom: 0.5rem;">📡</div>
    <h1>You are currently offline</h1>
    <p>Please check your internet connection or mobile data to access live educational news and verified resources.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;

// 1. INSTALL: Pre-cache core offline assets immediately
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

// 2. ACTIVATE: Purge any older cache versions immediately across all tabs
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
// - HTML Documents: STRICT NETWORK-FIRST (Always serve fresh HTML; fallback to cached /offline)
// - Static Next.js Assets (_next/static): Cache-First / Stale-While-Revalidate (hashed, immutable)
// - Next.js RSC Streams, APIs & Dev Chunks: ALWAYS BYPASS
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // A. Bypass localhost dev HMR, all API routes, and Next.js internal RSC payloads
  if (
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.hostname === '[::1]' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/_next/webpack-hmr') ||
    url.searchParams.has('_rsc') ||
    req.headers.get('RSC') === '1' ||
    req.headers.get('Next-Router-State-Tree') ||
    req.headers.get('Next-Url')
  ) {
    return;
  }

  // B. HTML Navigation requests -> STRICT NETWORK-FIRST with guaranteed text/html headers
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            return networkRes;
          }
          return networkRes;
        })
        .catch(async () => {
          // Device is completely offline -> Serve cached offline page or robust fallback HTML
          const cache = await caches.open(CACHE_STATIC);
          const cachedOffline = await cache.match(OFFLINE_URL);
          return cachedOffline || new Response(OFFLINE_FALLBACK_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
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
