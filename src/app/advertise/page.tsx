'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { navigateBack } from '@/lib/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import AdvertiseSection from '@/components/AdvertiseSection';

export default function AdvertisePage() {
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
      <Header onNavClick={handleNavClick} activeNav="advertise" />
      <main style={{ minHeight: '80vh' }}>
        <div className="pbn">
          <div className="w">
            <div className="pbn-actions">
              <button
                type="button"
                onClick={() => navigateBack(router, '/')}
                className="pbn-btn-back"
                aria-label="Go back to previous page"
              >
                ← Back
              </button>
            </div>
            <nav className="bc" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Advertise</span>
            </nav>
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
