'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { navigateBack } from '@/lib/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import CoursesAndGames from '@/components/CoursesAndGames';

export default function CoursesPage() {
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
      <Header onNavClick={handleNavClick} activeNav="courses" />
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
              <span aria-current="page">Courses</span>
            </nav>
            <h1 className="disp">Courses and Practical Skills</h1>
            <p>
              Eight free self-paced learning guides with progress tracking: Digital Basics, Study Skills, Money Skills, Communication, Career, Languages, Coding, and Teacher Skills.
            </p>
          </div>
        </div>
        <CoursesAndGames mode="courses" />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
