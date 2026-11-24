'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';

interface HeaderProps {
  onNavClick?: (hash: string) => void;
  activeNav?: string;
}

export default function Header({ onNavClick, activeNav = 'home' }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLite, setIsLite] = useState(false);
  const [fontSizeIdx, setFontSizeIdx] = useState(0);
  const [lang, setLang] = useLanguage();

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
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(prev => prev === name ? null : name);
  };

  return (
    <header className={`site-header ${isScrolled ? 'sol' : ''}`}>
      <div className="nav">
        <Link
          href="/"
          onClick={closeMenu}
          className="logo"
          aria-label="Mwalimu Family home"
        >
          <span aria-hidden="true">🏠</span> Mwalimu Family
        </Link>

        <div className="ctl">
          <button onClick={toggleLite} title="Low-data mode: no heavy animation">
            {isLite ? 'Full' : 'Lite'}
          </button>
          <button onClick={cycleFontSize} aria-label="Change text size">
            A+
          </button>
          <button onClick={toggleLang} title={lang === 'en' ? 'Badilisha iwe Kiswahili' : 'Switch to English'}>
            {lang === 'en' ? '🇰🇪 SW' : '🇬🇧 EN'}
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
              <Link
                href="/news"
                className={activeNav === 'news' ? 'active' : ''}
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Habari' : 'News'}
              </Link>
            </li>

            <li className={`dd ${openDropdown === 'learn' ? 'dd-open' : ''}`}>
              <Link
                href="/learn"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth < 900) {
                    toggleDropdown('learn', e);
                  } else {
                    closeMenu();
                  }
                }}
              >
                {lang === 'sw' ? 'Jifunze' : 'Learn'}
              </Link>
              <ul>
                <li><Link href="/tutor" onClick={closeMenu}>🤖 AI Tutor</Link></li>
                <li><Link href="/leaderboard" onClick={closeMenu}>🏆 Leaderboard</Link></li>
                <li><Link href="/pricing" onClick={closeMenu}>💳 Pricing</Link></li>
                <li><Link href="/learn" onClick={closeMenu}>📚 Library</Link></li>
                <li><Link href="/tutoring" onClick={closeMenu}>📐 Tutoring</Link></li>
                <li><Link href="/tools" onClick={closeMenu}>🧮 Tools</Link></li>
                <li><Link href="/videos" onClick={closeMenu}>📺 Videos</Link></li>
              </ul>
            </li>

            <li>
              <Link
                href="/courses"
                className={activeNav === 'courses' ? 'active' : ''}
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Kozi' : 'Courses'}
              </Link>
            </li>

            <li>
              <Link
                href="/games"
                className={activeNav === 'games' ? 'active' : ''}
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Michezo' : 'Games'}
              </Link>
            </li>

            <li className={`dd ${openDropdown === 'teach' ? 'dd-open' : ''}`}>
              <Link
                href="/teach"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth < 900) {
                    toggleDropdown('teach', e);
                  } else {
                    closeMenu();
                  }
                }}
              >
                {lang === 'sw' ? 'Fundisha' : 'Teach'}
              </Link>
              <ul>
                <li><Link href="/teach" onClick={closeMenu}>👩🏾‍🏫 {lang === 'sw' ? 'Nyenzo za Kufundishia' : 'Teaching Materials'}</Link></li>
                <li><Link href="/jobs" onClick={closeMenu}>💼 {lang === 'sw' ? 'Nafasi za Kazi' : 'Education Jobs'}</Link></li>
              </ul>
            </li>

            <li className={`dd ${openDropdown === 'families' ? 'dd-open' : ''}`}>
              <Link
                href="/parents"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.innerWidth < 900) {
                    toggleDropdown('families', e);
                  } else {
                    closeMenu();
                  }
                }}
              >
                {lang === 'sw' ? 'Familia' : 'Families'}
              </Link>
              <ul>
                <li><Link href="/parents" onClick={closeMenu}>👨🏾‍👩🏾‍👧🏾 {lang === 'sw' ? 'Mwongozo wa Wazazi' : 'Parents’ Hub'}</Link></li>
                <li><Link href="/exams" onClick={closeMenu}>📝 {lang === 'sw' ? 'Kituo cha Mitihani' : 'Exams Hub'}</Link></li>
                <li><Link href="/help" onClick={closeMenu}>❓ {lang === 'sw' ? 'Msaada na Faharasa' : 'Help & Glossary'}</Link></li>
                <li><Link href="/notices" onClick={closeMenu}>📢 {lang === 'sw' ? 'Ubao wa Matangazo' : 'Notice Board'}</Link></li>
              </ul>
            </li>

            <li>
              <Link
                href="/advertise"
                className={activeNav === 'advertise' ? 'active' : ''}
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Tangaza' : 'Advertise'}
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className={activeNav === 'about' ? 'active' : ''}
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Kuhusu' : 'About'}
              </Link>
            </li>

            <li>
              <Link
                href="/about#contact"
                className="cta"
                onClick={closeMenu}
              >
                {lang === 'sw' ? 'Wasiliana' : 'Contact'}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
