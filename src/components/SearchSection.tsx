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
                ? 'Tafuta maazimio, notisi, mitihani, kazi, au uliza Mwalimu AI. Jaribu "Grade 8 Sayansi" au "Kikokotoo cha KCSE"'
                : 'Search schemes, notes, exams, jobs, calculators or ask Mwalimu AI. Try “Grade 8 Science” or “KCSE calculator”'
            }
            aria-label={lang === 'sw' ? 'Tafuta kwenye wavuti' : 'Search the site'}
          />
        </form>

        {/* Shortcuts Section */}
        <div style={{ marginTop: '0.8rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.8rem',
          }}>
            <span style={{
              color: '#d1dcd2',
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              ⚡ {lang === 'sw' ? 'Njia za Mkato' : 'Quick Shortcuts'}
            </span>
            <span style={{ color: '#a0b0a2', fontSize: '0.82rem' }}>
              {lang === 'sw' ? 'Fikia huduma na zana maarufu moja kwa moja' : 'Jump straight to popular tools & services'}
            </span>
          </div>

          {/* Grid of Shortcuts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
          }}>
            {SHORTCUTS_DATA.map((item, idx) => {
              const info = lang === 'sw' ? item.sw : item.en;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    minHeight: '48px',
                    borderRadius: '12px',
                    background: item.highlight ? 'rgba(244, 162, 97, 0.16)' : 'rgba(255, 255, 255, 0.1)',
                    border: item.highlight ? '1px solid rgba(244, 162, 97, 0.45)' : '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'all 0.18s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f4a261';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = item.highlight ? 'rgba(244, 162, 97, 0.45)' : 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = item.highlight ? 'rgba(244, 162, 97, 0.16)' : 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: item.highlight ? '#ffd166' : '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.2
                    }}>
                      {info.label}
                    </div>
                    <div style={{
                      fontSize: '0.74rem',
                      color: '#d1dcd2',
                      marginTop: '0.15rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {info.badge}
                    </div>
                  </div>
                  <ArrowRight size={14} color="#d1dcd2" style={{ flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>

          {/* Popular Search Suggestions Chips */}
          <div style={{
            marginTop: '1.2rem',
            paddingTop: '0.9rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#a0b0a2', fontWeight: 600 }}>
              {lang === 'sw' ? 'Mifano ya utafutaji:' : 'Try searching:'}
            </span>
            {POPULAR_QUERIES.map((pq, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSuggestionClick(pq)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50px',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.35rem 0.75rem',
                  minHeight: '34px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f4a261';
                  e.currentTarget.style.color = '#f4a261';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
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
