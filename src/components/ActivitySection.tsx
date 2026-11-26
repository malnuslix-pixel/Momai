'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  FormSubmissionRecord,
  downloadWordDocument,
  getSubjectEmoji,
  getSubjectHue
} from '@/lib/mwalimu-data';

interface ActivitySectionProps {
  onNavClick?: (hash: string) => void;
}

interface SavedItem {
  id: string;
  grade: string;
  subject: string;
  term: string;
  type: string;
}

interface LiveStatusInfo {
  st: 'new' | 'approved' | 'rejected' | string;
  updated_at?: string;
}

const G10_CHECKLIST_STEPS = [
  {
    id: 0,
    title: 'Review Grade 9 KJSEA Assessment Report',
    desc: 'Examine learner strengths in STEM, Social Sciences, or Arts & Sports with class teacher.'
  },
  {
    id: 1,
    title: 'Select Senior School Pathway',
    desc: 'Choose primary career pathway: STEM (Pure Sciences/Applied), Social Sciences (Humanities/Business), or Arts & Sports.'
  },
  {
    id: 2,
    title: 'Confirm School Choices in Placement Portal',
    desc: 'Ensure selected Senior Schools offer the chosen pathway and subject combinations.'
  },
  {
    id: 3,
    title: 'Assemble Required Documentation',
    desc: 'Birth certificate, Nemis/UPI number, KCPE/KPSEA assessment slips, and medical certificates.'
  },
  {
    id: 4,
    title: 'Final Consultation & Reporting Checklist',
    desc: 'Attend parental briefing at school, verify capitation status, and review fee guidelines.'
  }
];

