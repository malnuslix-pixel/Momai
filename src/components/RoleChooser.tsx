'use client';

import React from 'react';
import Link from 'next/link';

interface RoleChooserProps {
  onNavClick?: (hash: string) => void;
}

export default function RoleChooser({ onNavClick }: RoleChooserProps) {
  return (
    <section className="sec" id="haud" aria-labelledby="hau" style={{ padding: '3.5rem 0' }}>
      <div className="w">
        <h2 className="sh" id="hau" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
          I am a…
        </h2>
        <p className="sub" style={{ marginBottom: '1.2rem' }}>
          Choose your role to find the most relevant resources.
        </p>

        <div className="x2">
          <div>
            <h3>👩🏾‍🏫 Teacher</h3>
            <ol className="jn">
              <li><Link href="/learn">Download templates</Link></li>
              <li><Link href="/teach">Plan your term & schemes</Link></li>
              <li><Link href="/jobs">Find or post jobs</Link></li>
            </ol>
          </div>

          <div>
            <h3>👨🏾‍👩🏾‍👧🏾 Parent</h3>
            <ol className="jn">
              <li><Link href="/#news">Read education news</Link></li>
              <li><Link href="/notices">Check official notices</Link></li>
              <li><Link href="/parents">Plan Grade 10 pathways</Link></li>
              <li><Link href="/tutoring">Find a vetted tutor</Link></li>
            </ol>
          </div>

          <div>
            <h3>🎒 Learner</h3>
            <ol className="jn">
              <li><Link href="/tutoring">Practise daily maths</Link></li>
              <li><Link href="/tools">Use KCSE & cluster calculators</Link></li>
              <li><Link href="/learn">Revise with notes</Link></li>
              <li><Link href="/courses">Build practical skills</Link></li>
            </ol>
          </div>
        </div>

        <h2 className="sh" id="hiw" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginTop: '3.5rem' }}>
          I want to…
        </h2>
        <p className="sub" style={{ marginBottom: '1.2rem' }}>
          Go directly to a dedicated service page.
        </p>

        <div className="x2" style={{ margin: 0 }}>
          <Link className="x2c" href="/tutoring">
            <h3>📐 Tutoring and practice</h3>
            <p>Find a tutor, practise maths, or apply to tutor.</p>
          </Link>
          <Link className="x2c" href="/courses">
            <h3>🎓 Courses and skills</h3>
            <p>Self-paced guides in digital, study, money and career skills.</p>
          </Link>
          <Link className="x2c" href="/games">
            <h3>🎮 Games and quizzes</h3>
            <p>Subject quizzes and learning games with saved scores.</p>
          </Link>
          <Link className="x2c" href="/jobs">
            <h3>💼 Education jobs</h3>
            <p>Browse vacancies or post one for review.</p>
          </Link>
          <Link className="x2c" href="/advertise">
            <h3>📢 Advertise with us</h3>
            <p>Promote your school, product or event to Kenyan families.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
