'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import NoticesSection from '@/components/NoticesSection';

export default function NoticesPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="notices" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Notices</span>
            </div>
            <h1 className="disp">Education Notice Board</h1>
            <p>
              Verified official announcements, national exam countdowns, community education notices, and Senior School placement checklist.
            </p>
          </div>
        </div>
        <NoticesSection />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
