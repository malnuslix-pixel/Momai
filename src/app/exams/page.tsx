'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import ExamsHubSection from '@/components/ExamsHubSection';

export default function ExamsPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="exams" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Exams</span>
            </div>
            <h1 className="disp">Exams Hub: KPSEA, KJSEA & KCSE</h1>
            <p>
              Plain-language guidance on Kenya’s national assessments, expected results windows, marking centres, and how to verify scores safely.
            </p>
          </div>
        </div>
        <ExamsHubSection onNavClick={handleNavClick} />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
