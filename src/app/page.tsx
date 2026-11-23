'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import '@/styles/mwalimu-site.css';

// TypeScript Components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RoleChooser from '@/components/RoleChooser';
import NewsSection from '@/components/NewsSection';
import LibrarySection from '@/components/LibrarySection';
import TeachingSection from '@/components/TeachingSection';
import ToolsSection from '@/components/ToolsSection';
import NoticesSection from '@/components/NoticesSection';
import ExamsHub from '@/components/ExamsHub';
import CoursesAndGames from '@/components/CoursesAndGames';
import ParentsAndJobs from '@/components/ParentsAndJobs';
import AboutAndContact from '@/components/AboutAndContact';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';

export default function HomePage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  // Initialize routing from URL hash
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

    // 2. Register Service Worker for PWA offline capabilities
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // 3. Handle initial hash routing
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/s')) {
        const storyId = hash.replace('#/', '');
        setActiveStoryId(storyId);
        setActiveNav('news');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (hash) {
        setActiveStoryId(null);
        const sectionId = hash.replace('#', '');
        setActiveNav(sectionId);
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        setActiveStoryId(null);
        setActiveNav('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavClick = (hash: string) => {
    window.location.hash = hash;
    if (hash.startsWith('#/s')) {
      const sId = hash.replace('#/', '');
      setActiveStoryId(sId);
      setActiveNav('news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveStoryId(null);
      const targetId = hash.replace('#', '');
      setActiveNav(targetId);
      if (targetId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
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
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/control-room" style={{ color: '#2c5f2d', fontWeight: 600 }}>
              Access Control Room →
            </Link>
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
      <Header onNavClick={handleNavClick} activeNav={activeNav} />

      {/* Main Application Container */}
      <main style={{ minHeight: '80vh' }}>
        {/* If article view is active, render reader only */}
        {activeStoryId ? (
          <NewsSection
            onNavClick={handleNavClick}
            activeStoryId={activeStoryId}
            onSelectStory={(id) => {
              setActiveStoryId(id);
              if (!id) handleNavClick('#news');
            }}
          />
        ) : (
          <>
            <Hero onNavClick={handleNavClick} />
            <RoleChooser onNavClick={handleNavClick} />
            <NewsSection
              onNavClick={handleNavClick}
              activeStoryId={null}
              onSelectStory={(id) => {
                if (id) handleNavClick(`#/${id}`);
              }}
            />
            <LibrarySection onNavClick={handleNavClick} />
            <TeachingSection onNavClick={handleNavClick} />
            <ToolsSection />
            <NoticesSection />
            <ExamsHub onNavClick={handleNavClick} />
            <CoursesAndGames />
            <ParentsAndJobs onNavClick={handleNavClick} />
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
