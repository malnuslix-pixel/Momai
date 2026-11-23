'use client';

import React, { useState, useEffect } from 'react';

interface HeroProps {
  onNavClick: (hash: string) => void;
}

const SLIDES = [
  {
    h1: "Kenya’s school news, made clear.",
    p: "What exam timelines, policies and placements mean for your family, explained in plain words.",
    btn1: { label: "Read the latest", href: "#news" },
    btn2: { label: "Browse learning materials", href: "#library" }
  },
  {
    h1: "Classroom-ready resources.",
    p: "Schemes of work, lesson plans and records for every grade, built for Kenyan teachers.",
    btn1: { label: "Open the library", href: "#library" },
    btn2: { label: "Read education news", href: "#news" }
  },
  {
    h1: "Practical skills for school and work.",
    p: "Short courses in study, money, digital and career skills, with Kenyan examples.",
    btn1: { label: "Explore courses", href: "#courses" },
    btn2: { label: "Watch videos", href: "#videos" }
  }
];

export default function Hero({ onNavClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="hero" id="home" aria-label="Introduction" style={{ height: 'auto', minHeight: '680px' }}>
      <div className="stage" style={{ position: 'relative', height: 'auto', minHeight: '680px', padding: '6.5rem 0 3.5rem' }}>
        <div className="sun" aria-hidden="true" />
        <div className="ring" aria-hidden="true" />

        <div className="w" style={{ position: 'relative', zIndex: 10 }}>
          <div className="scenes" style={{ height: 'auto', minHeight: '340px' }}>
            <div className="scene on" key={currentSlide} style={{ position: 'relative', opacity: 1, transform: 'none' }}>
              <h1>{slide.h1}</h1>
              <p>{slide.p}</p>
              <div className="btns">
                <a
                  href={slide.btn1.href}
                  className="btn b1"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick(slide.btn1.href);
                  }}
                >
                  {slide.btn1.label}
                </a>
                <a
                  href={slide.btn2.href}
                  className="btn b2"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick(slide.btn2.href);
                  }}
                >
                  {slide.btn2.label}
                </a>
              </div>
            </div>
          </div>

          {/* Slide Indicator Pills */}
          <div style={{ display: 'flex', gap: '0.45rem', marginTop: '1.5rem' }}>
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: currentSlide === idx ? '32px' : '10px',
                  height: '8px',
                  borderRadius: '50px',
                  border: 'none',
                  background: currentSlide === idx ? '#f4a261' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0
                }}
              />
            ))}
          </div>
        </div>

        {/* Latest News Ticker */}
        <div className="tick">
          <div className="w tk">
            <strong>Latest:</strong>
            <div className="mq">
              <div className="mt">
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
                <a href="#/s1" onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}>
                  2026 KJSEA results expected in December, KCSE targeted for January 2027
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
