'use client';

import React, { useState } from 'react';

const QUIZZES = {
  m: [
    { q: 'What is 7 × 8?', opts: ['54', '56', '64'], ans: 1 },
    { q: 'Convert 3/4 to a decimal', opts: ['0.75', '0.34', '0.7'], ans: 0 },
    { q: 'Perimeter of a square with side 5 cm?', opts: ['10 cm', '20 cm', '25 cm'], ans: 1 },
    { q: 'What is 15% of 200?', opts: ['20', '30', '15'], ans: 1 },
    { q: 'Solve: 2x + 6 = 14. x = ?', opts: ['4', '8', '10'], ans: 0 }
  ],
  s: [
    { q: 'Which gas do green plants absorb for photosynthesis?', opts: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], ans: 1 },
    { q: 'What is the chemical formula of water?', opts: ['H₂O', 'CO₂', 'NaCl'], ans: 0 },
    { q: 'Which organ pumps blood throughout the body?', opts: ['Lungs', 'Liver', 'Heart'], ans: 2 },
    { q: 'Boiling point of water at sea level?', opts: ['90 °C', '100 °C', '120 °C'], ans: 1 }
  ],
  k: [
    { q: 'What is the English meaning of "Mwalimu"?', opts: ['Doctor', 'Teacher', 'Farmer'], ans: 1 },
    { q: 'Wingi wa neno "Kitabu"?', opts: ['Vitabu', 'Kitabus', 'Mitabu'], ans: 0 },
    { q: 'Kinyume cha neno "Kubwa"?', opts: ['Refu', 'Ndogo', 'Pana'], ans: 1 },
    { q: 'What is the English meaning of "Maji"?', opts: ['Fire', 'Water', 'Wind'], ans: 1 }
  ]
};

export default function CoursesAndGames() {
  const [subject, setSubject] = useState<'m' | 's' | 'k'>('m');
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const activeQuestions = QUIZZES[subject];
  const q = activeQuestions[qIdx % activeQuestions.length];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const correct = idx === q.ans;
    if (correct) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setSelectedOpt(null);
      setQIdx(prev => (prev + 1) % activeQuestions.length);
    }, 1100);
  };

  return (
    <>
      {/* Courses Section */}
      <section className="sec alt" id="courses" aria-labelledby="crh">
        <div className="w">
          <h2 className="sh" id="crh">Courses and skills</h2>
          <p className="sub">
            Free, self-paced skill guides for learners, parents and teachers. Build practical knowledge in digital literacy, study habits, and money management.
          </p>

          <div className="ex3">
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.4rem', border: '1px solid #e0ddd6' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>📱</div>
              <h3>Digital Literacy & Typing</h3>
              <p>Keyboard shortcuts, internet safety, and using Google Docs for school assignments.</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.4rem', border: '1px solid #e0ddd6' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>💰</div>
              <h3>Financial Literacy for Youth</h3>
              <p>Budgeting pocket money, understanding savings, and safe mobile money habits.</p>
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.4rem', border: '1px solid #e0ddd6' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🧠</div>
              <h3>Study Habits & Memory Skills</h3>
              <p>Mind mapping, active recall, and spaced repetition methods for exam excellence.</p>
            </div>
          </div>

          <div className="warn" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: 'var(--hd)' }}>Suggest a new course</h3>
            <p style={{ color: 'var(--tx)' }}>
              Tell us which course topic you or your school needs on WhatsApp:{' '}
              <a
                className="dl"
                href="https://wa.me/254715363944?text=I%20would%20like%20a%20course%20on..."
                target="_blank"
                rel="noopener"
              >
                Suggest on WhatsApp →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Quizzes Section */}
      <section className="sec" id="games" aria-labelledby="gmh">
        <div className="w">
          <h2 className="sh" id="gmh">Games and quizzes</h2>
          <p className="sub">Subject quizzes and learning games with saved scores and streak counters.</p>

          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <select
                className="sel"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value as any);
                  setQIdx(0);
                  setScore(0);
                  setStreak(0);
                  setSelectedOpt(null);
                }}
                style={{ width: 'auto', minWidth: '180px' }}
              >
                <option value="m">🔢 Mathematics</option>
                <option value="s">🔬 Integrated Science</option>
                <option value="k">🗣️ Kiswahili</option>
              </select>

              <div style={{ fontWeight: 700, color: '#2c5f2d', fontSize: '0.95rem' }}>
                Score: {score} · Streak: {streak} 🔥
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.4rem' }}>
              Question {qIdx + 1} of {activeQuestions.length}:
            </p>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>{q.q}</h3>

            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {q.opts.map((opt, idx) => {
                let btnClass = 'qo';
                if (selectedOpt !== null) {
                  if (idx === q.ans) btnClass += ' ok';
                  else if (selectedOpt === idx) btnClass += ' no';
                }
                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOpt !== null}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
