'use client';

import React, { useState } from 'react';
import { downloadSchoolCalendar } from '@/lib/mwalimu-data';

interface ParentsAndJobsProps {
  onNavClick: (hash: string) => void;
}

export default function ParentsAndJobs({ onNavClick }: ParentsAndJobsProps) {
  // Calendar Dates
  const [t1Open, setT1Open] = useState('2026-01-05');
  const [t1Close, setT1Close] = useState('2026-04-03');
  const [t2Open, setT2Open] = useState('2026-05-04');
  const [t2Close, setT2Close] = useState('2026-08-07');
  const [t3Open, setT3Open] = useState('2026-08-31');
  const [t3Close, setT3Close] = useState('2026-10-23');

  const handleDownloadCalendar = () => {
    downloadSchoolCalendar([
      { open: t1Open, close: t1Close },
      { open: t2Open, close: t2Close },
      { open: t3Open, close: t3Close },
    ]);
  };

  return (
    <>
      {/* Parents Hub */}
      <section className="sec" id="parents" aria-labelledby="ph">
        <div className="w">
          <h2 className="sh" id="ph">Parents’ hub</h2>
          <p className="sub">Plain-language guides for Kenyan families. Always confirm details with official Ministry guidelines.</p>

          <h3 style={{ fontSize: '1.4rem', margin: '1.5rem 0 1rem' }}>Grade 10 Senior School pathways</h3>
          <div className="ex3">
            <div>
              <h3>🔬 STEM Pathway</h3>
              <p>For learners passionate about mathematics, computing, technical engineering, pure and applied sciences.</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}><b>Tracks:</b> Pure Sciences, Applied Sciences, Technical & Engineering.</p>
            </div>
            <div>
              <h3>📚 Social Sciences</h3>
              <p>For learners who excel in languages, literature, history, citizenship, business studies, law and governance.</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}><b>Tracks:</b> Languages & Humanities, Business & Management.</p>
            </div>
            <div>
              <h3>🎨 Arts & Sports</h3>
              <p>For learners with demonstrated talents in performing arts, visual design, athletics, sports science and music.</p>
              <p style={{ fontSize: '0.85rem', color: '#666' }}><b>Tracks:</b> Sports Science, Visual Arts, Performing Arts.</p>
            </div>
          </div>

          {/* School Term Calendar Generator */}
          <div className="card" style={{ marginTop: '2.5rem' }}>
            <h3>My school calendar downloader</h3>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Set your school's term opening and closing dates, then download an `.ics` calendar file to automatically sync dates to your phone:
            </p>

            <div style={{ display: 'grid', gap: '0.8rem', maxWidth: '540px', margin: '1rem 0' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <b style={{ width: '80px' }}>Term 1:</b>
                <input className="sel" type="date" value={t1Open} onChange={(e) => setT1Open(e.target.value)} style={{ width: 'auto' }} />
                <span>to</span>
                <input className="sel" type="date" value={t1Close} onChange={(e) => setT1Close(e.target.value)} style={{ width: 'auto' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <b style={{ width: '80px' }}>Term 2:</b>
                <input className="sel" type="date" value={t2Open} onChange={(e) => setT2Open(e.target.value)} style={{ width: 'auto' }} />
                <span>to</span>
                <input className="sel" type="date" value={t2Close} onChange={(e) => setT2Close(e.target.value)} style={{ width: 'auto' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <b style={{ width: '80px' }}>Term 3:</b>
                <input className="sel" type="date" value={t3Open} onChange={(e) => setT3Open(e.target.value)} style={{ width: 'auto' }} />
                <span>to</span>
                <input className="sel" type="date" value={t3Close} onChange={(e) => setT3Close(e.target.value)} style={{ width: 'auto' }} />
              </div>
            </div>

            <button className="gb" onClick={handleDownloadCalendar}>
              Download calendar (.ics)
            </button>
          </div>
        </div>
      </section>

      {/* Education Jobs */}
      <section className="sec mb bp" id="jobs" aria-labelledby="jbh">
        <div className="w">
          <h2 className="sh" id="jbh">Education jobs</h2>
          <p className="sub">Vacancies from verified Kenyan schools and institutions. Genuine employers never charge application fees.</p>

          <div className="x2">
            <div>
              <h3>Tips for Teacher Applicants</h3>
              <ul className="kf">
                <li>Confirm your TSC registration status and certificate validity.</li>
                <li>Tailor your CV to the specific CBC learning area.</li>
                <li>Never send money or pay an interview or processing fee.</li>
              </ul>
            </div>
            <div>
              <h3>Spot an Employment Scam</h3>
              <ul className="kf">
                <li>They request M-Pesa registration or processing fees.</li>
                <li>They use unofficial free email addresses (e.g. personal Gmail).</li>
                <li>They offer immediate placement without an interview.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advertise */}
      <section className="sec" id="advertise" aria-labelledby="adh">
        <div className="w">
          <h2 className="sh" id="adh">Advertise and promote</h2>
          <p className="sub">Reach teachers, school heads, parents and learners across Kenya.</p>

          <div className="x2">
            <div>
              <h3>Sponsored Notice</h3>
              <p>A pinned official announcement on the Mwalimu Family notice board.</p>
            </div>
            <div>
              <h3>Featured School / Vacancy Listing</h3>
              <p>Highlight your school admission or teaching job vacancy to thousands of educators.</p>
            </div>
            <div>
              <h3>WhatsApp Community Mention</h3>
              <p>Direct exposure to our active WhatsApp teacher groups and subscriber lists.</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a
              className="btn b1"
              href="https://wa.me/254715363944?text=Hello%20Mwalimu%20Family%2C%20I%20would%20like%20to%20advertise"
              target="_blank"
              rel="noopener"
            >
              Contact Advertising Team on WhatsApp →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
