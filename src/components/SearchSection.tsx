'use client';

import React, { useState } from 'react';

interface SearchSectionProps {
  onNavClick: (hash: string) => void;
}

export default function SearchSection({ onNavClick }: SearchSectionProps) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    if (q.includes('job') || q.includes('teach') || q.includes('vacan')) {
      onNavClick('#jobs');
    } else if (q.includes('tool') || q.includes('calc') || q.includes('cluster') || q.includes('kcse')) {
      onNavClick('#tools');
    } else if (q.includes('notice') || q.includes('checklist') || q.includes('countdown')) {
      onNavClick('#notices');
    } else if (q.includes('course') || q.includes('skill') || q.includes('game') || q.includes('quiz')) {
      onNavClick('#courses');
    } else if (q.includes('exam') || q.includes('kpsea') || q.includes('kjsea')) {
      onNavClick('#exams');
    } else if (q.includes('tutor') || q.includes('math')) {
      onNavClick('#tutoring');
    } else if (q.includes('advert') || q.includes('promote')) {
      onNavClick('#advertise');
    } else if (q.includes('parent') || q.includes('calendar')) {
      onNavClick('#parents');
    } else {
      onNavClick('#library');
    }
  };

  return (
    <section className="sec" id="find" aria-labelledby="fh" style={{ padding: '3.5rem 0 2.5rem' }}>
      <div className="w">
        <h2 className="sh" id="fh" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
          Find what you need
        </h2>
        <form onSubmit={handleSearch} className="sb" style={{ marginTop: '1rem' }}>
          <input
            id="gq"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search schemes, notes, exams, jobs and news. Try “Grade 7 Mathematics” or “KCSE calculator”"
            aria-label="Search the site"
          />
        </form>
      </div>
    </section>
  );
}
