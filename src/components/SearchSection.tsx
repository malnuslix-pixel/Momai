'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchSectionProps {
  onNavClick?: (hash: string) => void;
}

export default function SearchSection({ onNavClick }: SearchSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    if (q.includes('job') || q.includes('teach') || q.includes('vacan')) {
      router.push('/jobs');
    } else if (q.includes('tool') || q.includes('calc') || q.includes('cluster') || q.includes('kcse')) {
      router.push('/tools');
    } else if (q.includes('notice') || q.includes('checklist') || q.includes('countdown')) {
      router.push('/notices');
    } else if (q.includes('course') || q.includes('skill')) {
      router.push('/courses');
    } else if (q.includes('game') || q.includes('quiz')) {
      router.push('/games');
    } else if (q.includes('exam') || q.includes('kpsea') || q.includes('kjsea')) {
      router.push('/exams');
    } else if (q.includes('tutor') || q.includes('math')) {
      router.push('/tutoring');
    } else if (q.includes('advert') || q.includes('promote')) {
      router.push('/advertise');
    } else if (q.includes('parent') || q.includes('calendar')) {
      router.push('/parents');
    } else {
      router.push('/learn');
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
