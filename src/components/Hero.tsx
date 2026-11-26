'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { useCms } from '@/lib/cms-context';

interface HeroProps {
  onNavClick: (hash: string) => void;
}

export default function Hero({ onNavClick }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lastSceneRef = useRef(0);
  const [activeScene, setActiveScene] = useState(0);
  const [lang] = useLanguage();
  const { cms } = useCms();
  const scenes = cms.siteCopy.heroScenes;
  const tickerItems = cms.siteCopy.tickerItems;
  const tickerLabel = lang === 'sw' ? cms.siteCopy.tickerLabelSw : cms.siteCopy.tickerLabel;

  // Cinematic scroll: hardware-accelerated scene transitions based on scroll progress
  useEffect(() => {
    let rafId = 0;
    let ticking = false;
    const updateScroll = () => {
      const hero = heroRef.current;
      const stage = stageRef.current;
      if (hero) {
        const r = hero.getBoundingClientRect();
        const stageHeight = stage?.offsetHeight || window.innerHeight;
        const maxScroll = hero.offsetHeight - stageHeight;
        if (maxScroll > 0) {
          const p = Math.min(1, Math.max(0, -r.top / maxScroll));
          hero.style.setProperty('--p', p.toFixed(3));
          const idx = p < 0.33 ? 0 : p < 0.67 ? 1 : 2;
          if (idx !== lastSceneRef.current) {
            lastSceneRef.current = idx;
            setActiveScene(idx);
          }
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef} aria-label="Introduction">
      <div className="stage" ref={stageRef}>
        {/* Horizon Sunrise SVG & Orbital Ring */}
        <div className="sun" aria-hidden="true">
          <svg viewBox="0 0 400 400" className="sun-svg" focusable="false">
            <defs>
              <radialGradient id="mf-sun-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f4a261" stopOpacity="0.42" />
                <stop offset="70%" stopColor="#f4a261" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f4a261" stopOpacity="0.18" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="196" fill="url(#mf-sun-grad)" stroke="rgba(244, 162, 97, 0.28)" strokeWidth="2" />
          </svg>
        </div>
        <div className="ring" aria-hidden="true" />

        <div className="w" style={{ position: 'relative', width: '100%' }}>
          <div className="scenes">
            {scenes.slice(0, 3).map((sc, idx) => (
              <div key={idx} className={`scene ${activeScene === idx ? 'on' : ''}`}>
                <h1>{lang === 'sw' ? sc.titleSw : sc.title}</h1>
                <p>{lang === 'sw' ? sc.subtitleSw : sc.subtitle}</p>
                <div className="btns">
                  <Link href={sc.cta1Href || '/learn'} className="btn b1">
                    {lang === 'sw' ? sc.cta1LabelSw : sc.cta1Label}
                  </Link>
                  <Link href={sc.cta2Href || '/exams'} className="btn b2">
                    {lang === 'sw' ? sc.cta2LabelSw : sc.cta2Label}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News Ticker */}
        <div className="tick">
          <div className="w tk">
            <strong>{tickerLabel}</strong>
            <div className="mq" role="region" aria-label="Latest education news ticker">
              <div className="mt">
                {[0, 1].map((dupIdx) => (
                  <React.Fragment key={dupIdx}>
                    {tickerItems.map((tk, idx) => (
                      <React.Fragment key={`${dupIdx}-${idx}`}>
                        {tk.href.startsWith('#') ? (
                          <a href={tk.href} onClick={(e) => { e.preventDefault(); onNavClick(tk.href); }}>
                            {lang === 'sw' ? tk.labelSw : tk.label}
                          </a>
                        ) : (
                          <Link href={tk.href}>
                            {lang === 'sw' ? tk.labelSw : tk.label}
                          </Link>
                        )}
                        <span aria-hidden="true">•</span>
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
