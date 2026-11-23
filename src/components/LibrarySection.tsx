'use client';

import React, { useState, useEffect } from 'react';
import {
  GRADES,
  TERMS,
  RESOURCE_TYPES,
  getSubjectsForGrade,
  getSubjectEmoji,
  getSubjectHue,
  downloadWordDocument
} from '@/lib/mwalimu-data';

interface LibrarySectionProps {
  onNavClick: (hash: string) => void;
}

export default function LibrarySection({ onNavClick }: LibrarySectionProps) {
  const [selectedGrade, setSelectedGrade] = useState('Grade 7');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(18);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mfs') || '[]');
      setSavedIds(stored);
    } catch {}
  }, []);

  const toggleSave = (id: string) => {
    let next: string[];
    if (savedIds.includes(id)) {
      next = savedIds.filter(x => x !== id);
    } else {
      next = [...savedIds, id];
    }
    setSavedIds(next);
    try {
      localStorage.setItem('mfs', JSON.stringify(next));
    } catch {}
  };

  const subjects = getSubjectsForGrade(selectedGrade);

  // Generate catalog items
  const catalog = [];
  for (const g of GRADES) {
    if (selectedGrade && g !== selectedGrade) continue;
    const subs = getSubjectsForGrade(g);
    for (const s of subs) {
      if (selectedSubject && s !== selectedSubject) continue;
      for (const t of TERMS) {
        if (selectedTerm && t !== selectedTerm) continue;
        for (const [tLabel, tKey] of RESOURCE_TYPES) {
          if (selectedType && tLabel !== selectedType) continue;
          if (search) {
            const query = `${g} ${s} ${t} ${tLabel}`.toLowerCase();
            if (!query.includes(search.toLowerCase())) continue;
          }
          catalog.push({
            id: `${g}|${s}|${t}|${tLabel}`,
            grade: g,
            subject: s,
            term: t,
            type: tLabel,
            docKey: tKey
          });
        }
      }
    }
  }

  const displayed = catalog.slice(0, limit);

  return (
    <section className="sec alt" id="library" aria-labelledby="lh">
      <div className="w">
        <h2 className="sh" id="lh">Learning and teaching library</h2>
        <p className="sub">
          Editable, ready-to-fill teaching materials for every grade, subject and term.
          Pick your grade below, then download free as editable Word (.doc) files.
        </p>

        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>How to use a template</h3>
          <ol className="jn">
            <li>Pick your grade, subject and term.</li>
            <li>Download the Word file.</li>
            <li>Fill in strands, outcomes and dates from the KICD curriculum design.</li>
            <li>Save a copy for each class.</li>
          </ol>
        </div>

        {/* Filters */}
        <div className="fl">
          <input
            className="sel"
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setLimit(18); }}
            placeholder="Search templates (e.g. Mathematics)"
            aria-label="Search library"
            style={{ width: 'auto', minWidth: '220px' }}
          />

          <select
            className="sel"
            value={selectedGrade}
            onChange={(e) => { setSelectedGrade(e.target.value); setSelectedSubject(''); setLimit(18); }}
            aria-label="Grade"
          >
            <option value="">All grades</option>
            {GRADES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            className="sel"
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value); setLimit(18); }}
            aria-label="Subject"
          >
            <option value="">All subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="sel"
            value={selectedTerm}
            onChange={(e) => { setSelectedTerm(e.target.value); setLimit(18); }}
            aria-label="Term"
          >
            <option value="">All terms</option>
            {TERMS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Resource Type Filter Chips */}
        <div className="chips" role="group" aria-label="Resource type">
          <button
            className={`chip ${selectedType === '' ? 'on' : ''}`}
            onClick={() => { setSelectedType(''); setLimit(18); }}
          >
            All
          </button>
          {RESOURCE_TYPES.map(([tLabel]) => (
            <button
              key={tLabel}
              className={`chip ${selectedType === tLabel ? 'on' : ''}`}
              onClick={() => { setSelectedType(tLabel); setLimit(18); }}
            >
              {tLabel}
            </button>
          ))}
        </div>

        <p className="sub" style={{ margin: '0 0 1rem' }}>
          {catalog.length.toLocaleString()} editable templates available
        </p>

        {/* Card Grid */}
        <div className="mg">
          {displayed.map((item) => {
            const isSaved = savedIds.includes(item.id);
            const hue = getSubjectHue(item.subject);
            const emoji = getSubjectEmoji(item.subject);
            const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`${item.grade} ${item.subject} ${item.term} ${item.type} teaching material, free on Mwalimu Family`)}`;

            return (
              <div key={item.id} className="mc">
                <div
                  className="cv"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 55% 26%), hsl(${hue + 40} 60% 40%))`
                  }}
                >
                  <span>{emoji}</span>
                  <small>{item.grade}</small>
                </div>
                <div className="mb">
                  <h3>{item.subject}</h3>
                  <p>{item.term} · <b>{item.type}</b> · Word (.doc)</p>
                  <div>
                    <button
                      className="gb"
                      onClick={() => downloadWordDocument(
                        `${item.grade}_${item.subject}_${item.term}_${item.type}`,
                        `${item.type} - ${item.subject}`,
                        item.grade,
                        item.subject,
                        item.term,
                        item.type
                      )}
                    >
                      Download
                    </button>
                    <button
                      className="gb o"
                      onClick={() => toggleSave(item.id)}
                    >
                      {isSaved ? '★ Saved' : '☆ Save'}
                    </button>
                    <a
                      className="gb o"
                      href={waShareUrl}
                      target="_blank"
                      rel="noopener"
                    >
                      Share
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {catalog.length > limit && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              className="btn b1"
              onClick={() => setLimit(prev => prev + 18)}
            >
              Show more templates ({catalog.length - limit} remaining)
            </button>
          </div>
        )}

        {/* Saved Materials Drawer */}
        {savedIds.length > 0 && (
          <div style={{ marginTop: '3.5rem' }}>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>My saved materials (on this device)</h3>
            <div className="mg">
              {savedIds.map((id) => {
                const [g, s, t, ty] = id.split('|');
                const hue = getSubjectHue(s || '');
                return (
                  <div key={id} className="mc">
                    <div
                      className="cv"
                      style={{ background: `linear-gradient(135deg, hsl(${hue} 50% 25%), hsl(${hue + 40} 55% 35%))` }}
                    >
                      <span>{getSubjectEmoji(s || '')}</span>
                      <small>{g}</small>
                    </div>
                    <div className="mb">
                      <h3>{s}</h3>
                      <p>{t} · <b>{ty}</b></p>
                      <div>
                        <button
                          className="gb"
                          onClick={() => downloadWordDocument(`${g}_${s}_${t}_${ty}`, `${ty} - ${s}`, g, s, t, ty)}
                        >
                          Download
                        </button>
                        <button className="gb o" onClick={() => toggleSave(id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
