'use client';

import React, { useState } from 'react';
import { GRADES, downloadWordDocument } from '@/lib/mwalimu-data';

interface TeachingSectionProps {
  onNavClick: (hash: string) => void;
}

export default function TeachingSection({ onNavClick }: TeachingSectionProps) {
  // Timetable Generator State
  const [classesStr, setClassesStr] = useState('Grade 7, Grade 8, Grade 9');
  const [subjectsStr, setSubjectsStr] = useState('Mathematics, English, Kiswahili, Integrated Science, Social Studies, Agriculture, Creative Arts, Pre-Technical');
  const [lessonsPerDay, setLessonsPerDay] = useState(8);
  const [generatedTimetable, setGeneratedTimetable] = useState<any[] | null>(null);

  // Quick Scheme Generator State
  const [schemeGrade, setSchemeGrade] = useState('Grade 7');
  const [schemeSubject, setSchemeSubject] = useState('Mathematics');
  const [schemeTerm, setSchemeTerm] = useState('Term 1');
  const [schemeWeeks, setSchemeWeeks] = useState(13);

  const handleGenerateTimetable = () => {
    const classes = classesStr.split(',').map(c => c.trim()).filter(Boolean);
    const subjects = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);
    if (!classes.length || !subjects.length) return;

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const result = classes.map((cls, cIdx) => {
      const rows = [];
      for (let p = 0; p < lessonsPerDay; p++) {
        const isBreak = p === 3;
        const isLunch = p === 6;
        const daySubs = days.map((_, dIdx) => {
          return subjects[(dIdx * lessonsPerDay + p + cIdx) % subjects.length];
        });
        rows.push({ period: p + 1, isBreak, isLunch, daySubs });
      }
      return { className: cls, rows };
    });

    setGeneratedTimetable(result);
  };

  const handleDownloadScheme = () => {
    downloadWordDocument(
      `${schemeGrade}_${schemeSubject}_${schemeTerm}_Scheme`,
      `Scheme of Work - ${schemeSubject}`,
      schemeGrade,
      schemeSubject,
      schemeTerm,
      'Scheme of Work'
    );
  };

  return (
    <section className="sec cine" id="teaching" aria-labelledby="th">
      <div className="gy" aria-hidden="true" />
      <div className="w">
        <h2 className="sh" id="th">Teaching materials</h2>
        <p className="sub">
          Free, original templates and tools for Kenyan teachers: schemes of work, lesson notes, exams and records. Everything downloads as an editable Word (.doc) file.
        </p>

        <div className="eg" style={{ marginTop: '2rem' }}>
          {/* Timetable Generator */}
          <div className="gl">
            <h3>Timetable generator</h3>
            <label htmlFor="tc">Classes (comma separated)</label>
            <input
              type="text"
              id="tc"
              value={classesStr}
              onChange={(e) => setClassesStr(e.target.value)}
            />

            <label htmlFor="ts">Subjects (comma separated)</label>
            <input
              type="text"
              id="ts"
              value={subjectsStr}
              onChange={(e) => setSubjectsStr(e.target.value)}
            />

            <label htmlFor="tp">Lessons per day</label>
            <select
              className="sel"
              id="tp"
              value={lessonsPerDay}
              onChange={(e) => setLessonsPerDay(Number(e.target.value))}
            >
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
            </select>

            <button className="gb" onClick={handleGenerateTimetable}>
              Generate Timetable
            </button>

            {generatedTimetable && (
              <div className="tw" style={{ marginTop: '1rem' }}>
                {generatedTimetable.map((clsItem, idx) => (
                  <div key={idx} style={{ marginBottom: '1.2rem' }}>
                    <h4 style={{ color: '#f4a261', margin: '0.6rem 0' }}>{clsItem.className}</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clsItem.rows.map((r: any, rIdx: number) => {
                          if (r.isBreak) return <tr key={rIdx}><th colSpan={6} style={{ background: 'rgba(255,255,255,0.1)' }}>Break</th></tr>;
                          if (r.isLunch) return <tr key={rIdx}><th colSpan={6} style={{ background: 'rgba(255,255,255,0.1)' }}>Lunch</th></tr>;
                          return (
                            <tr key={rIdx}>
                              <td>{r.period}</td>
                              {r.daySubs.map((sub: string, sIdx: number) => (
                                <td key={sIdx}>{sub}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheme of Work Quick Builder */}
          <div className="gl">
            <h3>Scheme of work generator</h3>
            <label htmlFor="sg">Grade</label>
            <select
              className="sel"
              id="sg"
              value={schemeGrade}
              onChange={(e) => setSchemeGrade(e.target.value)}
            >
              {GRADES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <label htmlFor="sb">Subject</label>
            <input
              type="text"
              id="sb"
              value={schemeSubject}
              onChange={(e) => setSchemeSubject(e.target.value)}
            />

            <label htmlFor="st2">Term</label>
            <select
              className="sel"
              id="st2"
              value={schemeTerm}
              onChange={(e) => setSchemeTerm(e.target.value)}
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>

            <label htmlFor="sw2">Teaching Weeks</label>
            <input
              type="number"
              id="sw2"
              min={1}
              max={15}
              value={schemeWeeks}
              onChange={(e) => setSchemeWeeks(Number(e.target.value))}
            />

            <button className="gb" onClick={handleDownloadScheme}>
              Download scheme (.doc)
            </button>
            <p style={{ fontSize: '0.88rem', opacity: 0.85, marginTop: '0.5rem' }}>
              Downloads an editable Microsoft Word document formatted with standard KICD Competency Based Curriculum (CBC) columns.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
