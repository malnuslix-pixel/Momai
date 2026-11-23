'use client';

import React, { useState, useEffect } from 'react';

interface HeroProps {
  onNavClick: (hash: string) => void;
}

const SLIDES = [
  {
    kicker: "🇰🇪 Kenya Education Desk",
    h1: "Kenya’s school news, made clear.",
    p: "What exam timelines, policies and placements mean for your family, explained in plain words.",
    btn1: { label: "Read the latest", href: "#news" },
    btn2: { label: "Browse learning materials", href: "#library" }
  },
  {
    kicker: "📚 Teacher & Classroom Hub",
    h1: "Classroom-ready resources.",
    p: "Schemes of work, lesson plans and records for every grade, built for Kenyan teachers.",
    btn1: { label: "Open the library", href: "#library" },
    btn2: { label: "Read education news", href: "#news" }
  },
  {
    kicker: "🚀 Lifelong Skills & Growth",
    h1: "Practical skills for school and work.",
    p: "Short courses in study, money, digital and career skills, with Kenyan examples.",
    btn1: { label: "Explore courses", href: "#courses" },
    btn2: { label: "Open study tools", href: "#tools" }
  }
];

export default function Hero({ onNavClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section
      className="hero"
      id="home"
      aria-label="Introduction"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="stage">
        <div className="sun" aria-hidden="true" />
        <div className="ring" aria-hidden="true" />

        <div className="w">
          <div className="scenes">
            <div className="scene on" key={currentSlide}>
              <span className="hero-kicker">{slide.kicker}</span>
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
          <div className="slide-indicators" role="tablist" aria-label="Slide navigation">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={currentSlide === idx ? 'true' : 'false'}
                className={`slide-pill ${currentSlide === idx ? 'active' : ''}`}
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
