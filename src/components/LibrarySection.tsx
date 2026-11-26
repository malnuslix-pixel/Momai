'use client';

import React, { useState, useEffect } from 'react';
import {
  getSubjectsForGrade,
  getSubjectEmoji,
  getSubjectHue,
  downloadWordDocument,
  downloadCustomDoc,
} from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useCms, useSectionCopy } from '@/lib/cms-context';

interface LibrarySectionProps {
  onNavClick: (hash: string) => void;
}

export default function LibrarySection({ onNavClick }: LibrarySectionProps) {
  const [lang] = useLanguage();
  const { cms } = useCms();
  const copy = useSectionCopy('library', lang);
  const grades = cms.learning.grades;
  const terms = cms.learning.terms;
  const resourceTypes = cms.learning.resourceTypes;
  const customMaterials = cms.learning.materials;

  const [selectedGrade, setSelectedGrade] = useState('Grade 7');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(18);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [aiTopic, setAiTopic] = useState('');
  const [aiPack, setAiPack] = useState<string | null>(null);
  const [aiPackLoading, setAiPackLoading] = useState(false);

  const handleGenerateAIPack = async () => {
    setAiPackLoading(true);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'scheme',
          grade: selectedGrade || 'Grade 7',
          subject: selectedSubject || subjects[0] || 'Mathematics',
          term: selectedTerm || terms[0] || 'Term 1',
          strand: aiTopic.trim() || search.trim() || 'Core Term Concepts & Practice',
        }),
      });
      const data = await res.json();
      if (data.ok && data.text) setAiPack(data.text);
    } catch {
    } finally {
      setAiPackLoading(false);
    }
  };

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

  // Generate catalog items from Admin-controlled grades, terms, and resourceTypes
  const catalog = [];
  for (const g of grades) {
    if (selectedGrade && g !== selectedGrade) continue;
    const subs = getSubjectsForGrade(g);
    for (const s of subs) {
      if (selectedSubject && s !== selectedSubject) continue;
      for (const t of terms) {
        if (selectedTerm && t !== selectedTerm) continue;
        for (const [tLabel, tKey] of resourceTypes) {
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

  const filteredCustomMaterials = customMaterials.filter((m) => {
    if (selectedGrade && m.grade !== selectedGrade) return false;
    if (selectedSubject && m.subject !== selectedSubject) return false;
    if (selectedTerm && m.term !== selectedTerm) return false;
    if (selectedType && m.type !== selectedType) return false;
    if (search && !`${m.title} ${m.grade} ${m.subject} ${m.summary}`.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  const displayed = catalog.slice(0, limit);

  return (
    <section className="sec alt" id="library" aria-labelledby="lh">
      <div className="w">
        <h2 className="sh" id="lh">{copy.title}</h2>
        <p className="sub">{copy.subtitle}</p>

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
            {grades.map(g => (
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
            {terms.map(t => (
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
          {resourceTypes.map(([tLabel]) => (
            <button
              key={tLabel}
              className={`chip ${selectedType === tLabel ? 'on' : ''}`}
              onClick={() => { setSelectedType(tLabel); setLimit(18); }}
            >
              {tLabel}
            </button>
          ))}
        </div>

        {/* AI Custom Study Pack Builder */}
        <div className="gl" style={{ marginBottom: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
            <div>
              <strong style={{ color: '#ffd166' }}>✨ Need specific lesson notes or a KICD scheme for {selectedGrade || 'any grade'}?</strong>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', opacity: 0.9 }}>
                Enter a strand or topic and Mwalimu AI will draft outcomes, inquiry questions & rubric tasks you can download.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="sel"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder={`Topic for ${selectedSubject || 'selected subject'} (e.g. Fractions & Percentages)`}
              style={{ flex: '1 1 240px', marginBottom: 0 }}
            />
            <button
              type="button"
              className="gb"
              onClick={handleGenerateAIPack}
              disabled={aiPackLoading}
            >
              {aiPackLoading ? 'Generating…' : '✨ Generate AI Notes'}
            </button>
            {aiPack && (
              <button
                type="button"
                className="gb o"
                onClick={() =>
                  downloadCustomDoc(
                    `AI_${selectedGrade || 'CBC'}_${selectedSubject || 'Pack'}`,
                    `${selectedGrade || 'CBC'} ${selectedSubject || ''} — ${aiTopic || 'AI Learning Pack'}`.trim(),
                    `${selectedTerm || 'Term 1'} · Mwalimu AI KICD Assistant`,
                    aiPack
                  )
                }
              >
                Download AI Pack (.doc)
              </button>
            )}
          </div>
          {aiPack && (
            <pre style={{ background: 'rgba(0,0,0,0.28)', padding: '0.85rem', borderRadius: '10px', whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.6, margin: 0, maxHeight: '260px', overflowY: 'auto' }}>
              {aiPack}
            </pre>
          )}
        </div>

        {/* Admin Published Special Learning Materials */}
        {filteredCustomMaterials.length > 0 && (
          <div style={{ marginBottom: '1.6rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>📌 Featured Study &amp; Revision Packs</h3>
            <div className="mg">
              {filteredCustomMaterials.map((mat) => (
                <div key={mat.id} className="mc" style={{ border: '1.5px solid #f4a261' }}>
                  <div className="cv" style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)' }}>
                    <span>📘</span>
                    <small>{mat.grade}</small>
                  </div>
                  <div className="mb">
                    <span className="tag" style={{ background: '#fef3c7', color: '#92400e', fontSize: '0.75rem' }}>
                      {mat.type} · Featured
                    </span>
                    <h3 style={{ marginTop: '0.35rem' }}>{mat.title}</h3>
                    <p>{mat.summary}</p>
                    <div>
                      <button
                        className="gb"
                        onClick={() =>
                          downloadCustomDoc(
                            mat.title,
                            mat.title,
                            `${mat.grade} · ${mat.subject} · ${mat.term} · ${mat.type}`,
                            mat.content
                          )
                        }
                      >
                        Download (.doc)
                      </button>
                      {mat.url && (
                        <a className="gb o" href={mat.url} target="_blank" rel="noopener">
                          Open Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