export default function ActivitySection({ onNavClick }: ActivitySectionProps) {
  const [tab, setTab] = useState<'all' | 'materials' | 'submissions' | 'checklist'>('all');
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [liveStatuses, setLiveStatuses] = useState<Record<string, LiveStatusInfo>>({});
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [g10Checks, setG10Checks] = useState<boolean[]>([false, false, false, false, false]);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const syncLiveStatuses = useCallback(async (subs: FormSubmissionRecord[]) => {
    const refs = subs.map((s) => s.ref).filter(Boolean);
    if (refs.length === 0) return;
    setRefreshingStatus(true);
    try {
      const res = await fetch(`/api/submit?refs=${encodeURIComponent(refs.join(','))}`);
      const data = await res.json();
      if (data?.ok && data.statuses) {
        setLiveStatuses(data.statuses);
      }
    } catch {}
    finally {
      setRefreshingStatus(false);
    }
  }, []);

  useEffect(() => {
    try {
      const subs: FormSubmissionRecord[] = JSON.parse(localStorage.getItem('mfsub') || '[]');
      setSubmissions(subs);
      syncLiveStatuses(subs);

      const storedMfs: string[] = JSON.parse(localStorage.getItem('mfs') || '[]');
      const parsed: SavedItem[] = storedMfs.map((id) => {
        const parts = id.split('|');
        return {
          id,
          grade: parts[0] || 'Grade 7',
          subject: parts[1] || 'General',
          term: parts[2] || 'Term 1',
          type: parts[3] || 'Scheme of Work'
        };
      });
      setSavedItems(parsed);

      const storedChecks = JSON.parse(localStorage.getItem('g10_checks') || '[]');
      if (Array.isArray(storedChecks) && storedChecks.length === 5) {
        setG10Checks(storedChecks);
      }
    } catch {}
  }, [syncLiveStatuses]);

  const handleToggleCheck = (index: number) => {
    const updated = [...g10Checks];
    updated[index] = !updated[index];
    setG10Checks(updated);
    try {
      localStorage.setItem('g10_checks', JSON.stringify(updated));
    } catch {}
  };

  const handleRemoveSavedItem = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    try {
      localStorage.setItem('mfs', JSON.stringify(updated.map(i => i.id)));
    } catch {}
  };

  const handleClearSubmissions = () => {
    if (window.confirm('Are you sure you want to clear your local submission history on this device?')) {
      setSubmissions([]);
      setLiveStatuses({});
      try {
        localStorage.removeItem('mfsub');
      } catch {}
    }
  };

  const copyRefToClipboard = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2500);
  };

  const completedStepsCount = g10Checks.filter(Boolean).length;
  const checklistPercentage = Math.round((completedStepsCount / G10_CHECKLIST_STEPS.length) * 100);

  return (
    <section className="sec" id="activity" aria-labelledby="avh" style={{ padding: '2.5rem 0 4rem' }}>
      <div className="w">
        <div className="chips" style={{ marginBottom: '2rem', borderBottom: '1px solid var(--ln)', paddingBottom: '0.8rem' }}>
          <button onClick={() => setTab('all')} className={`chip ${tab === 'all' ? 'on' : ''}`}>
            📋 All Activity ({savedItems.length + submissions.length})
          </button>
          <button onClick={() => setTab('materials')} className={`chip ${tab === 'materials' ? 'on' : ''}`}>
            ⭐ Saved Materials ({savedItems.length})
          </button>
          <button onClick={() => setTab('submissions')} className={`chip ${tab === 'submissions' ? 'on' : ''}`}>
            📬 My Submissions ({submissions.length})
          </button>
          <button onClick={() => setTab('checklist')} className={`chip ${tab === 'checklist' ? 'on' : ''}`}>
            ✅ Grade 10 Placement ({completedStepsCount}/5)
          </button>
        </div>

        {/* 1. SAVED MATERIALS SECTION */}
        {(tab === 'all' || tab === 'materials') && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--hd)' }}>⭐ Saved Learning Materials</h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--mu)' }}>
                  Editable Word (.doc) schemes, notes, and past papers bookmarked on this device.
                </p>
              </div>
              <Link href="/learn" className="gb o" style={{ fontSize: '0.88rem', padding: '0.45rem 1rem' }}>
                + Browse More Materials
              </Link>
            </div>

            {savedItems.length > 0 ? (
              <div className="mg" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {savedItems.map((item) => {
                  const hue = getSubjectHue(item.subject);
                  const emoji = getSubjectEmoji(item.subject);
                  return (
                    <div key={item.id} className="mc" style={{ background: '#ffffff', color: '#1f2937', borderRadius: '16px', border: '1px solid #d5dfd5', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div
                        className="cv"
                        style={{
                          background: `linear-gradient(135deg, hsl(${hue} 50% 25%), hsl(${hue + 40} 55% 35%))`,
                          color: '#fff',
                          padding: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
                        <span className="tag" style={{ background: 'rgba(0,0,0,0.35)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                          {item.grade}
                        </span>
                      </div>
                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.3rem', color: '#143215' }}>{item.subject}</h3>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151' }}>
                            {item.term} · <b>{item.type}</b>
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button
                            className="gb"
                            style={{ flex: 1, padding: '0.45rem 0.6rem', fontSize: '0.85rem' }}
                            onClick={() => downloadWordDocument(
                              `${item.grade}_${item.subject}_${item.term}_${item.type}`,
                              `${item.type} - ${item.subject}`,
                              item.grade,
                              item.subject,
                              item.term,
                              item.type
                            )}
                          >
                            ⬇ Download .doc
                          </button>
                          <button
                            className="gb o"
                            style={{ padding: '0.45rem 0.7rem', fontSize: '0.85rem', color: '#b91c1c', borderColor: '#b91c1c' }}
                            onClick={() => handleRemoveSavedItem(item.id)}
                            title="Remove from saved"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                background: 'var(--card)',
                border: '1px dashed var(--ln)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.6rem' }}>📚</span>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.4rem', color: '#fff' }}>No materials bookmarked yet</h3>
                <p style={{ color: 'var(--mu)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.2rem' }}>
                  Save schemes of work, lesson plans, and revision notes as you browse the library for instant offline access.
                </p>
                <Link href="/learn" className="btn b1" style={{ fontSize: '0.9rem', padding: '0.6rem 1.4rem', textDecoration: 'none' }}>
                  Open Curriculum Library →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 2. SUBMISSIONS LOG SECTION (WITH LIVE STATUS SYNC) */}
        {(tab === 'all' || tab === 'submissions') && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--hd)' }}>📬 My Form Submissions & Inquiries</h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--mu)' }}>
                  Live status of job vacancies, tutoring inquiries, notices, and advertisements submitted from this device.
                </p>
              </div>
              {submissions.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => syncLiveStatuses(submissions)}
                    disabled={refreshingStatus}
                    className="gb o"
                    style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', margin: 0 }}
                  >
                    {refreshingStatus ? 'Syncing…' : '↻ Refresh Status'}
                  </button>
                  <button
                    onClick={handleClearSubmissions}
                    className="gb o"
                    style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem', margin: 0, color: '#fca5a5', borderColor: 'rgba(252,165,165,0.5)' }}
                  >
                    Clear History
                  </button>
                </div>
              )}
            </div>

            {submissions.length > 0 ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {submissions.map((s, idx) => {
                  const statusObj = liveStatuses[s.ref];
                  const st = statusObj?.st || 'new';
                  const statusLabel =
                    st === 'approved'
                      ? '✅ Approved & Verified'
                      : st === 'rejected'
                        ? '⚠️ Declined / Action Needed'
                        : '🔍 Editorial Verification';
                  const statusColor =
                    st === 'approved'
                      ? '#15803d'
                      : st === 'rejected'
                        ? '#b91c1c'
                        : '#b45309';

                  return (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff',
                        color: '#1f2937',
                        border: '1px solid #d5dfd5',
                        borderRadius: '16px',
                        padding: '1.4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.7rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: '#1a3d1b',
                              background: '#e8f3e8',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px'
                            }}>
                              {s.ref}
                            </span>
                            <button
                              onClick={() => copyRefToClipboard(s.ref)}
                              style={{
                                background: '#f8faf8',
                                color: '#143215',
                                border: '1px solid #cbd5cb',
                                borderRadius: '6px',
                                padding: '0.25rem 0.6rem',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              {copiedRef === s.ref ? '✓ Copied' : 'Copy Code'}
                            </button>
                          </div>
                          <h3 style={{ fontSize: '1.15rem', margin: '0.5rem 0 0.2rem', color: '#143215' }}>{s.title}</h3>
                        </div>
                        <span className="tag" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#f59e0b', fontWeight: 700 }}>
                          {s.type.toUpperCase()}
                        </span>
                      </div>

                      <div style={{
                        background: '#f5f8f5',
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid #dce5dc',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        fontSize: '0.86rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#166534', fontWeight: 600 }}>
                          <span>●</span> Submitted on {s.date}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: statusColor, fontWeight: 700 }}>
                          <span>{statusLabel}</span>
                        </div>
                        <a
                          href={`https://wa.me/254715363944?text=${encodeURIComponent(`Hello Mwalimu Desk, following up on submission [${s.ref}] (${s.title}).`)}`}
                          target="_blank"
                          rel="noopener"
                          style={{ color: '#14532d', fontWeight: 700, textDecoration: 'underline' }}
                        >
                          Follow up on WhatsApp →
                        </a>
                      </div>

                      {s.data && (
                        <details style={{ fontSize: '0.88rem', color: '#374151', cursor: 'pointer' }}>
                          <summary style={{ fontWeight: 700, color: '#14532d' }}>View Submitted Details</summary>
                          <div style={{ marginTop: '0.5rem', background: '#f8faf8', padding: '0.8rem', borderRadius: '8px', border: '1px solid #dce5dc', color: '#1f2937' }}>
                            {Object.entries(s.data).map(([k, v]) => (
                              <div key={k} style={{ marginBottom: '0.3rem' }}>
                                <b style={{ textTransform: 'capitalize', color: '#143215' }}>{k}:</b> {String(v)}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                background: 'var(--card)',
                border: '1px dashed var(--ln)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.6rem' }}>📬</span>
                <h3 style={{ fontSize: '1.15rem', margin: '0 0 0.4rem', color: '#fff' }}>No submissions on this device yet</h3>
                <p style={{ color: 'var(--mu)', fontSize: '0.92rem', maxWidth: '460px', margin: '0 auto 1.2rem' }}>
                  When you submit a teaching vacancy, request an evening tutor, or send an official notice, your live review status will be tracked here.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/jobs" className="btn b2" style={{ fontSize: '0.88rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
                    Post a Job Vacancy →
                  </Link>
                  <Link href="/tutoring" className="btn b2" style={{ fontSize: '0.88rem', padding: '0.5rem 1rem', textDecoration: 'none' }}>
                    Request a Tutor →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. GRADE 10 PLACEMENT CHECKLIST */}
        {(tab === 'all' || tab === 'checklist') && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--hd)' }}>✅ Senior School Grade 10 Placement Readiness</h2>
                <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--mu)' }}>
                  Track your preparation for Grade 9 to 10 Senior School pathway selection and reporting.
                </p>
              </div>
              <span className="tag" style={{ background: '#2c5f2d', color: '#fff', borderColor: '#6ec272', fontSize: '0.9rem', padding: '0.3rem 0.8rem' }}>
                {checklistPercentage}% Completed ({completedStepsCount}/5)
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.18)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.4rem' }}>
              <div style={{ width: `${checklistPercentage}%`, height: '100%', background: 'var(--ac)', transition: 'width 0.4s ease' }} />
            </div>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {G10_CHECKLIST_STEPS.map((step) => {
                const isDone = g10Checks[step.id];
                return (
                  <label
                    key={step.id}
                    style={{
                      background: isDone ? '#eef8ef' : '#ffffff',
                      border: `1px solid ${isDone ? '#86c98a' : '#d5dfd5'}`,
                      borderRadius: '14px',
                      padding: '1rem 1.2rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.9rem',
                      cursor: 'pointer',
                      color: '#1f2937',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => handleToggleCheck(step.id)}
                      style={{ width: '20px', height: '20px', accentColor: '#2c5f2d', marginTop: '0.2rem', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <div>
                      <h4 style={{
                        margin: 0,
                        fontSize: '1.02rem',
                        color: isDone ? '#14532d' : '#143215',
                        textDecoration: isDone ? 'line-through' : 'none'
                      }}>
                        {step.title}
                      </h4>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.88rem', color: '#374151' }}>
                        {step.desc}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="warn" style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: 'var(--hd)' }}>🔒 Privacy & Data Policy</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--tx)', marginTop: '0.4rem', lineHeight: 1.6 }}>
            Bookmarked materials and checklist states remain in your device browser storage, while submission status codes sync securely by reference ID without exposing private contact details.
          </p>
        </div>
      </div>
    </section>
  );
}
