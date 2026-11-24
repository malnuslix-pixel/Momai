'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary] Caught client component error:', error, errorInfo);
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'grid',
            placeItems: 'center',
            padding: '2rem 1rem',
            textAlign: 'center',
            background: 'var(--bg, #1a3d1b)',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '2rem',
              borderRadius: '16px',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>✨</div>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem', color: '#ffffff' }}>
              Something refreshed unexpectedly
            </h2>
            <p style={{ color: 'var(--mu, #d1dcd2)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.4rem' }}>
              We encountered a temporary display issue while loading this section. Click below to reload and continue.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: 'var(--ac, #f59e0b)',
                color: '#112812',
                border: 'none',
                padding: '0.7rem 1.6rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
