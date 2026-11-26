'use client';

import React, { useState } from 'react';
import {
  downloadTemplateByType,
  downloadCustomDoc,
  downloadWordDocument,
  downloadTimetableDoc
} from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useCms, useSectionCopy } from '@/lib/cms-context';

interface TeachingSectionProps {
  onNavClick: (hash: string) => void;
}

export default function TeachingSection({ onNavClick }: TeachingSectionProps) {
  const [lang] = useLanguage();
  const { cms } = useCms();
  const copy = useSectionCopy('teaching', lang);
  const grades = cms.learning.grades;
  const templates = cms.teaching;
  // Category filter
  const [filterType, setFilterType] = useState<string>('All');

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
  const [schemeStrand, setSchemeStrand] = useState('Algebraic Expressions & Linear Equations');
  const [aiSchemeOutput, setAiSchemeOutput] = useState<string | null>(null);
  const [aiSchemeLoading, setAiSchemeLoading] = useState(false);

  const handleGenerateAIScheme = async () => {
    setAiSchemeLoading(true);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'scheme',
          grade: schemeGrade,
          subject: schemeSubject,
          term: schemeTerm,
          strand: schemeStrand,
        }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setAiSchemeOutput(data.text);
      }
    } catch {
    } finally {
      setAiSchemeLoading(false);
    }
  };

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

  const filteredTemplates = templates.filter(t => {
    if (filterType === 'All') return true;
    return t.category === filterType;
  });

  return (
    <section className="sec cine" id="teaching" aria-labelledby="th">
      <div className="gy" aria-hidden="true" />
      <div className="w">
        <h2 className="sh" id="th">{copy.title}</h2>
        <p className="sub">{copy.subtitle}</p>

        {/* Filter Chips */}
        <div className="chips" style={{ marginBottom: '1.5rem' }}>
          {['All', 'Schemes', 'Lesson notes', 'Exams', 'Records'].map(cat => (
            <button
              key={cat}
              className={`chip ${filterType === cat ? 'on' : ''}`}
              onClick={() => setFilterType(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Downloadable Templates Grid */}
        <div className="cg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
          {filteredTemplates.map((item, idx) => (
            <div key={idx} className="gl" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="tag">{item.category}</span>
                <h3 style={{ marginTop: '0.6rem', fontSize: '1.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.88rem', opacity: 0.85 }}>{item.targetGrades} · Editable Word (.doc)</p>
              </div>
              <button
                className="gb"
                onClick={() =>
                  item.customBody
                    ? downloadCustomDoc(item.filename, item.title, `${item.category} · ${item.targetGrades}`, item.customBody)
                    : downloadTemplateByType(item.typeId, item.filename)
                }
                style={{ marginTop: '1rem', width: 'fit-content' }}
              >
                Download Free (.doc)
              </button>
            </div>
          ))}
        </div>

        {/* Generator Cards */}
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

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button className="gb" onClick={handleGenerateTimetable}>
                Generate Timetable
              </button>
              {generatedTimetable && (
                <button className="gb o" onClick={() => downloadTimetableDoc(generatedTimetable)}>
                  Download Word (.doc)
                </button>
              )}
            </div>

            {generatedTimetable && (
              <div className="tw" style={{ marginTop: '1rem', maxHeight: '280px', overflowY: 'auto' }}>
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
              {grades.map(g => (
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

            <label htmlFor="sw2">Weeks</label>
            <input
              type="number"
              id="sw2"
              min={1}
              max={15}
              value={schemeWeeks}
              onChange={(e) => setSchemeWeeks(Number(e.target.value))}
            />

            <label htmlFor="sstrand">Strand / Topic (for AI Outline)</label>
            <input
              type="text"
              id="sstrand"
              value={schemeStrand}
              onChange={(e) => setSchemeStrand(e.target.value)}
              placeholder="e.g. Fractions, Cell Structure, Persuasive Writing"
            />

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
              <button className="gb" onClick={handleDownloadScheme}>
                Download scheme (.doc)
              </button>
              <button
                type="button"
                className="gb o"
                onClick={handleGenerateAIScheme}
                disabled={aiSchemeLoading}
              >
                {aiSchemeLoading ? 'Generating…' : 'Generate AI CBC Outline'}
              </button>
            </div>
            {aiSchemeOutput && (
              <div style={{ marginTop: '0.9rem', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '0.9rem', whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: 1.55, maxHeight: '280px', overflowY: 'auto' }}>
                {aiSchemeOutput}
              </div>
            )}
            <p style={{ fontSize: '0.85rem', marginTop: '0.6rem', opacity: 0.85 }}>
              Includes standard 10-column CBC scheme layout ready to fill from KICD curriculum designs.
            </p>
          </div>
        </div>

        {/* Where Next */}
        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.5rem' }}>
          <h4 style={{ color: '#f4a261', marginBottom: '0.6rem' }}>Where next?</h4>
          <div className="chips">
            <button className="chip on" onClick={() => onNavClick('#jobs')}>Education Jobs →</button>
            <button className="chip on" onClick={() => onNavClick('#library')}>Learning Library →</button>
            <button className="chip on" onClick={() => onNavClick('#tools')}>Classroom Tools →</button>
          </div>
        </div>
      </div>
    </section>
  );
}
