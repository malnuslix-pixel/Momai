'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';

interface HeroProps {
  onNavClick: (hash: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [activeScene, setActiveScene] = useState(0);
  const [isLite, setIsLite] = useState(false);
  const [lang] = useLanguage();

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
        {!isLite && (
          <>
            <div className="sun" aria-hidden="true" />
            <div className="ring" aria-hidden="true" />
          </>
        )}

        <div className="w" style={{ position: 'relative', width: '100%' }}>
          {isLite ? (
            /* LITE MODE: High-speed, single-card responsive hero with zero scroll bloat */
            <div
              className="scene on"
              style={{
                position: 'relative',
                opacity: 1,
                visibility: 'visible',
                transform: 'none',
                padding: '0.5rem 0 1rem',
              }}
            >
              <h1>
                {lang === 'sw'
                  ? 'Habari za shule za Kenya, kwa lugha rahisi.'
                  : "Kenya's school news, made clear."}
              </h1>
              <p>
                {lang === 'sw'
                  ? 'Nini maana ya ratiba za mitihani, miongozo ya serikali na nafasi za vyuo kwa familia yako, ikielezwa wazi bila utata.'
                  : 'What exam timelines, policies and placements mean for your family, explained in plain words.'}
              </p>
              <div className="btns" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <Link href="/learn" className="btn b1">
                  📚 {lang === 'sw' ? 'Maktaba ya Masomo' : 'Browse Library'}
                </Link>
                <Link href="/exams" className="btn b2">
                  📝 {lang === 'sw' ? 'Kituo cha Mitihani' : 'View Exams Hub'}
                </Link>
                <Link href="/teach" className="btn b1">
                  👩🏾‍🏫 {lang === 'sw' ? 'Maandalizi ya Walimu' : 'Teacher Preparation'}
                </Link>
                <Link href="/tutor" className="btn b2">
                  🤖 {lang === 'sw' ? 'Mwalimu AI Tutor' : 'Ask Mwalimu AI Tutor'}
                </Link>
              </div>
            </div>
          ) : (
            /* FULL MODE: 3-Scene Cinematic Scroll Experience */
            <div className="scenes">
              {/* Scene 1 */}
              <div className={`scene ${activeScene === 0 ? 'on' : ''}`}>
                <h1>
                  {lang === 'sw'
                    ? 'Habari za shule za Kenya, kwa lugha rahisi.'
                    : "Kenya's school news, made clear."}
                </h1>
                <p>
                  {lang === 'sw'
                    ? 'Nini maana ya ratiba za mitihani, miongozo na nafasi za masomo kwa familia yako, ikielezwa wazi.'
                    : 'What exam timelines, policies and placements mean for your family, explained in plain words.'}
                </p>
                <div className="btns">
                  <Link href="/learn" className="btn b1">
                    📚 {lang === 'sw' ? 'Maktaba ya Masomo' : 'Browse Library'}
                  </Link>
                  <Link href="/exams" className="btn b2">
                    📝 {lang === 'sw' ? 'Kituo cha Mitihani' : 'View Exams Hub'}
                  </Link>
                </div>
              </div>

              {/* Scene 2 */}
              <div className={`scene ${activeScene === 1 ? 'on' : ''}`}>
                <h1>
                  {lang === 'sw'
                    ? 'Nyenzo kamili za kufundishia darasani.'
                    : 'Classroom-ready resources.'}
                </h1>
                <p>
                  {lang === 'sw'
                    ? 'Maazimio ya kazi, maandalio ya masomo na rekodi za kila darasa kwa walimu wa Kenya.'
                    : 'Schemes of work, lesson plans and records for every grade, built for Kenyan teachers.'}
                </p>
                <div className="btns">
                  <Link href="/teach" className="btn b1">
                    👩🏾‍🏫 {lang === 'sw' ? 'Maandalizi ya Walimu' : 'Teacher Preparation'}
                  </Link>
                  <Link href="/tools" className="btn b2">
                    🧮 {lang === 'sw' ? 'Zana za Darasani' : 'Classroom Tools'}
                  </Link>
                </div>
              </div>

              {/* Scene 3 */}
              <div className={`scene ${activeScene === 2 ? 'on' : ''}`}>
                <h1>
                  {lang === 'sw'
                    ? 'Ujuzi wa vitendo kwa shule na maisha.'
                    : 'Practical skills for school and work.'}
                </h1>
                <p>
                  {lang === 'sw'
                    ? 'Kozi fupi za stadi za masomo, fedha, teknolojia na taaluma zenye mifano halisi ya Kenya.'
                    : 'Short courses in study, money, digital and career skills, with Kenyan examples.'}
                </p>
                <div className="btns">
                  <Link href="/courses" className="btn b1">
                    🎓 {lang === 'sw' ? 'Kozi na Mafunzo' : 'Browse Courses'}
                  </Link>
                  <Link href="/tutor" className="btn b2">
                    🤖 {lang === 'sw' ? 'Uliza Mwalimu AI' : 'Ask Mwalimu AI Tutor'}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Latest News Ticker */}
        <div className="tick">
          <div className="w tk">
            <strong>{lang === 'sw' ? 'Mapya:' : 'Latest:'}</strong>
            <div className="mq" role="region" aria-label="Latest education news ticker">
              <div className="mt">
                {/* Half 1 */}
                <a href="#/s1" onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}>
                  {lang === 'sw'
                    ? 'Matokeo ya KJSEA 2026 kutarajiwa Desemba, KCSE ikilengwa Januari 2027'
                    : '2026 KJSEA results expected in December, KCSE targeted for January 2027'}
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s4" onClick={(e) => { e.preventDefault(); onNavClick('#/s4'); }}>
                  {lang === 'sw'
                    ? 'Jinsi ya kutambua jumbe ghushi za matokeo ya KJSEA na KCSE'
                    : 'How to spot fake KJSEA and KCSE results messages'}
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s5" onClick={(e) => { e.preventDefault(); onNavClick('#/s5'); }}>
                  {lang === 'sw'
                    ? 'Ufafanuzi kamili wa mitihani ya KPSEA, KJSEA na KCSE'
                    : 'KPSEA, KJSEA and KCSE explained'}
                </a>
                <span aria-hidden="true">•</span>
                {/* Half 2 - Exact duplicate for seamless 50% translation loop */}
                <a href="#/s1" onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}>
                  {lang === 'sw'
                    ? 'Matokeo ya KJSEA 2026 kutarajiwa Desemba, KCSE ikilengwa Januari 2027'
                    : '2026 KJSEA results expected in December, KCSE targeted for January 2027'}
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s4" onClick={(e) => { e.preventDefault(); onNavClick('#/s4'); }}>
                  {lang === 'sw'
                    ? 'Jinsi ya kutambua jumbe ghushi za matokeo ya KJSEA na KCSE'
                    : 'How to spot fake KJSEA and KCSE results messages'}
                </a>
                <span aria-hidden="true">•</span>
                <a href="#/s5" onClick={(e) => { e.preventDefault(); onNavClick('#/s5'); }}>
                  {lang === 'sw'
                    ? 'Ufafanuzi kamili wa mitihani ya KPSEA, KJSEA na KCSE'
                    : 'KPSEA, KJSEA and KCSE explained'}
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
