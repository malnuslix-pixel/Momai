'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import '@/styles/mwalimu-site.css';

// Critical Above-the-Fold Components
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import RoleChooser from '@/components/RoleChooser';
import SearchSection from '@/components/SearchSection';
import NewsSection from '@/components/NewsSection';
import Footer from '@/components/Footer';

// Code-Split Dynamic Floating Widgets
const FloatingWidgets = dynamic(() => import('@/components/FloatingWidgets'), { ssr: false });

export default function HomePage() {
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

    // 2. Register Service Worker for PWA offline capabilities
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // 3. Handle initial hash routing for news stories
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
    if (hash.startsWith('#/s')) {
      window.location.hash = hash;
      const sId = hash.replace('#/', '');
      setActiveStoryId(sId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveStoryId(null);
      const targetId = hash.replace('#', '');
      if (targetId === 'home' || targetId === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <main style={{ minHeight: '80vh' }}>
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

            {/* HUB 1: LEARNING & TEACHING LIBRARY */}
            <section className="sec" id="curriculum-hub">
              <div className="w">
                <h2 className="sh">Curriculum & Teaching Hub</h2>
                <p className="sub">
                  Free, editable lesson plans, schemes of work, notes, and professional teaching logs for Kenyan teachers and learners from PP1 to Form 4.
                </p>

                <div className="x2" style={{ marginTop: '1.5rem' }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="tag">PP1 to Form 4</span>
                      <h3 style={{ fontSize: '1.4rem', margin: '0.8rem 0 0.5rem' }}>📚 Learning & Teaching Library</h3>
                      <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Browse our comprehensive repository of syllabus-aligned notes, revision papers, and printable resources. Filter by grade, subject, and term with free Word (.doc) downloads.
                      </p>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                      <Link href="/learn" className="gb" style={{ display: 'inline-block' }}>
                        Browse Full Library →
                      </Link>
                    </div>
                  </div>

                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="tag">Educator Prep</span>
                      <h3 style={{ fontSize: '1.4rem', margin: '0.8rem 0 0.5rem' }}>👩🏾‍🏫 Teacher Preparation Hub</h3>
                      <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Generate custom term schemes of work, build balanced school timetables, and download 7 official Ministry/TPAD-aligned classroom record templates.
                      </p>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                      <Link href="/teach" className="gb" style={{ display: 'inline-block' }}>
                        Open Teaching Hub →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HUB 2: 16 INTERACTIVE TOOLS & CALCULATORS */}
            <section className="sec alt" id="tools-hub">
              <div className="w">
                <h2 className="sh">Classroom Tools & Calculators</h2>
                <p className="sub">
                  16 practical digital utilities for students, teachers, and school heads: KCSE calculators, KUCCPS cluster points, report comment generators, rubrics, and focus timers.
                </p>

                <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '1.5rem' }}>
                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🎯 KCSE Grade & Points Calculator</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Input grades across core 7 subjects to instantly compute aggregate points (out of 84) and official KNEC mean grade.
                    </p>
                    <Link href="/tools" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Calculate KCSE Grade →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>🎓 KUCCPS Degree Cluster Points</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Compute official university admission cut-offs using the official formula with your 4 subject cluster requirements.
                    </p>
                    <Link href="/tools" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Calculate Cluster Points →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>✍️ Single & Bulk Report Comments</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Generate constructive, professional CBC and KCSE report remarks tailored to learner strengths and improvement areas.
                    </p>
                    <Link href="/tools" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Generate Comments →
                    </Link>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                  <Link href="/tools" className="btn b1" style={{ display: 'inline-block', padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
                    Access All 16 Free Tools & Calculators →
                  </Link>
                </div>
              </div>
            </section>

            {/* HUB 3: EXAMS, NOTICES & JOBS */}
            <section className="sec" id="community-hub">
              <div className="w">
                <h2 className="sh">Exams, Notices & Education Jobs</h2>
                <p className="sub">
                  Kenya national assessment guidance, verified Ministry of Education term announcements, and authenticated teaching vacancies.
                </p>

                <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '1.5rem' }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="tag">KNEC Assessments</span>
                      <h3 style={{ fontSize: '1.3rem', margin: '0.6rem 0' }}>📝 Exams Hub: KPSEA, KJSEA & KCSE</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Accurate assessment schedules, marking centres overview, SMS verification advisories, and official portal links.
                      </p>
                    </div>
                    <Link href="/exams" className="gb o" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      Open Exams Hub →
                    </Link>
                  </div>

                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="tag">Official Circulars</span>
                      <h3 style={{ fontSize: '1.3rem', margin: '0.6rem 0' }}>📢 Education Notice Board</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Verified school term dates, Ministry notices, exam countdown clocks, and Senior School Grade 10 checklist.
                      </p>
                    </div>
                    <Link href="/notices" className="gb o" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      View Notice Board →
                    </Link>
                  </div>

                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span className="tag">Verified Vacancies</span>
                      <h3 style={{ fontSize: '1.3rem', margin: '0.6rem 0' }}>💼 Education Jobs Board</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Teaching, tutoring, and school administration opportunities across Kenya. Zero application fees guaranteed.
                      </p>
                    </div>
                    <Link href="/jobs" className="gb o" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      Browse Jobs & Post Vacancy →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* HUB 4: PRACTICAL SKILLS, TUTORING & GAMES */}
            <section className="sec alt" id="skills-hub">
              <div className="w">
                <h2 className="sh">Practical Skills, Tutoring & Games</h2>
                <p className="sub">
                  8 self-paced life courses with progress tracking, curriculum revision games, and 1-on-1 tutor matching.
                </p>

                <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginTop: '1.5rem' }}>
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>🎓 8 Self-Paced Courses</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Digital literacy, study habits, Kenyan money skills, public speaking, coding, and teacher communication with interactive lesson tracking.
                      </p>
                    </div>
                    <Link href="/courses" className="gb" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      Start Free Courses →
                    </Link>
                  </div>

                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>🎮 Revision Games & Quizzes</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Mathematics, Science, and Kiswahili quizzes, Memory Match cards, 60-second Speed Maths, and curriculum vocabulary scrambles.
                      </p>
                    </div>
                    <Link href="/games" className="gb" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      Play Revision Games →
                    </Link>
                  </div>

                  <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>📐 Tutoring & Daily Practice</h3>
                      <p style={{ color: '#555', fontSize: '0.92rem', lineHeight: 1.5 }}>
                        Generate daily mathematics practice sets with instant answers, find a verified Kenyan tutor, or apply to tutor students.
                      </p>
                    </div>
                    <Link href="/tutoring" className="gb" style={{ marginTop: '1.2rem', textAlign: 'center' }}>
                      Tutoring & Daily Practice →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* HUB 5: PARENTS, ADVERTISE & MEDIA */}
            <section className="sec" id="media-hub">
              <div className="w">
                <h2 className="sh">Families, Partnerships & Media</h2>
                <p className="sub">
                  Resources for parents, educational videos, curriculum glossary, and advertising packages for institutions.
                </p>

                <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '1.5rem' }}>
                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>👨🏾‍👩🏾‍👧🏾 Parents’ Educational Hub</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Grade 10 Senior School pathways guide, parent-teacher consultation questions, and phone calendar (.ics) term sync.
                    </p>
                    <Link href="/parents" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Open Parents’ Hub →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>📢 Advertise with Us</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Reach over 50,000 Kenyan teachers, parents, and school administrators with targeted educational promotional packages.
                    </p>
                    <Link href="/advertise" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      View Ad Packages & Quote →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>📺 Watch & Learn Videos</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Educational mini-lessons, parenting discussions, and school community stories on our official YouTube channel.
                    </p>
                    <Link href="/videos" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Watch Family Videos →
                    </Link>
                  </div>

                  <div className="card">
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>❓ Kenyan Education Glossary</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                      Clear, plain-language explanations of 15 essential Kenyan educational acronyms: CBC, KICD, KNEC, KUCCPS, NEMIS, UPI.
                    </p>
                    <Link href="/help" className="dl" style={{ display: 'inline-block', marginTop: '0.8rem' }}>
                      Read Curriculum Glossary →
                    </Link>
                  </div>
                </div>

                {/* Activity & Saved Progress Banner */}
                <div className="card" style={{ marginTop: '2.5rem', background: '#f5faf5', borderColor: '#cfe5cf', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1a4d1d' }}>📋 Device Activity & Submissions</h3>
                    <p style={{ margin: '0.3rem 0 0', color: '#555', fontSize: '0.92rem' }}>
                      Review your submitted vacancy forms, tutor inquiries, ad quotes, and saved curriculum materials.
                    </p>
                  </div>
                  <Link href="/activity" className="gb">
                    View My Activity →
                  </Link>
                </div>
              </div>
            </section>
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
