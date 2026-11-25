'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Calculator,
  BookOpen,
  FileCheck,
  GraduationCap,
  Briefcase,
  Megaphone,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/lib/language';

interface SearchSectionProps {
  onNavClick?: (hash: string) => void;
}

const SHORTCUTS_DATA = [
  {
    en: { label: 'Ask Mwalimu AI', badge: 'AI Tutor' },
    sw: { label: 'Uliza Mwalimu AI', badge: 'Mwalimu wa Kidijitali' },
    href: '/tutor',
    icon: <Sparkles size={16} color="#ffd166" />,
    highlight: true,
  },
  {
    en: { label: 'Pathway & KCSE Calculators', badge: 'Grade 10 & KUCCPS' },
    sw: { label: 'Vikokotoo vya Njia na KCSE', badge: 'Gredi 10 na KUCCPS' },
    href: '/tools',
    icon: <Calculator size={16} color="#85e085" />,
  },
  {
    en: { label: 'CBC Schemes & Lesson Plans', badge: 'Curriculum Library' },
    sw: { label: 'Maazimio ya Kazi na Maandalio', badge: 'Maktaba ya Mtaala' },
    href: '/learn',
    icon: <BookOpen size={16} color="#a0c4ff" />,
  },
  {
    en: { label: 'National Exam Timelines', badge: 'KPSEA / KJSEA / KCSE' },
    sw: { label: 'Ratiba Rasmi za Mitihani', badge: 'KPSEA / KJSEA / KCSE' },
    href: '/exams',
    icon: <FileCheck size={16} color="#ffd166" />,
  },
  {
    en: { label: 'Teacher Desk & TPAD', badge: 'Classroom Tools' },
    sw: { label: 'Dawati la Mwalimu & TPAD', badge: 'Zana za Darasani' },
    href: '/teach',
    icon: <GraduationCap size={16} color="#85e085" />,
  },
  {
    en: { label: 'Teaching Jobs', badge: '0% Placement Fee' },
    sw: { label: 'Nafasi za Kazi za Ualimu', badge: 'Bila Ada ya Udalali' },
    href: '/jobs',
    icon: <Briefcase size={16} color="#ffadad" />,
  },
  {
    en: { label: 'Official MoE Notices', badge: 'Circulars & Warnings' },
    sw: { label: 'Matangazo Rasmi ya Wizara', badge: 'Nyaraka na Tahadhari' },
    href: '/notices',
    icon: <Megaphone size={16} color="#ffd166" />,
  },
  {
    en: { label: 'Parents Guidance Hub', badge: 'Senior School Pathways' },
    sw: { label: 'Kituo cha Miongozo ya Wazazi', badge: 'Mielekeo ya Senior School' },
    href: '/parents',
    icon: <Users size={16} color="#a0c4ff" />,
  },
  {
    en: { label: 'Academic Leaderboard', badge: 'Quizzes & XP' },
    sw: { label: 'Bodi ya Ushindi wa Masomo', badge: 'Maswali na Alama' },
    href: '/leaderboard',
    icon: <Award size={16} color="#ffd166" />,
  },
];

const POPULAR_QUERIES = [
  'Grade 8 Integrated Science',
  'Grade 10 Senior School Pathways',
  'KCSE 7-Subject Grading Points',
  'KUCCPS Degree Cluster Points',
  'Form 3 Mathematics Quadratic Formula',
];

