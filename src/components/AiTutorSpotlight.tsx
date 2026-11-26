'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowRight, Bot, BookOpen, BrainCircuit, CheckCircle2, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

const POPULAR_PROMPTS = [
  {
    topic: 'Integrated Science',
    grade: 'Grade 8',
    prompt: 'Explain the double circulation of blood in human beings with key chambers',
    icon: '🧪'
  },
  {
    topic: 'Mathematics',
    grade: 'Form 3',
    prompt: 'Solve quadratic equation 2x² + 5x - 3 = 0 step-by-step using formula',
    icon: '📐'
  },
  {
    topic: 'CBE Pathways',
    grade: 'Grade 10',
    prompt: 'Explain Grade 10 Senior School pathway selection between STEM and Social Sciences',
    icon: '🇰🇪'
  },
  {
    topic: 'English',
    grade: 'Form 4',
    prompt: 'Give revision notes on KCSE English Paper 2 excerpt and character analysis',
    icon: '📝'
  },
  {
    topic: 'Agriculture',
    grade: 'Grade 7',
    prompt: 'Outline 4 modern methods of soil and water conservation in dry areas',
    icon: '🌾'
  },
  {
    topic: 'KUCCPS Placement',
    grade: 'Form 4',
    prompt: 'How is the KUCCPS weighted cluster points formula calculated from KCSE 7 subjects?',
    icon: '🧮'
  }
];

const SUBJECTS = [
  'Mathematics', 'Integrated Science', 'English', 'Kiswahili',
  'Social Studies', 'Business Studies', 'Computer Science',
  'Agriculture', 'Home Science',
];

const GRADES = [
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Form 1', 'Form 2', 'Form 3', 'Form 4',
];

export default function AiTutorSpotlight() {
  const router = useRouter();
  const [lang] = useLanguage();
  const copy = useSectionCopy('tutorSpotlight', lang);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const params = new URLSearchParams({
      q: query.trim(),
      subject,
      grade
    });
    router.push(`/tutor?${params.toString()}`);
  };

  const handlePromptClick = (p: typeof POPULAR_PROMPTS[0]) => {
    const params = new URLSearchParams({
      q: p.prompt,
      subject: p.topic === 'CBE Pathways' || p.topic === 'KUCCPS Placement' ? 'Mathematics' : p.topic,
      grade: p.grade
    });
    router.push(`/tutor?${params.toString()}`);
  };

  return (
    <section className="sec" id="ai-tutor-spotlight" style={{ padding: '3.5rem 0 2rem' }}>
      <div className="w">
        {/* Flagship AI Tutor Banner Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(44, 95, 45, 0.45) 0%, rgba(26, 61, 27, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          borderRadius: '20px',
          padding: 'clamp(1.5rem, 4vw, 2.8rem)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle decorative glow */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 162, 97, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
            <div>
              <span className="tag" style={{ background: '#f4a261', color: '#1a1a1a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={13} /> {copy.tag}
              </span>
              <h2 className="sh" style={{ margin: '0.6rem 0 0.3rem', fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', color: '#ffffff' }}>
                {copy.title}
              </h2>
              <p className="sub" style={{ margin: 0, maxWidth: '48rem', color: '#d1dcd2', fontSize: '1rem', lineHeight: 1.6 }}>
                {copy.subtitle}
              </p>
            </div>

            <Link
              href="/tutor"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.7rem 1.3rem',
                minHeight: '44px',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Open Full Tutor Workspace <ArrowRight size={16} />
            </Link>
          </div>

          {/* Interactive Instant Ask Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
            <div style={{
              background: 'rgba(15, 36, 16, 0.85)',
              border: '2px solid rgba(244, 162, 97, 0.6)',
              borderRadius: '16px',
              padding: '0.6rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)'
            }}>
              {/* Selectors Bar */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', padding: '0.3rem 0.5rem 0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#d1dcd2', fontSize: '0.82rem', fontWeight: 600 }}>
                  <BookOpen size={14} color="#f4a261" /> Subject:
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} style={{ background: '#1a3d1b', color: '#fff' }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#d1dcd2', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Bot size={14} color="#f4a261" /> Level:
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.82rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g} style={{ background: '#1a3d1b', color: '#fff' }}>
                        {g}
                      </option>
                    ))}
                  </select>
                </label>

                <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#85e085', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Zap size={13} /> Active & Ready
                </span>
              </div>

              {/* Text Input & Submit Button */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Ask Mwalimu AI anything in ${subject} (${grade})...`}
                  aria-label="Ask Mwalimu AI a syllabus question"
                  style={{
                    flex: '1 1 280px',
                    minHeight: '46px',
                    padding: '0.7rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontSize: '0.96rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    minHeight: '46px',
                    padding: '0.7rem 1.5rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: query.trim() ? '#f4a261' : 'rgba(244, 162, 97, 0.4)',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: query.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ask Mwalimu AI <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </form>

          {/* Clickable Quick Prompts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <BrainCircuit size={16} color="#f4a261" />
              <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>
                Instant Curriculum Starters (Click to launch answer):
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.75rem'
            }}>
              {POPULAR_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePromptClick(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    textAlign: 'left',
                    padding: '0.8rem 1rem',
                    minHeight: '44px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#f4a261';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)';
                  }}
                >
                  <span style={{ fontSize: '1.25rem', lineHeight: 1 }} aria-hidden="true">{p.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ color: '#f4a261', fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {p.topic}
                      </span>
                      <span style={{ color: '#d1dcd2', fontSize: '0.74rem' }}>• {p.grade}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.4 }}>
                      {p.prompt}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3 Core Trust Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.14)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="#85e085" />
              <span style={{ color: '#d1dcd2', fontSize: '0.86rem' }}>
                <strong style={{ color: '#fff' }}>KICD CBC & KNEC Aligned</strong>: Tailored to official curricula.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="#85e085" />
              <span style={{ color: '#d1dcd2', fontSize: '0.86rem' }}>
                <strong style={{ color: '#fff' }}>Step-by-Step Working</strong>: Explains logic, not just final answers.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="#85e085" />
              <span style={{ color: '#d1dcd2', fontSize: '0.86rem' }}>
                <strong style={{ color: '#fff' }}>100% Free & Low-Data</strong>: Fast and accessible on any smartphone.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
