'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import NewsSection from '@/components/NewsSection';

export default function NewsPage() {
  const router = useRouter();
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/s')) {
        const storyId = hash.replace('#/', '');
        setActiveStoryId(storyId);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setActiveStoryId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavClick = (target: string) => {
    const clean = target.replace(/^[#/]+/, '');
    if (clean.startsWith('s') && clean.length <= 4) {
      window.location.hash = `#/${clean}`;
      setActiveStoryId(clean);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (clean === 'library') {
      router.push('/learn');
    } else if (clean === 'home' || clean === '') {
      router.push('/');
    } else {
      router.push(`/${clean}`);
    }
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="news" />
      <main style={{ minHeight: '80vh' }}>
        <div className="pbn">
          <div className="w">
            <div className="pbn-actions">
              <button
                type="button"
                onClick={() => typeof window !== 'undefined' && window.history.length > 1 ? router.back() : router.push('/')}
                className="pbn-btn-back"
                aria-label="Go back to previous page"
              >
                ← Back
              </button>
              <Link href="/" className="pbn-btn-home" aria-label="Go to homepage">
                🏠 Back to Home
              </Link>
            </div>
            <nav className="bc" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">News</span>
            </nav>
            <h1 className="disp">Kenya Education News & Verified Updates</h1>
            <p>
              Independent reporting on KCSE & KJSEA exam timelines, Ministry of Education policies, CBC circulars, and teacher guidelines.
            </p>
          </div>
        </div>
        <NewsSection
          onNavClick={handleNavClick}
          activeStoryId={activeStoryId}
          onSelectStory={(id) => {
            if (id) {
              window.location.hash = `#/${id}`;
              setActiveStoryId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.location.hash = '';
              setActiveStoryId(null);
            }
          }}
        />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
