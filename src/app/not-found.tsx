import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg, #fbfbf9)'
    }}>
      <div style={{
        maxWidth: '560px',
        padding: '3rem 2rem',
        borderRadius: '24px',
        background: '#fff',
        border: '1px solid #e0ddd6',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
      }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🧭</span>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: '2rem',
          color: 'var(--hd, #173b22)',
          marginBottom: '0.8rem'
        }}>
          Page Not Found
        </h1>
        <p style={{
          color: '#555',
          fontSize: '1rem',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Samahani, the curriculum guide, exam update, or tool you are looking for has moved or does not exist.
        </p>
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn b1" style={{ padding: '0.75rem 1.6rem', textDecoration: 'none' }}>
            🏠 Return Home
          </Link>
          <Link href="/learn" className="btn b2" style={{ padding: '0.75rem 1.6rem', textDecoration: 'none' }}>
            📚 Browse Library
          </Link>
          <Link href="/tools" className="btn b2" style={{ padding: '0.75rem 1.6rem', textDecoration: 'none' }}>
            🧮 Open Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
