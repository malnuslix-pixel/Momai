'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import { SITE_MARKUP } from '@/lib/site-markup';

export default function HomePage() {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    // 1. Fetch live configuration flags from Supabase backend
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.flags?.maint) {
          setIsMaintenance(true);
        }
      })
      .catch((err) => console.warn('Config fetch notice:', err));

    // 2. Register Service Worker for PWA
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (isMaintenance) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#faf8f5',
        color: '#1a1a1a',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <div style={{ maxWidth: '32rem' }}>
          <div style={{ fontSize: '3rem' }}>🛠️</div>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#2c5f2d', margin: '0.8rem 0' }}>
            Mwalimu Family
          </h1>
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            The system is undergoing scheduled editorial and technical maintenance. We will be right back shortly.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/control-room" style={{ color: '#2c5f2d', fontWeight: 600 }}>
              Access Control Room →
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Exact Site Markup - 100% faithful to original design */}
      <div dangerouslySetInnerHTML={{ __html: SITE_MARKUP }} />

      {/* Main Interactive Educational Logic & Client Glue */}
      <Script
        src="/mwalimu-main.js"
        strategy="afterInteractive"
      />
    </>
  );
}
