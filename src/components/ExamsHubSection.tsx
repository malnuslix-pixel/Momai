'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

interface ExamsHubSectionProps {
  onNavClick?: (hash: string) => void;
}

export default function ExamsHubSection({ onNavClick }: ExamsHubSectionProps) {
  const [lang] = useLanguage();
  const copy = useSectionCopy('exams', lang);
  const [kjseaCountdown, setKjseaCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [kcseCountdown, setKcseCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const kjseaTarget = new Date(2026, 11, 1).getTime();
      const kcseTarget = new Date(2027, 0, 1).getTime();

      const diffKjsea = Math.max(0, kjseaTarget - now);
      const diffKcse = Math.max(0, kcseTarget - now);

      setKjseaCountdown({
        d: Math.floor(diffKjsea / 864e5),
        h: Math.floor(diffKjsea / 36e5) % 24,
        m: Math.floor(diffKjsea / 6e4) % 60,
        s: Math.floor(diffKjsea / 1e3) % 60
      });

      setKcseCountdown({
        d: Math.floor(diffKcse / 864e5),
        h: Math.floor(diffKcse / 36e5) % 24,
        m: Math.floor(diffKcse / 6e4) % 60,
        s: Math.floor(diffKcse / 1e3) % 60
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="sec" id="exams" aria-labelledby="exh">
      <div className="w">
        <h2 className="sh rv" id="exh">{copy.title}</h2>
        <p className="sub rv">{copy.subtitle}</p>

        {/* 3 National Exams Overview Cards */}
        <div className="ex3" style={{ margin: '2rem 0' }}>
          <div>
            <h3>KPSEA Assessment</h3>
            <dl>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Level</dt>
              <dd>End of Grade 6 (Primary School completion)</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>2026 Status</dt>
              <dd>Results targeted for release in January 2027</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Next Step</dt>
              <dd>Transitions learners into Junior School (Grade 7, 8, 9)</dd>
            </dl>
          </div>

          <div>
            <h3>KJSEA Assessment</h3>
            <dl>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Level</dt>
              <dd>End of Grade 9 (Junior School completion)</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>2026 Status</dt>
              <dd>Expected December 2026 (13,484 examiners at 24 marking centres)</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Next Step</dt>
              <dd>Informs placement into Senior School (Grade 10) pathways</dd>
            </dl>
          </div>

          <div>
            <h3>KCSE Examination</h3>
            <dl>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Level</dt>
              <dd>End of Secondary School (Form 4)</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>2026 Status</dt>
              <dd>Targeted January 2027 (1,048,355 candidates across 10,693 centres)</dd>
              <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.6rem' }}>Next Step</dt>
              <dd>University, college and TVET placements via KUCCPS</dd>
            </dl>
          </div>
        </div>

        {/* While You Wait */}
        <h3 style={{ fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '0.8rem' }}>
          While you wait for results
        </h3>
        <ol className="jn" style={{ lineHeight: 1.8, fontSize: '0.98rem' }}>
          <li>Plan around a release window, not a single day. All announced dates are targets.</li>
          <li>Agree as a family who will check the official KNEC SMS and MoE web portal.</li>
          <li>Gather necessary academic documents, birth certificates, and NEMIS/UPI records in advance.</li>
          <li>Keep study and revision light and steady, and rest well before next term begins.</li>
        </ol>

        {/* Safe Checking Banner */}
        <div className="warn" style={{ margin: '2rem 0' }}>
          <h3 style={{ color: 'var(--hd)' }}>{lang === 'sw' ? 'Kagua matokeo kwa usalama' : 'Check results safely'}</h3>
          <p style={{ color: 'var(--tx)', marginTop: '0.4rem' }}>
            Use only official Ministry of Education and KNEC channels. Never pay to see results early. Never share your child’s index number or personal identification with unverified phone numbers or WhatsApp groups.{' '}
            <Link className="dl" href="/news/s4">How to spot fake results messages →</Link>
          </p>
        </div>

        {/* Official Links & Explainers */}
        <div className="x2" style={{ marginBottom: '2.5rem' }}>
          <a className="x2c" href="https://www.knec.ac.ke" target="_blank" rel="noopener">
            <h3>KNEC Official Portal</h3>
            <p>Official examination schedules, SMS codes, and verification circulars.</p>
          </a>
          <a className="x2c" href="https://www.education.go.ke" target="_blank" rel="noopener">
            <h3>Ministry of Education</h3>
            <p>Official press statements, policy briefs, and term date schedules.</p>
          </a>
          <Link className="x2c" href="/news/s1">
            <h3>Latest Timeline Announcement</h3>
            <p>Full breakdown of Education CS Julius Ogamba’s announcement on 20 November 2026.</p>
          </Link>
          <Link className="x2c" href="/news/s5">
            <h3>Assessment Explainer</h3>
            <p>How KPSEA, KJSEA and KCSE work together under the reformed Kenyan curriculum.</p>
          </Link>
        </div>

        {/* FAQs */}
        <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>Frequently asked questions</h3>
        <div className="fq" style={{ marginBottom: '2.5rem' }}>
          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              What if results are delayed beyond the target month?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Release dates are operational targets. Wait for official press releases from the Cabinet Secretary for Education or KNEC.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              How does KJSEA scoring affect Grade 10 Senior School pathway selection?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              KJSEA uses eight performance levels (EE1 to BE2) across nine learning areas (maximum 72 points). The scores help guide placement into STEM, Social Sciences, or Arts & Sports Science pathways.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              I received an SMS claiming to offer early results for KES 500. What should I do?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Do not send any money. This is an extortion scam. Report the number immediately to DCI or the nearest education office.
            </p>
          </details>
        </div>

        {/* Results Countdown */}
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem' }}>Live Examination Results Countdowns</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--mu)' }}>KJSEA Expected Release Window (December 2026):</p>
          <div className="clk" style={{ justifyContent: 'center' }}>
            <div><b>{kjseaCountdown.d}</b><small>days</small></div>
            <div><b>{kjseaCountdown.h}</b><small>hrs</small></div>
            <div><b>{kjseaCountdown.m}</b><small>min</small></div>
            <div><b>{kjseaCountdown.s}</b><small>sec</small></div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--mu)', marginTop: '1.2rem' }}>KCSE & KPSEA Targeted Window (January 2027):</p>
          <div className="clk" style={{ justifyContent: 'center' }}>
            <div><b>{kcseCountdown.d}</b><small>days</small></div>
            <div><b>{kcseCountdown.h}</b><small>hrs</small></div>
            <div><b>{kcseCountdown.m}</b><small>min</small></div>
            <div><b>{kcseCountdown.s}</b><small>sec</small></div>
          </div>
        </div>
      </div>
    </section>
  );
}
