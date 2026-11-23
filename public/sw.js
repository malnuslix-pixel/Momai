/* Mwalimu Family Service Worker - Offline Revision & Past Papers Caching
   Bump VERSION whenever cache assets change */
const VERSION = 'mf-v3-speed';
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/pricing',
  '/tutor',
  '/leaderboard',
  '/privacy',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/icons/favicon-32.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/feed.json'
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// 1. Install Phase - Precache critical routes & assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => {
      return Promise.all(
        PRECACHE_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn(`[SW] Precache skipped for ${url}:`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Phase - Purge stale legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Helper: Network-first with offline fallback
async function networkFirstWithFallback(req, fallbackUrl) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    const cachedHit = await cache.match(req, { ignoreSearch: true });
    if (cachedHit) return cachedHit;

    if (fallbackUrl) {
      const fallbackHit = await cache.match(fallbackUrl);
      if (fallbackHit) return fallbackHit;
    }

    return new Response(
      '<html><body><h1>Offline</h1><p>Please reconnect to the internet.</p></body></html>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// Helper: Stale while revalidate for static scripts, CSS, and fonts
async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then((networkRes) => {
      if (networkRes && (networkRes.ok || networkRes.type === 'opaque')) {
        cache.put(req, networkRes.clone());
      }
      return networkRes;
    })
    .catch(() => null);

  return cached || (await fetchPromise) || new Response('', { status: 504 });
}

// 3. Fetch Event Interceptor
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // A. Dynamic Caching for Offline Revision Quiz API (GET /api/tutor)
  if (url.origin === location.origin && url.pathname === '/api/tutor') {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        try {
          const networkRes = await fetch(req);
          if (networkRes && networkRes.ok) {
            cache.put(req, networkRes.clone());
          }
          return networkRes;
        } catch (err) {
          const cachedQuiz = await cache.match(req);
          if (cachedQuiz) return cachedQuiz;
          // Fallback minimal practice questions if network drops
          const offlineFallback = {
            ok: true,
            mode: 'offline_quiz',
            questions: [
              {
                id: 'off-1',
                question: 'In CBC Grade 8 Integrated Science, what is the process by which green plants manufacture food using sunlight?',
                options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination'],
                correctIndex: 1,
                explanation: 'Photosynthesis is the process green plants use to convert water and carbon dioxide into glucose using sunlight.'
              },
              {
                id: 'off-2',
                question: 'A shopkeeper in Nairobi sells a textbook for KES 850 making a profit of 25%. What was the buying price?',
                options: ['KES 680', 'KES 650', 'KES 700', 'KES 600'],
                correctIndex: 0,
                explanation: 'Buying price = 850 / 1.25 = KES 680.'
              }
            ]
          };
          return new Response(JSON.stringify(offlineFallback), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
      })
    );
    return;
  }

  // B. Bypass mutable POST API calls (M-Pesa STK push, submissions, etc.)
  if (url.pathname.startsWith('/api/') || url.hostname.startsWith('api.')) {
    return;
  }

  // C. HTML Page Navigation: Network first, fallback to /offline
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(req, '/offline'));
    return;
  }

  // D. Static Assets, Next.js chunks, fonts, editorial JSON: Stale while revalidate
  if (
    FONT_HOSTS.includes(url.hostname) ||
    url.origin === location.origin ||
    url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(staleWhileRevalidate(req));
  }
});
