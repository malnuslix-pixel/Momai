'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import ToolsSection from '@/components/ToolsSection';

export default function ToolsPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="tools" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Tools</span>
            </div>
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
