'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import ToolsSection from '@/components/ToolsSection';

export default function ToolsPage() {
  const router = useRouter();

  const handleNavClick = (target: string) => {
    const clean = target.replace(/^[#/]+/, '');
    if (clean === 'library') {
      router.push('/learn');
    } else if (clean.startsWith('s') && clean.length <= 4) {
      router.push(`/news#/${clean}`);
    } else if (clean === 'home' || clean === '') {
      router.push('/');
    } else {
      router.push(`/${clean}`);
    }
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="tools" />
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
              <span aria-current="page">Classroom Tools</span>
            </nav>
            <h1 className="disp">Tools That Save Time</h1>
            <p>
              16 interactive educational calculators, report comment generators, timers, and printable planning tools designed for Kenyan teachers and learners.
            </p>
          </div>
        </div>
        <ToolsSection />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
