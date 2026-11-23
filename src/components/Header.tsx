'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
  onNavClick: (hash: string) => void;
  activeNav: string;
}

export default function Header({ onNavClick, activeNav }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLite, setIsLite] = useState(false);
  const [fontSizeIdx, setFontSizeIdx] = useState(0);
  const [lang, setLang] = useState<'en' | 'sw'>('en');

  // Sync Lite mode from localStorage / saveData on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lite');
      const isDataSaver = !!(navigator as any).connection?.saveData;
      const on = saved === '1' || (saved === null && isDataSaver);
      setIsLite(on);
      document.documentElement.classList.toggle('lite', on);
    } catch {}
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dd')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
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
    setOpenDropdown(null);
    onNavClick(hash);
  };

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(prev => prev === name ? null : name);
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

            <li
              className={`dd ${openDropdown === 'learn' ? 'dd-open' : ''}`}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a href="#library" onClick={(e) => { toggleDropdown('learn', e); }}>
                {lang === 'sw' ? 'Jifunze' : 'Learn'}
              </a>
              <ul>
                <li><Link href="/tutor" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>🤖 AI Tutor</Link></li>
                <li><Link href="/leaderboard" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>🏆 Leaderboard</Link></li>
                <li><Link href="/pricing" onClick={() => { setMenuOpen(false); setOpenDropdown(null); }}>💳 Pricing</Link></li>
                <li><a href="#library" onClick={(e) => { e.preventDefault(); handleLink('#library'); }}>Library</a></li>
                <li><a href="#tools" onClick={(e) => { e.preventDefault(); handleLink('#tools'); }}>Tutoring</a></li>
                <li><a href="#tools" onClick={(e) => { e.preventDefault(); handleLink('#tools'); }}>Tools</a></li>
                <li><a href="#courses" onClick={(e) => { e.preventDefault(); handleLink('#courses'); }}>Videos</a></li>
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

            <li
              className={`dd ${openDropdown === 'teach' ? 'dd-open' : ''}`}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a href="#teaching" onClick={(e) => { toggleDropdown('teach', e); }}>
                {lang === 'sw' ? 'Fundisha' : 'Teach'}
              </a>
              <ul>
                <li><a href="#teaching" onClick={(e) => { e.preventDefault(); handleLink('#teaching'); }}>Teaching</a></li>
                <li><a href="#jobs" onClick={(e) => { e.preventDefault(); handleLink('#jobs'); }}>Jobs</a></li>
              </ul>
            </li>

            <li
              className={`dd ${openDropdown === 'families' ? 'dd-open' : ''}`}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a href="#parents" onClick={(e) => { toggleDropdown('families', e); }}>
                {lang === 'sw' ? 'Familia' : 'Families'}
              </a>
              <ul>
                <li><a href="#parents" onClick={(e) => { e.preventDefault(); handleLink('#parents'); }}>Parents</a></li>
                <li><a href="#parents" onClick={(e) => { e.preventDefault(); handleLink('#parents'); }}>Help & glossary</a></li>
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
