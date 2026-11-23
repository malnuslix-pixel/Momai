'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import AboutAndContact from '@/components/AboutAndContact';

export default function AboutPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="about" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>About</span>
            </div>
            <h1 className="disp">About Mwalimu Family</h1>
            <p>
              “Mwalimu” means teacher in Swahili. We publish independent education news, verified curriculum templates, and learning tools for Kenyan families.
            </p>
          </div>
        </div>
        <AboutAndContact />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
