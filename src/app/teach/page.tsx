'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import TeachingSection from '@/components/TeachingSection';

export default function TeachPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="teaching" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Teaching</span>
            </div>
            <h1 className="disp">Teaching Materials & Generators</h1>
            <p>
              Free, original templates and tools for Kenyan teachers: schemes of work, lesson notes, timetable generator, and records. Everything downloads as an editable Word (.doc) file.
            </p>
          </div>
        </div>
        <TeachingSection onNavClick={handleNavClick} />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