export default function SearchSection({ onNavClick }: SearchSectionProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [lang] = useLanguage();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ answer: string; suggestedRoutes: { label: string; href: string }[] } | null>(null);

  const askAI = async (rawQuery: string) => {
    const q = rawQuery.trim();
    if (!q) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'search', query: q }),
      });
      const data = await res.json();
      if (data.ok && data.answer) {
        setAiResult({
          answer: data.answer,
          suggestedRoutes: Array.isArray(data.suggestedRoutes) ? data.suggestedRoutes : [],
        });
      }
    } catch {
    } finally {
      setAiLoading(false);
    }
  };

  const executeSearch = (rawQuery: string) => {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('tutor') || q.includes('ai') || q.includes('homework') || q.includes('mwalimu ai') || q.includes('uliza')) {
      router.push(`/tutor?q=${encodeURIComponent(rawQuery.trim())}`);
    } else if (q.includes('job') || q.includes('teach') || q.includes('vacan') || q.includes('kazi')) {
      router.push('/jobs');
    } else if (q.includes('tool') || q.includes('calc') || q.includes('cluster') || q.includes('kcse') || q.includes('pathway') || q.includes('kjsea') || q.includes('kikokotoo')) {
      router.push('/tools');
    } else if (q.includes('notice') || q.includes('checklist') || q.includes('countdown') || q.includes('circular') || q.includes('tangazo')) {
      router.push('/notices');
    } else if (q.includes('course') || q.includes('skill') || q.includes('kozi')) {
      router.push('/courses');
    } else if (q.includes('game') || q.includes('quiz') || q.includes('leaderboard') || q.includes('mchezo')) {
      router.push('/leaderboard');
    } else if (q.includes('exam') || q.includes('kpsea') || q.includes('marking') || q.includes('mtihani')) {
      router.push('/exams');
    } else if (q.includes('advert') || q.includes('promote') || q.includes('tangaza')) {
      router.push('/advertise');
    } else if (q.includes('parent') || q.includes('calendar') || q.includes('fee') || q.includes('mzazi')) {
      router.push('/parents');
    } else {
      router.push('/learn');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  return (
    <section className="sec" id="find" aria-labelledby="fh">
      <div className="w">
        <h2 className="sh" id="fh">
          {lang === 'sw' ? 'Tafuta unachohitaji' : 'Find what you need'}
        </h2>
        <form onSubmit={handleSearch} className="sb" style={{ marginTop: '1rem', marginBottom: '1.2rem' }}>
          <input
            id="gq"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'sw'
                ? 'Tafuta maazimio, notisi, mitihani, kazi, au uliza Mwalimu AI...'
                : 'Search schemes, notes, exams, jobs, calculators or ask Mwalimu AI...'
            }
            aria-label={lang === 'sw' ? 'Tafuta kwenye wavuti' : 'Search the site'}
          />
          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button type="submit" className="btn b1 sb-btn" style={{ flex: 1 }}>
              {lang === 'sw' ? 'Tafuta' : 'Search'}
            </button>
            <button
              type="button"
              className="btn b2 sb-btn"
              onClick={() => askAI(query)}
              disabled={aiLoading || !query.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {aiLoading ? '…' : lang === 'sw' ? 'Uliza AI' : 'Ask AI'}
            </button>
          </div>
        </form>

        {aiResult && (
          <div className="card" style={{ marginBottom: '1.2rem', borderColor: 'rgba(244, 162, 97, 0.45)', background: 'rgba(18, 44, 20, 0.92)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <span className="tag">Mwalimu AI Answer</span>
              <button
                type="button"
                onClick={() => setAiResult(null)}
                style={{ background: 'none', border: 0, color: '#d1dcd2', cursor: 'pointer', fontSize: '1.1rem' }}
                aria-label="Close AI answer"
              >
                ×
              </button>
            </div>
            <p style={{ color: '#fff', lineHeight: 1.6, marginBottom: aiResult.suggestedRoutes.length ? '0.8rem' : 0 }}>
              {aiResult.answer}
            </p>
            {aiResult.suggestedRoutes.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {aiResult.suggestedRoutes.map((r, i) => (
                  <Link key={i} href={r.href} className="gb" style={{ margin: 0, textDecoration: 'none' }}>
                    {r.label} →
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shortcuts Section */}
        <div style={{ marginTop: '0.8rem' }}>
          <div className="shortcut-head">
            <span className="shortcut-kicker">
              ⚡ {lang === 'sw' ? 'Njia za Mkato' : 'Quick Shortcuts'}
            </span>
            <span className="shortcut-sub">
              {lang === 'sw' ? 'Fikia huduma na zana maarufu moja kwa moja' : 'Jump straight to popular tools & services'}
            </span>
          </div>

          {/* Grid of Shortcuts */}
          <div className="shortcut-grid">
            {SHORTCUTS_DATA.map((item, idx) => {
              const info = lang === 'sw' ? item.sw : item.en;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`shortcut-card ${item.highlight ? 'shortcut-card-hl' : ''}`}
                >
                  <div className="shortcut-icon">
                    {item.icon}
                  </div>
                  <div className="shortcut-text">
                    <div className="shortcut-title">
                      {info.label}
                    </div>
                    <div className="shortcut-badge">
                      {info.badge}
                    </div>
                  </div>
                  <ArrowRight size={14} className="shortcut-arrow" />
                </Link>
              );
            })}
          </div>

          {/* Popular Search Suggestions Chips */}
          <div className="popular-queries">
            <span className="pq-label">
              {lang === 'sw' ? 'Mifano ya utafutaji:' : 'Try searching:'}
            </span>
            {POPULAR_QUERIES.map((pq, pIdx) => (
              <button
                key={pIdx}
                type="button"
                className="pq-chip"
                onClick={() => handleSuggestionClick(pq)}
              >
                {pq}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
