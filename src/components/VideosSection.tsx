'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

const VIDEOS = [
  {
    title: 'CBC Grade 7–9 Maths Mini Lessons',
    desc: 'Step-by-step worked examples covering integers, algebra, geometry, and Kenyan word problems.',
    tag: 'Curriculum',
    grade: 'Grades 7–9',
    duration: '10–15 min lessons',
    query: 'CBC Grade 7 8 9 Mathematics Kenya',
  },
  {
    title: 'Integrated Science Practical Guides',
    desc: 'Clear demonstrations of laboratory apparatus, separation techniques, and human circulatory diagrams.',
    tag: 'Curriculum',
    grade: 'Junior School',
    duration: '8–12 min lessons',
    query: 'CBC Integrated Science practical Kenya',
  },
  {
    title: 'KCSE & KJSEA Exam Strategy',
    desc: 'How to manage exam time, spot common marking-scheme traps, and structure high-scoring answers.',
    tag: 'Exam Prep',
    grade: 'Grade 9 & Form 4',
    duration: '12 min briefings',
    query: 'KCSE KJSEA revision strategy Kenya',
  },
  {
    title: 'Grade 10 Senior School Pathways',
    desc: 'Plain-language walkthrough of STEM, Social Sciences, and Arts & Sports subject selection for families.',
    tag: 'Exam Prep',
    grade: 'Parents & Grade 9',
    duration: '15 min guide',
    query: 'Kenya Senior School Grade 10 pathways',
  },
  {
    title: 'Family Study Routines & Vlogs',
    desc: 'Healthy evening homework habits, screen balance, and candid conversations with Kenyan parents and educators.',
    tag: 'Family Life',
    grade: 'All Families',
    duration: 'Family series',
    query: 'Mwalimu Family education Kenya',
  },
  {
    title: 'School Celebrations & Milestones',
    desc: 'Prize-giving days, science congress fairs, music festivals, and learner achievement spotlights across Kenya.',
    tag: 'Family Life',
    grade: 'Community',
    duration: 'Highlights',
    query: 'Kenya school prize giving music festival',
  },
];

export default function VideosSection() {
  const [lang] = useLanguage();
  const copy = useSectionCopy('videos', lang);
  const [category, setCategory] = useState<'All' | 'Curriculum' | 'Exam Prep' | 'Family Life'>('All');

  const filtered = VIDEOS.filter((v) => category === 'All' || v.tag === category);

  return (
    <section className="sec alt" id="videos" aria-labelledby="vh" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="w">
        <div style={{ marginBottom: '1.1rem' }}>
          <span className="tag" style={{ marginBottom: '0.6rem', display: 'inline-block' }}>
            {lang === 'sw' ? 'Darasa la YouTube' : 'YouTube Classroom'}
          </span>
          <h2 className="sh" id="vh" style={{ margin: '0 0 0.4rem' }}>
            {copy.title}
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            {copy.subtitle}
          </p>
        </div>

        <div className="chips" style={{ marginBottom: '1rem' }}>
          {(['All', 'Curriculum', 'Exam Prep', 'Family Life'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`chip ${category === cat ? 'on' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="vs" tabIndex={0} aria-label="Video lessons" style={{ marginTop: '0.5rem' }}>
        {filtered.map((v, idx) => (
          <a
            key={idx}
            href={`https://www.youtube.com/@mwalimufamily/search?query=${encodeURIComponent(v.query)}`}
            target="_blank"
            rel="noopener"
            className="v"
            style={{ textDecoration: 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span className="play" aria-hidden="true">▶</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffd166', background: 'rgba(0,0,0,0.35)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                {v.duration}
              </span>
            </div>
            <div>
              <span className="tag" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem', display: 'inline-block' }}>
                {v.tag} · {v.grade}
              </span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Subscribe CTA Placed Below Video Cards */}
      <div className="w" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <a
          className="btn b1"
          href="https://youtube.com/@mwalimufamily"
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 2.2rem',
            fontSize: '1.05rem',
            textDecoration: 'none',
            background: '#cc0000',
            color: '#ffffff',
            borderRadius: '999px',
            boxShadow: '0 4px 18px rgba(204, 0, 0, 0.28)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Subscribe on YouTube (@mwalimufamily) →
        </a>
      </div>
    </section>
  );
}
