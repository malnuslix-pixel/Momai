'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: '#1a3d1b',
        color: '#ffffff',
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '500px',
          padding: '2.5rem',
          background: '#224b23',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.8rem' }}>🛡️</span>
          <h2 style={{ color: '#ffffff', margin: '0 0 0.8rem' }}>Application Recovered</h2>
          <p style={{ color: '#d1dcd2', lineHeight: '1.6', marginBottom: '1.8rem' }}>
            A temporary display exception occurred. Please reload to restore the interface.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.8rem',
              background: '#f59e0b',
              color: '#112812',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Reload Mwalimu Family
          </button>
        </div>
      </body>
    </html>
  );
}
