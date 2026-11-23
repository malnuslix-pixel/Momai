'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/mwalimu-site.css';

// Critical Above-the-Fold Components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RoleChooser from '@/components/RoleChooser';
import SearchSection from '@/components/SearchSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';

// Code-Split Sections for Fast Performance
const LibrarySection = dynamic(() => import('@/components/LibrarySection'), { ssr: true });
const TeachingSection = dynamic(() => import('@/components/TeachingSection'), { ssr: true });
const ToolsSection = dynamic(() => import('@/components/ToolsSection'), { ssr: true });
const NoticesSection = dynamic(() => import('@/components/NoticesSection'), { ssr: true });
const ExamsHubSection = dynamic(() => import('@/components/ExamsHubSection'), { ssr: true });
const CoursesAndGames = dynamic(() => import('@/components/CoursesAndGames'), { ssr: true });
const TutoringSection = dynamic(() => import('@/components/TutoringSection'), { ssr: true });
const ParentsAndJobs = dynamic(() => import('@/components/ParentsAndJobs'), { ssr: true });
const AdvertiseSection = dynamic(() => import('@/components/AdvertiseSection'), { ssr: true });
const VideosSection = dynamic(() => import('@/components/VideosSection'), { ssr: true });
const HelpGlossarySection = dynamic(() => import('@/components/HelpGlossarySection'), { ssr: true });
const ActivitySection = dynamic(() => import('@/components/ActivitySection'), { ssr: true });
const AboutAndContact = dynamic(() => import('@/components/AboutAndContact'), { ssr: true });
const FloatingWidgets = dynamic(() => import('@/components/FloatingWidgets'), { ssr: false });

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
    if (hash.startsWith('#/s')) {
      window.location.hash = hash;
      const sId = hash.replace('#/', '');
      setActiveStoryId(sId);
      setActiveNav('news');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveStoryId(null);
      const targetId = hash.replace('#', '');
      window.location.hash = `#${targetId}`;
      setActiveNav(targetId);
      if (targetId === 'home' || targetId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        requestAnimationFrame(() => {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
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
            <SearchSection onNavClick={handleNavClick} />
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
            <ExamsHubSection onNavClick={handleNavClick} />
            <CoursesAndGames />
            <TutoringSection onNavClick={handleNavClick} />
            <ParentsAndJobs onNavClick={handleNavClick} />
            <AdvertiseSection onNavClick={handleNavClick} />
            <VideosSection />
            <HelpGlossarySection />
            <ActivitySection onNavClick={handleNavClick} />
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
