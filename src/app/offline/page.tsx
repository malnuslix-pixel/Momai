'use client';

import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div style={{
      margin: 0,
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: '2rem',
      background: 'var(--bg, #faf8f5)',
      color: 'var(--tx, #1a1a1a)',
      font: "18px/1.6 'Segoe UI', system-ui, sans-serif",
      paddingTop: 'max(2rem, env(safe-area-inset-top))',
      paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
    }}>
      <style jsx global>{`
        :root {
          --bg: #faf8f5;
          --tx: #1a1a1a;
          --mu: #555;
          --g: #2c5f2d;
          --ac: #f4a261;
          color-scheme: light;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0e1a0f;
            --tx: #f1f1ec;
            --mu: #b8c2b9;
            color-scheme: dark;
          }
        }
        .offline-btn {
          display: inline-block;
          margin: 0.4rem;
          padding: 0.8rem 1.6rem;
          border-radius: 50px;
          border: 2px solid var(--g);
          background: var(--g);
          color: #fff;
          font: 600 1rem inherit;
          font-family: inherit;
          text-decoration: none;
          cursor: pointer;
        }
        .offline-btn.outline {
          background: transparent;
          color: var(--g);
        }
        @media (prefers-color-scheme: dark) {
          .offline-btn.outline {
            color: #7fc080;
            border-color: #7fc080;
          }
        }
      `}</style>
      <main style={{ maxWidth: '30rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }} aria-hidden="true">📴</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', margin: '0.5rem 0' }}>
          You are offline
        </h1>
        <p style={{ color: 'var(--mu, #555)' }}>
          This page is not saved on your phone yet. Pages you have already opened, including tools and revision notes, still work without data.
        </p>
        <div>
          <button className="offline-btn" onClick={() => window.location.reload()}>
            Try again
          </button>
          <Link className="offline-btn outline" href="/">
            Go to home page
          </Link>
        </div>
      </main>
    </div>
  );
}
