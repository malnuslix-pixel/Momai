'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import AdvertiseSection from '@/components/AdvertiseSection';

export default function AdvertisePage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="advertise" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Advertise</span>
            </div>
            <h1 className="disp">Advertise & Promote</h1>
            <p>
              Connect your educational brand, school, or event with engaged Kenyan teachers, parents, and learners across all 47 counties.
            </p>
          </div>
        </div>
        <AdvertiseSection onNavClick={handleNavClick} />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
