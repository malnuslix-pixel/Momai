'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg, #1a3d1b)'
    }}>
      <div style={{
        maxWidth: '560px',
        padding: '3rem 2rem',
        borderRadius: '20px',
        background: 'var(--card, #224b23)',
        border: '1px solid var(--ln, rgba(255, 255, 255, 0.18))',
        boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
      }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🛡️</span>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '2rem',
          color: '#ffffff',
          marginBottom: '0.8rem'
        }}>
          Something refreshed unexpectedly
        </h1>
        <p style={{
          color: 'var(--mu, #d1dcd2)',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          We encountered an unexpected display issue while rendering this section. Click below to reload or return home.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => reset()}
            className="btn b1"
            style={{ padding: '0.75rem 1.6rem', border: 'none', cursor: 'pointer' }}
          >
            🔄 Try Again
          </button>
          <Link href="/" className="btn b2" style={{ padding: '0.75rem 1.6rem', textDecoration: 'none' }}>
            🏠 Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
