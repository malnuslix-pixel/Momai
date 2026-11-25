// ==============================================================================
// MWALIMU FAMILY - SERVICE WORKER PERMANENT UNREGISTRATION & CACHE PURGE
// This self-terminating script immediately unregisters itself and deletes all caches
// ==============================================================================

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});
