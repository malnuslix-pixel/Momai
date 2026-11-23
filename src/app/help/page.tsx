'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import HelpGlossarySection from '@/components/HelpGlossarySection';

export default function HelpPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="help" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Help</span>
            </div>
            <h1 className="disp">Help & Curriculum Glossary</h1>
            <p>
              Plain-language definitions of Kenyan educational acronyms and terms, plus solutions to frequent exam and curriculum questions.
            </p>
          </div>
        </div>
        <HelpGlossarySection />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
