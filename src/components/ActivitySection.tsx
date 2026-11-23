'use client';

import React, { useState, useEffect } from 'react';
import { FormSubmissionRecord } from '@/lib/mwalimu-data';

interface ActivitySectionProps {
  onNavClick?: (hash: string) => void;
}

export default function ActivitySection({ onNavClick }: ActivitySectionProps) {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [savedMaterialsCount, setSavedMaterialsCount] = useState(0);
  const [completedChecklistCount, setCompletedChecklistCount] = useState(0);

  useEffect(() => {
    try {
      const subs = JSON.parse(localStorage.getItem('mfsub') || '[]');
      setSubmissions(subs);

      const saved = JSON.parse(localStorage.getItem('mfs') || '[]');
      setSavedMaterialsCount(saved.length);

      const checks = JSON.parse(localStorage.getItem('g10_checks') || '[]');
      const done = checks.filter(Boolean).length;
      setCompletedChecklistCount(done);
    } catch {}
  }, []);

  return (
    <section className="sec" id="activity" aria-labelledby="avh">
      <div className="w">
        <h2 className="sh rv" id="avh">My activity</h2>
        <p className="sub rv">Track the form requests, saved teaching templates and checklists on this device.</p>

        <div className="x2" style={{ marginBottom: '2.5rem' }}>
          {/* Submissions Log */}
          <div style={{ background: '#fff', border: '1px solid #e0ddd6', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>📋 My Submissions</h3>
            {submissions.length > 0 ? (
              <div style={{ display: 'grid', gap: '0.8rem', maxHeight: '240px', overflowY: 'auto' }}>
                {submissions.map((s, idx) => (
                  <div key={idx} style={{ padding: '0.6rem', borderBottom: '1px solid #eee', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <b>{s.ref}</b>
                      <span className="tag">{s.type}</span>
                    </div>
                    <p style={{ margin: '0.2rem 0', color: '#444' }}>{s.title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#777' }}>
                      <span>Submitted: {s.date}</span>
                      <span style={{ color: '#2c5f2d', fontWeight: 600 }}>Sent for review</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontSize: '0.92rem' }}>
                Nothing sent yet. Forms submitted on Jobs, Tutoring, Notices and Advertise will automatically appear here with reference IDs.
              </p>
            )}
          </div>

          {/* Saved Materials & Checklists */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: '#fff', border: '1px solid #e0ddd6', borderRadius: '16px', padding: '1.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>⭐ Saved Learning Materials</h3>
              <p style={{ fontSize: '0.95rem', color: '#555' }}>
                <b>{savedMaterialsCount}</b> schemes, notes and past papers saved in your library bookmark.
              </p>
              {onNavClick && (
                <button className="gb o" onClick={() => onNavClick('#library')} style={{ marginTop: '0.6rem' }}>
                  Open Saved Materials →
                </button>
              )}
            </div>

            <div style={{ background: '#fff', border: '1px solid #e0ddd6', borderRadius: '16px', padding: '1.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>✅ Grade 10 Placement Readiness</h3>
              <p style={{ fontSize: '0.95rem', color: '#555' }}>
                <b>{completedChecklistCount} of 5</b> pathway preparation steps completed.
              </p>
              {onNavClick && (
                <button className="gb o" onClick={() => onNavClick('#notices')} style={{ marginTop: '0.6rem' }}>
                  Open Checklist →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* How Submissions Work */}
        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>How Mwalimu Family submissions work</h3>
          <ol className="jn" style={{ lineHeight: 1.8, fontSize: '0.95rem', marginTop: '0.5rem' }}>
            <li>You fill and send an online form. A unique tracking reference code is issued immediately.</li>
            <li>WhatsApp opens with pre-formatted details for our editorial team to review.</li>
            <li>Our team checks the authenticity, employer status, and anti-scam compliance.</li>
            <li>Approved vacancies, notices, and tutoring matches go live on the public site.</li>
          </ol>
        </div>
      </div>
    </section>
  );
}
