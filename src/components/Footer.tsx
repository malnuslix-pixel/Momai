'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onNavClick: (hash: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  return (
    <footer>
      <div className="w">
        <div className="top">
          <p>Follow @mwalimufamily on all social platforms</p>
          <div className="icons">
            <a className="ico" href="https://facebook.com/mwalimufamily" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="#1877F2"/><path d="M24.2 35V24.4h3.5l.6-4.2h-4.1v-2.6c0-1.2.4-2 2.1-2h2.2v-3.7c-.4-.1-1.700-.2-3.200-.2-3.200 0-5.300 1.900-5.300 5.400v3.100h-3.600v4.200h3.600V35z" fill="#fff"/></svg>
            </a>
            <a className="ico" href="https://instagram.com/mwalimufamily" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="#D62976"/><rect x="12.5" y="12.5" width="19" height="19" rx="5.5" fill="none" stroke="#fff" strokeWidth="2.2"/><circle cx="22" cy="22" r="4.5" fill="none" stroke="#fff" strokeWidth="2.2"/><circle cx="27.8" cy="16.2" r="1.4" fill="#fff"/></svg>
            </a>
            <a className="ico" href="https://x.com/mwalimufamily" target="_blank" rel="noopener" aria-label="X">
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="21" fill="#000" stroke="#fff" strokeWidth="2"/><path d="M14 13.5l16 17M30 13.5L14 30.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </a>
            <a className="ico" href="https://youtube.com/@mwalimufamily" target="_blank" rel="noopener" aria-label="YouTube">
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="#FF0000"/><path d="M19 17.5l8 5-8 5z" fill="#fff"/></svg>
            </a>
            <a className="ico" href="https://wa.me/254715363944" target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="22" fill="#25D366"/><path d="M22 11a11 11 0 0 0-9.4 16.7L11 33l5.5-1.5A11 11 0 1 0 22 11z" fill="none" stroke="#fff" strokeWidth="2.2"/><path d="M18.3 17.5c.5 3.8 4 7.2 8 8.4l1.6-1.7-2.6-1.5-1.2.9c-1.3-.5-2.7-1.9-3.2-3.2l.9-1.2-1.5-2.6z" fill="#fff"/></svg>
            </a>
          </div>
        </div>

        <div className="fc">
          <div>
            <h4>Mwalimu Family</h4>
            <p>News and learning resources for Kenyan families and teachers.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#news" onClick={(e) => { e.preventDefault(); onNavClick('#news'); }}>News</a>
            <a href="#library" onClick={(e) => { e.preventDefault(); onNavClick('#library'); }}>Library</a>
            <a href="#teaching" onClick={(e) => { e.preventDefault(); onNavClick('#teaching'); }}>Teaching</a>
            <a href="#tools" onClick={(e) => { e.preventDefault(); onNavClick('#tools'); }}>Tools</a>
            <a href="#jobs" onClick={(e) => { e.preventDefault(); onNavClick('#jobs'); }}>Jobs</a>
          </div>
          <div>
            <h4>Learn</h4>
            <a href="#exams" onClick={(e) => { e.preventDefault(); onNavClick('#exams'); }}>Exams hub</a>
            <a href="#games" onClick={(e) => { e.preventDefault(); onNavClick('#games'); }}>Games & quizzes</a>
            <a href="#courses" onClick={(e) => { e.preventDefault(); onNavClick('#courses'); }}>Courses</a>
            <a href="#notices" onClick={(e) => { e.preventDefault(); onNavClick('#notices'); }}>Notice board</a>
            <Link href="/tutor">🤖 AI Tutor</Link>
            <Link href="/leaderboard">🏆 Leaderboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#about" onClick={(e) => { e.preventDefault(); onNavClick('#about'); }}>About</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onNavClick('#contact'); }}>Contact</a>
            <Link href="/pricing">💳 Pricing</Link>
            <Link href="/control-room">Control Room</Link>
          </div>
        </div>

        <div className="bot">
          <p>© 2026 Mwalimu Family. Proudly serving Kenya’s 47 counties.</p>
          <p>
            <Link href="/control-room">Control Room</Link> &nbsp;·&nbsp;
            <Link href="/privacy">Privacy Notice</Link> &nbsp;·&nbsp;
            <a href="https://wa.me/254715363944" target="_blank" rel="noopener">WhatsApp Support</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
