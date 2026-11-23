'use client';

import React, { useState, useEffect } from 'react';

export default function ToolsSection() {
  // KCSE Mean Grade Calculator
  const [kcseGrades, setKcseGrades] = useState<number[]>([12, 11, 10, 9, 8, 7, 7]);
  const [kcseResult, setKcseResult] = useState<string | null>(null);

  const calculateKcse = () => {
    const total = kcseGrades.reduce((a, b) => a + b, 0);
    const bands: [number, string][] = [
      [81, 'A'], [74, 'A-'], [67, 'B+'], [60, 'B'], [53, 'B-'],
      [46, 'C+'], [39, 'C'], [32, 'C-'], [25, 'D+'], [18, 'D'], [11, 'D-'], [1, 'E']
    ];
    let mean = 'E';
    for (const [minPt, g] of bands) {
      if (total >= minPt) {
        mean = g;
        break;
      }
    }
    setKcseResult(`Total Points: ${total}/84 · Estimated Mean Grade: ${mean}`);
  };

  // KUCCPS Cluster Points
  const [cluster4, setCluster4] = useState(36);
  const [total7, setTotal7] = useState(60);
  const [clusterResult, setClusterResult] = useState<string | null>(null);

  const calculateCluster = () => {
    if (cluster4 >= 4 && cluster4 <= 48 && total7 >= 7 && total7 <= 84) {
      const points = Math.sqrt((cluster4 / 48) * (total7 / 84)) * 48;
      setClusterResult(`Estimated Cluster Weight: ${points.toFixed(3)} / 48.000`);
    } else {
      setClusterResult('Please check your inputs (4 cluster: 4-48, 7 total: 7-84)');
    }
  };

  // Report Form Comments
  const [learnerName, setLearnerName] = useState('Amina');
  const [learnerStrength, setLearnerStrength] = useState('problem solving and mathematics');
  const [learnerLevel, setLearnerLevel] = useState('Meets expectation');
  const [generatedComment, setGeneratedComment] = useState('');

  const generateComment = () => {
    const templates: Record<string, string> = {
      'Exceeds expectation': `${learnerName} has had an exceptional term, demonstrating profound mastery in ${learnerStrength}. Encourage ${learnerName} to take on higher-order enrichment tasks.`,
      'Meets expectation': `${learnerName} has worked diligently and consistently throughout the term, displaying commendable competence in ${learnerStrength}. Keep up the steady practice.`,
      'Approaches expectation': `${learnerName} shows genuine interest and steady progress in ${learnerStrength}. With focused daily revision and support, ${learnerName} will attain the expected standard.`,
      'Below expectation': `${learnerName} requires additional guided practice to achieve expected outcomes this term. We encourage focused consultation with the family.`
    };
    setGeneratedComment(templates[learnerLevel] || '');
  };

  // Pomodoro Focus Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Flashcards
  const FLASHCARD_DECKS = {
    m: [
      { q: 'Area of a Triangle', a: '1/2 × base × height' },
      { q: 'Circumference of a Circle', a: '2 × π × radius (2πr)' },
      { q: 'Pythagorean Theorem', a: 'a² + b² = c²' },
      { q: 'Sum of angles in a triangle', a: '180°' },
      { q: 'Speed formula', a: 'Distance ÷ Time' }
    ],
    s: [
      { q: 'Photosynthesis Gas Intake', a: 'Carbon Dioxide (CO₂)' },
      { q: 'Chemical Formula of Water', a: 'H₂O' },
      { q: 'Primary Blood Pumping Organ', a: 'The Heart' },
      { q: 'SI Unit of Force', a: 'Newton (N)' },
      { q: 'Boiling Point of Pure Water', a: '100 °C at sea level' }
    ],
    k: [
      { q: 'Mwalimu in English', a: 'Teacher' },
      { q: 'Wingi wa "Kitabu"', a: 'Vitabu' },
      { q: 'Kinyume cha "Refu"', a: 'Fupi' },
      { q: 'Shule in English', a: 'School' }
    ]
  };

  const [deck, setDeck] = useState<'m' | 's' | 'k'>('m');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeCards = FLASHCARD_DECKS[deck];
  const activeCard = activeCards[cardIdx % activeCards.length];

  return (
    <section className="sec" id="tools" aria-labelledby="oh">
      <div className="w">
        <h2 className="sh" id="oh">Tools that save time</h2>
        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>How these tools work</h3>
          <ul className="kf">
            <li>Everything runs 100% in your browser. Personal data, names and marks are never uploaded.</li>
            <li>Calculators are for planning and guidance. Confirm official results with KNEC or KUCCPS.</li>
          </ul>
        </div>

        <div className="cg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
          {/* KCSE Calculator */}
          <div className="card">
            <h3>KCSE mean grade calculator</h3>
            <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '0.6rem' }}>Select your 7 subjects points:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.35rem', marginBottom: '0.8rem' }}>
              {kcseGrades.map((val, idx) => (
                <select
                  key={idx}
                  className="sel"
                  value={val}
                  onChange={(e) => {
                    const next = [...kcseGrades];
                    next[idx] = Number(e.target.value);
                    setKcseGrades(next);
                  }}
                  style={{ minHeight: '38px', fontSize: '0.85rem' }}
                >
                  <option value={12}>Sub {idx + 1}: A (12)</option>
                  <option value={11}>Sub {idx + 1}: A- (11)</option>
                  <option value={10}>Sub {idx + 1}: B+ (10)</option>
                  <option value={9}>Sub {idx + 1}: B (9)</option>
                  <option value={8}>Sub {idx + 1}: B- (8)</option>
                  <option value={7}>Sub {idx + 1}: C+ (7)</option>
                  <option value={6}>Sub {idx + 1}: C (6)</option>
                  <option value={5}>Sub {idx + 1}: C- (5)</option>
                  <option value={4}>Sub {idx + 1}: D+ (4)</option>
                  <option value={3}>Sub {idx + 1}: D (3)</option>
                  <option value={2}>Sub {idx + 1}: D- (2)</option>
                  <option value={1}>Sub {idx + 1}: E (1)</option>
                </select>
              ))}
            </div>
            <button className="gb" onClick={calculateKcse}>Calculate</button>
            {kcseResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{kcseResult}</p>}
          </div>

          {/* KUCCPS Cluster Calculator */}
          <div className="card">
            <h3>KUCCPS cluster points</h3>
            <label>Points in 4 cluster subjects (4 to 48):</label>
            <input
              className="sel"
              type="number"
              min={4}
              max={48}
              value={cluster4}
              onChange={(e) => setCluster4(Number(e.target.value))}
            />
            <label>Total points in 7 subjects (max 84):</label>
            <input
              className="sel"
              type="number"
              min={7}
              max={84}
              value={total7}
              onChange={(e) => setTotal7(Number(e.target.value))}
            />
            <button className="gb" onClick={calculateCluster}>Calculate Weight</button>
            {clusterResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{clusterResult}</p>}
          </div>

          {/* Report Comments */}
          <div className="card">
            <h3>Report-form comments</h3>
            <label>Learner name:</label>
            <input
              className="sel"
              type="text"
              value={learnerName}
              onChange={(e) => setLearnerName(e.target.value)}
            />
            <label>Strength / competency:</label>
            <input
              className="sel"
              type="text"
              value={learnerStrength}
              onChange={(e) => setLearnerStrength(e.target.value)}
            />
            <label>Performance level:</label>
            <select
              className="sel"
              value={learnerLevel}
              onChange={(e) => setLearnerLevel(e.target.value)}
            >
              <option>Exceeds expectation</option>
              <option>Meets expectation</option>
              <option>Approaches expectation</option>
              <option>Below expectation</option>
            </select>
            <button className="gb" onClick={generateComment}>Generate Comment</button>
            {generatedComment && (
              <div style={{ marginTop: '0.7rem', padding: '0.7rem', background: '#f5fbf5', borderRadius: '10px', border: '1px solid #c2e0c3' }}>
                <p style={{ fontStyle: 'italic', margin: 0, fontSize: '0.92rem' }}>"{generatedComment}"</p>
              </div>
            )}
          </div>

          {/* Pomodoro Focus Timer */}
          <div className="card">
            <h3>Revision focus timer</h3>
            <p style={{ font: "800 2.2rem 'Fraunces', serif", color: '#2c5f2d', margin: '0.6rem 0' }}>
              {formatTimer(timerSeconds)}
            </p>
            <div>
              <button
                className="gb"
                onClick={() => setTimerRunning(!timerRunning)}
              >
                {timerRunning ? 'Pause' : 'Start Focus'}
              </button>
              <button
                className="gb o"
                onClick={() => { setTimerRunning(false); setTimerSeconds(25 * 60); }}
                style={{ borderColor: '#2c5f2d', color: '#2c5f2d' }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Flashcards */}
          <div className="card">
            <h3>Quick flashcards</h3>
            <select
              className="sel"
              value={deck}
              onChange={(e) => { setDeck(e.target.value as any); setCardIdx(0); setFlipped(false); }}
            >
              <option value="m">Mathematics formulas</option>
              <option value="s">Integrated Science terms</option>
              <option value="k">Kiswahili words</option>
            </select>

            <div
              id="fcc"
              onClick={() => setFlipped(!flipped)}
              style={{
                minHeight: '110px',
                background: flipped ? '#fdf8ef' : '#fff',
                borderColor: flipped ? '#f4a261' : '#4a8c4b'
              }}
            >
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                {flipped ? activeCard.a : activeCard.q}
              </p>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.2rem 0 0.5rem' }}>
              Tap card to flip ({cardIdx % activeCards.length + 1}/{activeCards.length})
            </p>
            <button
              className="gb o"
              onClick={() => { setCardIdx(prev => prev + 1); setFlipped(false); }}
              style={{ borderColor: '#2c5f2d', color: '#2c5f2d' }}
            >
              Next card →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
