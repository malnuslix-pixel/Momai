'use client';

import React, { useState } from 'react';
import { Calculator, Copy, Check, Award, Compass } from 'lucide-react';
import Link from 'next/link';

const PERFORMANCE_LEVELS: [number, string][] = [
  [8, 'EE1 (8 pts - Exceeding 1)'],
  [7, 'EE2 (7 pts - Exceeding 2)'],
  [6, 'ME1 (6 pts - Meeting 1)'],
  [5, 'ME2 (5 pts - Meeting 2)'],
  [4, 'AE1 (4 pts - Approaching 1)'],
  [3, 'AE2 (3 pts - Approaching 2)'],
  [2, 'BE1 (2 pts - Below 1)'],
  [1, 'BE2 (1 pt - Below 2)'],
];

const LEARNING_AREAS = [
  'Mathematics',
  'English Language',
  'Kiswahili / KSL',
  'Integrated Science',
  'Social Studies',
  'Agriculture & Nutrition',
  'Pre-Technical Studies',
  'Creative Arts & Sports',
  'Religious Education (CRE / IRE / HRE)',
];

export default function KjseaCalculator() {
  const [points, setPoints] = useState<number[]>([7, 6, 6, 7, 6, 6, 7, 6, 7]);
  const [copied, setCopied] = useState(false);

  const handlePointChange = (index: number, val: number) => {
    const updated = [...points];
    updated[index] = val;
    setPoints(updated);
  };

  const totalPoints = points.reduce((acc, curr) => acc + curr, 0);
  const maxPoints = LEARNING_AREAS.length * 8; // 72
  const percentage = Math.round((totalPoints / maxPoints) * 100);

  let bandTitle = '';
  let pathwayRecommendation = '';

  if (totalPoints >= 54) {
    bandTitle = 'Exceeding Expectations (EE) Band';
    pathwayRecommendation = 'Strongly positioned for Grade 10 STEM Pathway (Pure Sciences, Computing, Engineering) or Advanced Social Sciences.';
  } else if (totalPoints >= 42) {
    bandTitle = 'Meeting Expectations (ME) Band';
    pathwayRecommendation = 'Well suited for Senior School STEM (Applied Sciences) or Social Sciences (Economics, Humanities, Business, Languages).';
  } else if (totalPoints >= 30) {
    bandTitle = 'Approaching Expectations (AE) Band';
    pathwayRecommendation = 'Recommended for Arts & Sports Science Pathway or Technical & Career-Oriented applied modules.';
  } else {
    bandTitle = 'Foundational Support Band';
    pathwayRecommendation = 'Recommended for vocational and skills-oriented Senior School transition with targeted academic reinforcement.';
  }

  const handleCopy = () => {
    const text = `KJSEA Grade 9 CBE Points Calculation:\nLearning Areas Evaluated: 9\nTotal Points: ${totalPoints} / ${maxPoints} (${percentage}%)\nPerformance Band: ${bandTitle}\nSenior School Pathway Guidance: ${pathwayRecommendation}\nCalculated at: https://mwalimufamily.com/tools`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card tool-modular-card">
      <div className="tool-header">
        <div className="tool-title-wrap">
          <span className="tool-icon-pill">
            <Calculator size={18} />
          </span>
          <div>
            <h3>Grade 10 Senior School Pathway & KJSEA Calculator</h3>
            <p>Official Competency-Based Education scale: 9 learning areas across 8 performance levels (maximum 72 points) with instant Senior School pathway recommendations.</p>
          </div>
        </div>
        <span className="tool-badge-accent">CBE Pathways</span>
      </div>

      <div className="tool-body">
        <div className="tool-grid-inputs">
          {LEARNING_AREAS.map((subject, idx) => (
            <div key={idx} className="tool-input-row">
              <label htmlFor={`kjsea-area-${idx}`}>{subject}</label>
              <select
                id={`kjsea-area-${idx}`}
                value={points[idx]}
                onChange={(e) => handlePointChange(idx, Number(e.target.value))}
              >
                {PERFORMANCE_LEVELS.map(([pt, label]) => (
                  <option key={pt} value={pt}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Calculation Result Panel */}
        <div className="tool-result-panel">
          <div className="result-metric-col">
            <span className="result-label">CBE Total Points</span>
            <div className="result-score">
              {totalPoints} <span className="result-max">/ {maxPoints}</span>
            </div>
          </div>

          <div className="result-metric-col">
            <span className="result-label">Aggregate Mastery</span>
            <div className="result-grade">{percentage}%</div>
          </div>

          <div className="result-info-col" style={{ flex: 2 }}>
            <div className="result-desc" style={{ fontWeight: 700, color: 'var(--mf-forest-deep, #143416)' }}>
              {bandTitle}
            </div>
            <p style={{ margin: '0.2rem 0 0.5rem', fontSize: '0.88rem', color: 'var(--mf-text-muted, #49564a)' }}>
              {pathwayRecommendation}
            </p>
            <div className="status-pill status-pass" style={{ alignSelf: 'flex-start' }}>
              <Compass size={14} />
              <span>Aligned with MoE Grade 10 Placement Guidelines</span>
            </div>
          </div>
        </div>

        <div className="tool-footer-actions">
          <button
            type="button"
            className="btn-action-copy"
            onClick={handleCopy}
            aria-label="Copy KJSEA CBE points summary to clipboard"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Summary Copied!' : 'Copy KJSEA Slip'}</span>
          </button>
          <Link href="/parents" className="tool-sub-link">
            Explore Grade 10 Senior School Pathways →
          </Link>
        </div>
      </div>
    </div>
  );
}
