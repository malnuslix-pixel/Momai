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
        background: '#faf8f5',
        color: '#1a1a1a',
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '500px',
          padding: '2.5rem',
          background: '#fff',
          borderRadius: '20px',
          border: '1px solid #e0ddd6',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.8rem' }}>⚠️</span>
          <h2 style={{ color: '#173b22', margin: '0 0 0.8rem' }}>Application Error</h2>
          <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.8rem' }}>
            A temporary system error occurred. Please try reloading the application.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 1.8rem',
              background: '#2c5f2d',
              color: '#fff',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 600,
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
