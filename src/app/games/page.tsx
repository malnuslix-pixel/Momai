'use client';

import React from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import CoursesAndGames from '@/components/CoursesAndGames';

export default function GamesPage() {
  const handleNavClick = (hash: string) => {
    window.location.href = `/${hash}`;
  };

  return (
    <>
      <Header onNavClick={handleNavClick} activeNav="games" />
      <main style={{ minHeight: '80vh', paddingTop: '72px' }}>
        <div className="pbn">
          <div className="w">
            <div className="bc">
              <Link href="/">Home</Link>
              <span> / </span>
              <span>Games</span>
            </div>
            <h1 className="disp">Educational Games & Quizzes</h1>
            <p>
              Interactive subject quizzes, speed maths tests, Kiswahili-English memory cards, and curriculum vocabulary scrambles with streaks and saved high scores.
            </p>
          </div>
        </div>
        <CoursesAndGames />
      </main>
      <Footer onNavClick={handleNavClick} />
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
