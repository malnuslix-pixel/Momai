'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import TutoringSection from '@/components/TutoringSection';

export default function TutoringPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="tutoring" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Tutoring</span>
            </div>
            <h1 className="disp">Tutoring & Daily Practice</h1>
            <p>
              Connect with vetted Kenyan tutors for 1-on-1 revision, apply as an educator, or generate daily maths practice sets.
            </p>
          </div>
        </div>
        <TutoringSection onNavClick={handleNavClick} />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
