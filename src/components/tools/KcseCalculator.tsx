'use client';

import React, { useState } from 'react';
import { Calculator, Copy, Check, GraduationCap, Award } from 'lucide-react';

const GRADE_POINTS: [number, string][] = [
  [12, 'A (12 pts)'],
  [11, 'A- (11 pts)'],
  [10, 'B+ (10 pts)'],
  [9, 'B (9 pts)'],
  [8, 'B- (8 pts)'],
  [7, 'C+ (7 pts)'],
  [6, 'C (6 pts)'],
  [5, 'C- (5 pts)'],
  [4, 'D+ (4 pts)'],
  [3, 'D (3 pts)'],
  [2, 'D- (2 pts)'],
  [1, 'E (1 pt)'],
];

const BANDS: [number, string, string][] = [
  [81, 'A', 'Plain - Direct University Honours Entry'],
  [74, 'A-', 'Minus - Direct University Honours Entry'],
  [67, 'B+', 'Plus - Direct Degree Placement'],
  [60, 'B', 'Plain - Direct Degree Placement'],
  [53, 'B-', 'Minus - Direct Degree Placement'],
  [46, 'C+', 'Plus - Minimum KUCCPS Degree Benchmark'],
  [39, 'C', 'Plain - Diploma / TVET Placement'],
  [32, 'C-', 'Minus - Diploma / TVET Placement'],
  [25, 'D+', 'Plus - Certificate Placement'],
  [18, 'D', 'Plain - Certificate Placement'],
  [11, 'D-', 'Minus - Artisan Placement'],
  [1, 'E', 'Artisan / Vocational Placement'],
];

const SUBJECT_NAMES = [
  '1. English (Compulsory)',
  '2. Kiswahili (Compulsory)',
  '3. Mathematics (Compulsory)',
  '4. Science 1 (Biology / Chemistry / Physics)',
  '5. Science 2 / Group 3 Subject',
  '6. Humanity (History / Geo / CRE)',
  '7. Best Technical / Applied Subject',
];

export default function KcseCalculator() {
  const [grades, setGrades] = useState<number[]>([11, 10, 10, 9, 8, 8, 7]);
  const [copied, setCopied] = useState(false);

  const handleGradeChange = (index: number, val: number) => {
    const updated = [...grades];
    updated[index] = val;
    setGrades(updated);
  };

  const totalPoints = grades.reduce((acc, curr) => acc + curr, 0);

  let meanGrade = 'E';
  let meanDescriptor = 'Artisan / Vocational Placement';
  for (const [minPt, grade, desc] of BANDS) {
    if (totalPoints >= minPt) {
      meanGrade = grade;
      meanDescriptor = desc;
      break;
    }
  }

  const qualifiesUniversity = totalPoints >= 46; // C+ and above

  const handleCopySummary = () => {
    const text = `Mwalimu Family KCSE Calculation:\nBest 7 Subjects Total: ${totalPoints}/84 Points\nMean Grade: ${meanGrade} (${meanDescriptor})\nUniversity Direct Benchmark: ${qualifiesUniversity ? 'Qualified (C+ or higher)' : 'Eligible for TVET/Diploma'}\nCalculated at: https://mwalimufamily.com/tools`;
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
            <h3>KCSE 7-Subject Mean Grade Calculator</h3>
            <p>Official KNEC formula: 7 best subjects (maximum 84 aggregate points).</p>
          </div>
        </div>
        <span className="tool-badge-accent">KNEC Formula</span>
      </div>

      <div className="tool-body">
        <div className="tool-grid-inputs">
          {grades.map((gradeVal, idx) => (
            <div key={idx} className="tool-input-row">
              <label htmlFor={`kcse-sub-${idx}`}>{SUBJECT_NAMES[idx] || `Subject ${idx + 1}`}</label>
              <select
                id={`kcse-sub-${idx}`}
                value={gradeVal}
                onChange={(e) => handleGradeChange(idx, Number(e.target.value))}
              >
                {GRADE_POINTS.map(([pt, label]) => (
                  <option key={pt} value={pt}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Live Calculation Result Banner */}
        <div className="tool-result-panel">
          <div className="result-metric-col">
            <span className="result-label">Aggregate Total</span>
            <div className="result-score">
              {totalPoints} <span className="result-max">/ 84</span>
            </div>
          </div>

          <div className="result-metric-col">
            <span className="result-label">Estimated Mean Grade</span>
            <div className="result-grade">{meanGrade}</div>
          </div>

          <div className="result-info-col">
            <div className="result-desc">{meanDescriptor}</div>
            <div className={`status-pill ${qualifiesUniversity ? 'status-pass' : 'status-tvet'}`}>
              <GraduationCap size={14} />
              <span>{qualifiesUniversity ? 'Meets KUCCPS C+ Degree Cutoff' : 'TVET & Diploma Eligible'}</span>
            </div>
          </div>
        </div>

        <div className="tool-footer-actions">
          <button
            type="button"
            className="btn-action-copy"
            onClick={handleCopySummary}
            aria-label="Copy result summary to clipboard"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
            <span>{copied ? 'Summary Copied!' : 'Copy Result Summary'}</span>
          </button>
          <span className="tool-fine-note">Official scores are issued exclusively by KNEC through official portals.</span>
        </div>
      </div>
    </div>
  );
}
