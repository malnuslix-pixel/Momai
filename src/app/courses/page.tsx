'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import CoursesAndGames from '@/components/CoursesAndGames';

export default function CoursesPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="courses" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Courses</span>
            </div>
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
