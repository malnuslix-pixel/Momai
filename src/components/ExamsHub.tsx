'use client';

import React from 'react';

interface ExamsHubProps {
  onNavClick: (hash: string) => void;
}

export default function ExamsHub({ onNavClick }: ExamsHubProps) {
  return (
    <section className="sec" id="exams" aria-labelledby="exh">
      <div className="w">
        <h2 className="sh" id="exh">Exams hub: KPSEA, KJSEA and KCSE</h2>
        <p className="sub">
          A plain-language guide to Kenya’s national assessments and how to follow results safely.
          Always confirm dates with the Ministry of Education and KNEC.
        </p>

        <div className="ex3">
          <div>
            <h3>KPSEA</h3>
            <dl>
              <dt>Level</dt><dd>End of Grade 6 (Primary)</dd>
              <dt>Status</dt><dd>Results targeted for January 2027</dd>
              <dt>Next step</dt><dd>Transition to Junior School, Grade 7</dd>
            </dl>
          </div>

          <div>
            <h3>KJSEA</h3>
            <dl>
              <dt>Level</dt><dd>End of Grade 9 (Junior School)</dd>
              <dt>Status</dt><dd>Results expected in December 2026. Marking involves 13,484 examiners at 24 centres</dd>
              <dt>Next step</dt><dd>Informs Grade 10 Senior School pathway placement</dd>
            </dl>
          </div>

          <div>
            <h3>KCSE</h3>
            <dl>
              <dt>Level</dt><dd>End of Secondary school (Form 4)</dd>
              <dt>Status</dt><dd>Results targeted for January 2027. 1,048,355 candidates across 10,693 centres</dd>
              <dt>Next step</dt><dd>University, college and TVET placement through KUCCPS</dd>
            </dl>
          </div>
        </div>

        <div className="warn" style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: 'var(--hd)' }}>Check results safely</h3>
          <p style={{ color: 'var(--tx)' }}>
            Use only official Ministry of Education and KNEC channels. Never pay anyone to "see results early" and never share your child’s index number or birth certificate with unknown phone numbers or social media links.
          </p>
        </div>

        <div className="x2">
          <a className="x2c" href="https://www.knec.ac.ke" target="_blank" rel="noopener">
            <h3>KNEC Portal</h3>
            <p>Official examination registration and results verification portal.</p>
          </a>
          <a className="x2c" href="https://www.education.go.ke" target="_blank" rel="noopener">
            <h3>Ministry of Education</h3>
            <p>Official announcements, placement guidelines, and circulars.</p>
          </a>
          <a
            className="x2c"
            href="#/s1"
            onClick={(e) => { e.preventDefault(); onNavClick('#/s1'); }}
          >
            <h3>Latest timeline story</h3>
            <p>Official timelines announced by Education CS Julius Ogamba.</p>
          </a>
          <a
            className="x2c"
            href="#/s5"
            onClick={(e) => { e.preventDefault(); onNavClick('#/s5'); }}
          >
            <h3>CBC vs KCSE Explainer</h3>
            <p>How KPSEA, KJSEA and KCSE fit together in Kenya's system.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
