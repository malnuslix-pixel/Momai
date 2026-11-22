'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface OfflineQuizItem {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const OFFLINE_QUIZ: OfflineQuizItem[] = [
  {
    id: 'q1',
    subject: 'Integrated Science (Grade 8)',
    question: 'Which of the following blood vessels carries oxygenated blood from the lungs back to the left atrium of the heart?',
    options: ['Pulmonary Artery', 'Pulmonary Vein', 'Vena Cava', 'Aorta'],
    correctIndex: 1,
    explanation: 'The pulmonary vein is the only vein in the human body that carries oxygenated blood, transporting it from the lungs to the left atrium.'
  },
  {
    id: 'q2',
    subject: 'Mathematics (Junior Secondary)',
    question: 'A farmer in Eldoret bought 15 bags of fertilizer at KES 2,500 each and paid KES 1,200 for transport. If he sold all bags for KES 42,000, what was his percentage profit?',
    options: ['8.5%', '10.0%', '7.2%', '12.5%'],
    correctIndex: 0,
    explanation: 'Total cost = (15 × 2500) + 1200 = 37500 + 1200 = KES 38,700. Profit = 42,000 - 38,700 = KES 3,300. Profit % = (3300 / 38700) × 100 ≈ 8.53%.'
  },
  {
    id: 'q3',
    subject: 'Kiswahili (Fasihi & Sarufi)',
    question: 'Tambua kiwakilishi katika sentensi hii: "Hawa ndio walioshinda tuzo ya kitaifa ya uandishi."',
    options: ['walioshinda', 'Hawa', 'tuzo', 'kitaifa'],
    correctIndex: 1,
    explanation: '"Hawa" ni kiwakilishi cha kuonyesha (kionyeshi) kinachosimama badala ya nomino iliyotajwa au inayofahamika.'
  },
  {
    id: 'q4',
    subject: 'Social Studies & CBC Governance',
    question: 'Under the Constitution of Kenya 2010, which independent commission manages teacher recruitment, promotion, and disciplinary action?',
    options: ['KICD', 'KNEC', 'TSC (Teachers Service Commission)', 'Ministry of Education'],
    correctIndex: 2,
    explanation: 'The Teachers Service Commission (TSC) is mandated by Article 237 of the Constitution to register, recruit, employ, and transfer teachers in public learning institutions.'
  },
  {
    id: 'q5',
    subject: 'English (Junior Secondary)',
    question: 'Choose the correct form to complete: "Neither the class teacher nor the learners ______ aware of the changes in the rehearsal schedule."',
    options: ['was', 'were', 'is', 'has been'],
    correctIndex: 1,
    explanation: 'With "neither... nor...", the verb agrees with the closer subject ("learners" is plural, so "were" is correct).'
  }
];

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentQ = OFFLINE_QUIZ[currentIdx];

  const handleSelectOption = (index: number) => {
    if (showAnswer) return;
    setSelectedOpt(index);
    setShowAnswer(true);
    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < OFFLINE_QUIZ.length) {
      setCurrentIdx((c) => c + 1);
      setSelectedOpt(null);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowAnswer(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f5',
      color: '#1a1a1a',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: '1.5rem clamp(1rem, 4vw, 2.5rem)',
      paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
      paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))',
    }}>
      {/* Top Banner */}
      <div style={{
        maxWidth: '780px',
        margin: '0 auto 1.5rem',
        padding: '0.85rem 1.2rem',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem',
        background: isOnline ? '#e8f5e9' : '#fff3e0',
        border: `1.5px solid ${isOnline ? '#2c5f2d' : '#f4a261'}`,
        color: isOnline ? '#1b5e20' : '#b25e00',
        fontWeight: 600,
        fontSize: '0.92rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{isOnline ? '🟢' : '📴'}</span>
          <span>
            {isOnline
              ? 'You are back online! You can reload to fetch the latest school news.'
              : 'Offline Mode Active (Zero Bundles). Study materials and tools work without data!'}
          </span>
        </div>
        {isOnline && (
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#2c5f2d',
              color: '#fff',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Refresh Site
          </button>
        )}
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#1a3d1b',
          color: '#fff',
          borderRadius: '20px',
          padding: '2rem 1.6rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>📚</div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
            margin: '0 0 0.5rem',
            color: '#fff',
          }}>
            Offline Revision Station
          </h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.95rem',
            maxWidth: '560px',
            margin: '0 auto 1.2rem',
            lineHeight: 1.5,
          }}>
            No bundles required. Practice national assessment questions and access CBC/KNEC calculators anytime.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                background: '#f4a261',
                color: '#1a1a1a',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              🏡 Home &amp; Saved Materials
            </Link>
            <Link
              href="/#tools"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.16)',
                color: '#fff',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
              }}
            >
              🛠️ In-Browser Tools
            </Link>
          </div>
        </div>

        {/* Interactive Offline Quiz Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '1.8rem 1.5rem',
          border: '1px solid #e0ddd6',
          boxShadow: '0 4px 18px rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid #eee',
          }}>
            <span style={{
              background: 'rgba(44, 95, 45, 0.12)',
              color: '#2c5f2d',
              padding: '0.3rem 0.8rem',
              borderRadius: '50px',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}>
              {currentQ.subject}
            </span>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#666' }}>
              Question {currentIdx + 1} of {OFFLINE_QUIZ.length}
            </span>
          </div>

          {!completed ? (
            <>
              <h2 style={{
                fontSize: '1.15rem',
                lineHeight: 1.5,
                margin: '0 0 1.2rem',
                color: '#1a1a1a',
              }}>
                {currentQ.question}
              </h2>

              <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.4rem' }}>
                {currentQ.options.map((opt, i) => {
                  let optBg = '#faf8f5';
                  let optBorder = '1.5px solid #e0ddd6';
                  let optColor = '#1a1a1a';

                  if (showAnswer) {
                    if (i === currentQ.correctIndex) {
                      optBg = '#e8f5e9';
                      optBorder = '2px solid #2e7d32';
                      optColor = '#1b5e20';
                    } else if (i === selectedOpt) {
                      optBg = '#ffebee';
                      optBorder = '2px solid #c62828';
                      optColor = '#b71c1c';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      disabled={showAnswer}
                      style={{
                        padding: '0.85rem 1rem',
                        textAlign: 'left',
                        borderRadius: '12px',
                        border: optBorder,
                        background: optBg,
                        color: optColor,
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: showAnswer ? 'default' : 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{opt}</span>
                      {showAnswer && i === currentQ.correctIndex && <span>✓</span>}
                      {showAnswer && i === selectedOpt && i !== currentQ.correctIndex && <span>✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Drop */}
              {showAnswer && (
                <div style={{
                  background: 'rgba(244, 162, 97, 0.12)',
                  borderLeft: '4px solid #f4a261',
                  borderRadius: '0 10px 10px 0',
                  padding: '0.9rem 1.1rem',
                  marginBottom: '1.2rem',
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                }}>
                  <b>Ufafanuzi:</b> {currentQ.explanation}
                </div>
              )}

              {/* Next Button */}
              {showAnswer && (
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#2c5f2d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  {currentIdx + 1 < OFFLINE_QUIZ.length ? 'Next Question →' : 'See Final Score 🏆'}
                </button>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ fontSize: '3.5rem' }}>🎉</div>
              <h2 style={{ fontFamily: 'Georgia, serif', color: '#2c5f2d', margin: '0.5rem 0' }}>
                Offline Practice Completed!
              </h2>
              <p style={{ fontSize: '1.1rem', margin: '0.5rem 0 1.5rem', color: '#444' }}>
                Your Score: <b>{score}</b> out of <b>{OFFLINE_QUIZ.length}</b> ({Math.round((score / OFFLINE_QUIZ.length) * 100)}%)
              </p>
              <button
                onClick={handleRestart}
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '50px',
                  background: '#2c5f2d',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                🔄 Practice Again
              </button>
            </div>
          )}
        </div>

        {/* Offline In-Browser Tools Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '1.6rem 1.4rem',
          border: '1px solid #e0ddd6',
        }}>
          <h3 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '1.3rem',
            color: '#1a3d1b',
            margin: '0 0 0.8rem',
          }}>
            Zero-Data In-Browser Tools
          </h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.1rem' }}>
            These tools run 100% inside your phone or laptop browser without sending data to servers:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.8rem' }}>
            <Link
              href="/#tools"
              style={{
                display: 'block',
                padding: '0.9rem',
                borderRadius: '12px',
                background: '#faf8f5',
                border: '1px solid #e0ddd6',
                textDecoration: 'none',
                color: '#1a1a1a',
              }}
            >
              <div style={{ fontWeight: 700, color: '#2c5f2d', marginBottom: '0.2rem' }}>
                📐 CBC Pathway Calculator
              </div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>
                Check STEM, Social Sciences &amp; Arts cluster suitability
              </div>
            </Link>

            <Link
              href="/#tools"
              style={{
                display: 'block',
                padding: '0.9rem',
                borderRadius: '12px',
                background: '#faf8f5',
                border: '1px solid #e0ddd6',
                textDecoration: 'none',
                color: '#1a1a1a',
              }}
            >
              <div style={{ fontWeight: 700, color: '#2c5f2d', marginBottom: '0.2rem' }}>
                🎯 KNEC KCSE Point Converter
              </div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>
                Calculate aggregate cluster points for KUCCPS
              </div>
            </Link>

            <Link
              href="/#tools"
              style={{
                display: 'block',
                padding: '0.9rem',
                borderRadius: '12px',
                background: '#faf8f5',
                border: '1px solid #e0ddd6',
                textDecoration: 'none',
                color: '#1a1a1a',
              }}
            >
              <div style={{ fontWeight: 700, color: '#2c5f2d', marginBottom: '0.2rem' }}>
                📝 Rubric &amp; Report Generator
              </div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>
                Build classroom assessment rubrics and report comments
              </div>
            </Link>

            <Link
              href="/#tools"
              style={{
                display: 'block',
                padding: '0.9rem',
                borderRadius: '12px',
                background: '#faf8f5',
                border: '1px solid #e0ddd6',
                textDecoration: 'none',
                color: '#1a1a1a',
              }}
            >
              <div style={{ fontWeight: 700, color: '#2c5f2d', marginBottom: '0.2rem' }}>
                📅 Revision Timetable
              </div>
              <div style={{ fontSize: '0.82rem', color: '#666' }}>
                Generate daily study schedules for exam prep
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
