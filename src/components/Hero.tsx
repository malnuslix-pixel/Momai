'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface HeroProps {
  onNavClick: (hash: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [isLite, setIsLite] = useState(false);

  // Detect lite mode on mount and when it toggles
  useEffect(() => {
    const checkLite = () => document.documentElement.classList.contains('lite');
    setIsLite(checkLite());

    const observer = new MutationObserver(() => setIsLite(checkLite()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Cinematic scroll in Full mode (disabled in Lite mode for low data)
  useEffect(() => {
    if (isLite) return;

    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      const maxScroll = r.height - window.innerHeight;
      if (maxScroll <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / maxScroll));
      hero.style.setProperty('--p', p.toFixed(3));
      const idx = Math.min(2, Math.floor(p * 3));
      setActiveScene(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isLite]);

  return (
    <section className="hero" id="home" ref={heroRef} aria-label="Introduction">
      <div className="stage">
        <div className="sun" aria-hidden="true" />
        <div className="ring" aria-hidden="true" />

        <div className="w" style={{ position: 'relative', width: '100%' }}>
          <div className="scenes">
            {/* Scene 1 */}
            <div className={`scene ${isLite || activeScene === 0 ? 'on' : ''}`}>
              <h1>Kenya&apos;s school news, made clear.</h1>
              <p>What exam timelines, policies and placements mean for your family, explained in plain words.</p>
              <div className="btns">
                <Link href="/learn" className="btn b1">
                  📚 Browse Library
                </Link>
                <Link href="/exams" className="btn b2">
                  📝 View Exams Hub
                </Link>
              </div>
            </div>

            {/* Scene 2 */}
            <div className={`scene ${isLite || activeScene === 1 ? 'on' : ''}`}>
              <h1>Classroom-ready resources.</h1>
              <p>Schemes of work, lesson plans and records for every grade, built for Kenyan teachers.</p>
              <div className="btns">
                <Link href="/teach" className="btn b1">
                  👩🏾‍🏫 Teacher Preparation
                </Link>
                <Link href="/tools" className="btn b2">
                  🧮 Classroom Tools
                </Link>
              </div>
            </div>

            {/* Scene 3 */}
            <div className={`scene ${isLite || activeScene === 2 ? 'on' : ''}`}>
              <h1>Practical skills for school and work.</h1>
              <p>Short courses in study, money, digital and career skills, with Kenyan examples.</p>
              <div className="btns">
                <Link href="/courses" className="btn b1">
                  🎓 Browse Courses
                </Link>
                <Link href="/tutor" className="btn b2">
                  🤖 Ask Mwalimu AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News Ticker */}
        <div className="tick">
          <div className="w tk">
            <strong>Latest:</strong>
            <div className="mq" role="region" aria-label="Latest education news ticker">
              <div className="mt">
                {/* Half 1 */}
                <a href="#/s1" onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}>
                  2026 KJSEA results expected in December, KCSE targeted for January 2027
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s4" onClick={(e) => { e.preventDefault(); onNavClick('#/s4'); }}>
                  How to spot fake KJSEA and KCSE results messages
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s5" onClick={(e) => { e.preventDefault(); onNavClick('#/s5'); }}>
                  KPSEA, KJSEA and KCSE explained
                </a>
                <span aria-hidden="true">•</span>
                {/* Half 2 - Exact duplicate for seamless 50% translation loop */}
                <a href="#/s1" onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}>
                  2026 KJSEA results expected in December, KCSE targeted for January 2027
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s4" onClick={(e) => { e.preventDefault(); onNavClick('#/s4'); }}>
                  How to spot fake KJSEA and KCSE results messages
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s5" onClick={(e) => { e.preventDefault(); onNavClick('#/s5'); }}>
                  KPSEA, KJSEA and KCSE explained
                </a>
                <span aria-hidden="true">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
