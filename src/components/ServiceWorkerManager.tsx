'use client';

import { useEffect } from 'react';

export default function ServiceWorkerManager() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]' ||
      window.location.port !== ''
    );

    if (isLocalhost) {
      // In local development: Unregister any service workers to prevent stale chunk caching
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch(() => {});

      if ('caches' in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        }).catch(() => {});
      }
    } else if (process.env.NODE_ENV === 'production') {
      // In production: Register PWA service worker with automatic update check
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Check for updates on page load
        registration.update().catch(() => {});
      }).catch(() => {});
    }
  }, []);

  return null;
}
