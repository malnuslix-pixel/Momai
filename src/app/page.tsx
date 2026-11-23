'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Critical Above-the-Fold Components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RoleChooser from '@/components/RoleChooser';
import SearchSection from '@/components/SearchSection';
import NewsSection from '@/components/NewsSection';
import VideosSection from '@/components/VideosSection';
import AboutAndContact from '@/components/AboutAndContact';
import Footer from '@/components/Footer';

// Code-Split Dynamic Floating Widgets
const FloatingWidgets = dynamic(() => import('@/components/FloatingWidgets'), { ssr: false });

export default function HomePage() {
  const router = useRouter();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  // Initialize routing from URL hash for article reader view
  useEffect(() => {
    // 1. Fetch live config flags from backend
    fetch('/api/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.flags?.maint) {
          setIsMaintenance(true);
        }
      })
      .catch((err) => console.warn('Config notice:', err));

    // 2. Handle initial hash routing for news stories
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/s')) {
        const storyId = hash.replace('#/', '');
        setActiveStoryId(storyId);
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setActiveStoryId(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavClick = (hash: string) => {
    const clean = hash.replace(/^[#/]+/, '');
    if (clean.startsWith('s') && clean.length <= 4) {
      router.push(`/news#/${clean}`);
    } else if (clean === 'home' || clean === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (clean === 'library') {
      router.push('/learn');
    } else {
      router.push(`/${clean}`);
    }
  };

  if (isMaintenance) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#faf8f5',
        color: '#1a1a1a',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <div style={{ maxWidth: '32rem' }}>
          <div style={{ fontSize: '3rem' }}>🛠️</div>
          <h1 style={{ fontFamily: 'Georgia, serif', color: '#2c5f2d', margin: '0.8rem 0' }}>
            Mwalimu Family
          </h1>
          <p style={{ color: '#555', lineHeight: 1.6 }}>
            The system is undergoing scheduled editorial and technical maintenance. We will be right back shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Top fixed progress bar */}
      <div className="bar" aria-hidden="true" />

      {/* Main Header & Nav */}
      <Header onNavClick={handleNavClick} activeNav="home" />

      {/* Main Application Container */}
      <main style={{ minHeight: '70vh' }}>
        {/* If article view is active, render reader only */}
        {activeStoryId ? (
          <NewsSection
            onNavClick={handleNavClick}
            activeStoryId={activeStoryId}
            onSelectStory={(id) => {
              setActiveStoryId(id);
              if (!id) window.location.hash = '';
            }}
          />
        ) : (
          <>
            <Hero onNavClick={handleNavClick} />
            <RoleChooser onNavClick={handleNavClick} />
            <SearchSection onNavClick={handleNavClick} />

            {/* News Section */}
            <NewsSection
              onNavClick={handleNavClick}
              activeStoryId={null}
              onSelectStory={(id) => {
                if (id) {
                  window.location.hash = `#/${id}`;
                  setActiveStoryId(id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />

            {/* MAIN CORE HUBS & PORTALS DIRECT ACCESS */}
            <section className="sec alt" id="portals">
              <div className="w">
                <div style={{ marginBottom: '1.2rem' }}>
                  <span className="tag">Quick Access</span>
                  <h2 className="sh" style={{ margin: '0.3rem 0 0.2rem' }}>Explore Mwalimu Family Hubs</h2>
                  <p className="sub" style={{ margin: 0 }}>
                    Direct access to verified curriculum materials, official exam schedules, interactive calculators, and educator tools.
                  </p>
                </div>

                <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.2rem' }}>
                  <Link href="/learn" className="x2c">
                    <span style={{ fontSize: '2rem' }}>📚</span>
                    <h3>Curriculum Library</h3>
                    <p>Free editable schemes of work, lesson plans, notes & Word (.doc) templates from PP1 to Form 4.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Browse Library →</span>
                  </Link>

                  <Link href="/tools" className="x2c">
                    <span style={{ fontSize: '2rem' }}>🧮</span>
                    <h3>Classroom & KCSE Tools</h3>
                    <p>Instant KCSE points calculator, KUCCPS university cluster cutoffs & CBC report remark generators.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Explore Tools →</span>
                  </Link>

                  <Link href="/exams" className="x2c">
                    <span style={{ fontSize: '2rem' }}>📝</span>
                    <h3>National Exams Hub</h3>
                    <p>Verified KPSEA, KJSEA & KCSE 2026/2027 timelines, marking centers, and official results advisories.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>View Exams Hub →</span>
                  </Link>

                  <Link href="/teach" className="x2c">
                    <span style={{ fontSize: '2rem' }}>👩🏾‍🏫</span>
                    <h3>Teacher Preparation</h3>
                    <p>Custom term scheme builder, timetable planner & 7 official TPAD-aligned classroom record templates.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Open Teacher Desk →</span>
                  </Link>

                  <Link href="/tutor" className="x2c">
                    <span style={{ fontSize: '2rem' }}>🤖</span>
                    <h3>Ask Mwalimu AI Tutor</h3>
                    <p>Instant curriculum revision, homework explanations & interactive offline-capable subject quizzes.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Start AI Tutor →</span>
                  </Link>

                  <Link href="/notices" className="x2c">
                    <span style={{ fontSize: '2rem' }}>📢</span>
                    <h3>Education Notice Board</h3>
                    <p>Official Ministry of Education term dates, Grade 10 Senior School checklists & circulars.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Check Notices →</span>
                  </Link>

                  <Link href="/jobs" className="x2c">
                    <span style={{ fontSize: '2rem' }}>💼</span>
                    <h3>Education Jobs Board</h3>
                    <p>Teaching, tutoring & school administration vacancies across Kenya with 100% zero placement fees.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Browse Jobs →</span>
                  </Link>

                  <Link href="/parents" className="x2c">
                    <span style={{ fontSize: '2rem' }}>👨🏾‍👩🏾‍👧🏾</span>
                    <h3>Parents’ Guidance Hub</h3>
                    <p>Senior School Grade 10 pathway decider, consultation checklists & school calendar phone sync.</p>
                    <span className="dl" style={{ marginTop: '0.8rem', display: 'inline-block' }}>Open Parents Hub →</span>
                  </Link>
                </div>

                {/* Device Activity Quick Banner */}
                <div className="card" style={{ marginTop: '1.2rem', background: '#f5faf5', borderColor: '#cfe5cf', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1a4d1d' }}>📋 Saved Materials & Submissions</h3>
                    <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.92rem' }}>
                      Quickly access your saved templates, tutor inquiries, submitted vacancy listings, and bookmarks on this device.
                    </p>
                  </div>
                  <Link href="/activity" className="gb">
                    View My Activity →
                  </Link>
                </div>
              </div>
            </section>

            {/* Educational YouTube Videos Section */}
            <VideosSection />

            {/* About Mwalimu Family & Stay in Touch Contact Section */}
            <AboutAndContact />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavClick={handleNavClick} />

      {/* Non-overlapping Floating Action Widgets */}
      <FloatingWidgets onNavClick={handleNavClick} />
    </>
  );
}
