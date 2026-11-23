'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onNavClick: (hash: string) => void;
  activeNav: string;
}

export default function Header({ onNavClick, activeNav }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLite, setIsLite] = useState(false);
  const [fontSizeIdx, setFontSizeIdx] = useState(0);
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLite = () => {
    const next = !isLite;
    setIsLite(next);
    document.documentElement.classList.toggle('lite', next);
    try {
      localStorage.setItem('lite', next ? '1' : '0');
    } catch {}
  };

  const cycleFontSize = () => {
    const sizes = [16, 18, 20];
    const nextIdx = (fontSizeIdx + 1) % sizes.length;
    setFontSizeIdx(nextIdx);
    document.documentElement.style.setProperty('--fs', `${sizes[nextIdx]}px`);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'sw' : 'en';
    setLang(next);
    document.documentElement.lang = next;
  };

  const handleLink = (hash: string) => {
    setMenuOpen(false);
    onNavClick(hash);
  };

  return (
    <header className={`site-header ${isScrolled ? 'sol' : ''}`}>
      <div className="nav">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLink('#home');
          }}
          className="logo"
          aria-label="Mwalimu Family home"
        >
          <span aria-hidden="true">🏠</span> Mwalimu Family
        </a>

        <div className="ctl">
          <button onClick={toggleLite} title="Low-data mode: no heavy animation">
            {isLite ? 'Full' : 'Lite'}
          </button>
          <button onClick={cycleFontSize} aria-label="Change text size">
            A+
          </button>
          <button onClick={toggleLang}>
            {lang === 'en' ? 'Kiswahili' : 'English'}
          </button>
        </div>

        <button
          className="tg"
          aria-expanded={menuOpen}
          aria-controls="menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕ Close' : '☰ Menu'}
        </button>

        <nav aria-label="Main">
          <ul id="menu" className={menuOpen ? 'open' : ''}>
            <li>
              <a
                href="#news"
                className={activeNav === 'news' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleLink('#news');
                }}
              >
                {lang === 'sw' ? 'Habari' : 'News'}
              </a>
            </li>

            <li className="dd">
              <a href="#library" onClick={(e) => { e.preventDefault(); handleLink('#library'); }}>
                {lang === 'sw' ? 'Jifunze' : 'Learn'}
              </a>
              <ul>
                <li><Link href="/tutor" onClick={() => setMenuOpen(false)}>🤖 AI Tutor</Link></li>
                <li><Link href="/leaderboard" onClick={() => setMenuOpen(false)}>🏆 Leaderboard</Link></li>
                <li><Link href="/pricing" onClick={() => setMenuOpen(false)}>💳 Pricing</Link></li>
                <li><a href="#library" onClick={(e) => { e.preventDefault(); handleLink('#library'); }}>Library</a></li>
                <li><a href="#tutoring" onClick={(e) => { e.preventDefault(); handleLink('#tutoring'); }}>Tutoring</a></li>
                <li><a href="#tools" onClick={(e) => { e.preventDefault(); handleLink('#tools'); }}>Tools</a></li>
                <li><a href="#videos" onClick={(e) => { e.preventDefault(); handleLink('#videos'); }}>Videos</a></li>
              </ul>
            </li>

            <li>
              <a
                href="#courses"
                className={activeNav === 'courses' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleLink('#courses'); }}
              >
                Courses
              </a>
            </li>

            <li>
              <a
                href="#games"
                className={activeNav === 'games' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleLink('#games'); }}
              >
                Games
              </a>
            </li>

            <li className="dd">
              <a href="#teaching" onClick={(e) => { e.preventDefault(); handleLink('#teaching'); }}>
                {lang === 'sw' ? 'Fundisha' : 'Teach'}
              </a>
              <ul>
                <li><a href="#teaching" onClick={(e) => { e.preventDefault(); handleLink('#teaching'); }}>Teaching</a></li>
                <li><a href="#jobs" onClick={(e) => { e.preventDefault(); handleLink('#jobs'); }}>Jobs</a></li>
              </ul>
            </li>

            <li className="dd">
              <a href="#parents" onClick={(e) => { e.preventDefault(); handleLink('#parents'); }}>
                {lang === 'sw' ? 'Familia' : 'Families'}
              </a>
              <ul>
                <li><a href="#parents" onClick={(e) => { e.preventDefault(); handleLink('#parents'); }}>Parents</a></li>
                <li><a href="#exams" onClick={(e) => { e.preventDefault(); handleLink('#exams'); }}>Exams</a></li>
                <li><a href="#help" onClick={(e) => { e.preventDefault(); handleLink('#help'); }}>Help & glossary</a></li>
                <li><a href="#notices" onClick={(e) => { e.preventDefault(); handleLink('#notices'); }}>Notices</a></li>
              </ul>
            </li>

            <li>
              <a
                href="#advertise"
                className={activeNav === 'advertise' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleLink('#advertise'); }}
              >
                Advertise
              </a>
            </li>

            <li>
              <Link href="/control-room" onClick={() => setMenuOpen(false)}>
                Control Room
              </Link>
            </li>

            <li>
              <a
                href="#about"
                className={activeNav === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleLink('#about'); }}
              >
                About
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="cta"
                onClick={(e) => { e.preventDefault(); handleLink('#contact'); }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
