'use client';

import React from 'react';

interface RoleChooserProps {
  onNavClick: (hash: string) => void;
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
              <li><a href="#library" onClick={(e) => { e.preventDefault(); onNavClick('#library'); }}>Download templates</a></li>
              <li><a href="#teaching" onClick={(e) => { e.preventDefault(); onNavClick('#teaching'); }}>Plan your term</a></li>
              <li><a href="#jobs" onClick={(e) => { e.preventDefault(); onNavClick('#jobs'); }}>Find or post jobs</a></li>
            </ol>
          </div>

          <div>
            <h3>👨🏾‍👩🏾‍👧🏾 Parent</h3>
            <ol className="jn">
              <li><a href="#news" onClick={(e) => { e.preventDefault(); onNavClick('#news'); }}>Read the news</a></li>
              <li><a href="#notices" onClick={(e) => { e.preventDefault(); onNavClick('#notices'); }}>Check notices</a></li>
              <li><a href="#parents" onClick={(e) => { e.preventDefault(); onNavClick('#parents'); }}>Plan Grade 10 and beyond</a></li>
              <li><a href="#tutoring" onClick={(e) => { e.preventDefault(); onNavClick('#tutoring'); }}>Find a tutor</a></li>
            </ol>
          </div>

          <div>
            <h3>🎒 Learner</h3>
            <ol className="jn">
              <li><a href="#tutoring" onClick={(e) => { e.preventDefault(); onNavClick('#tutoring'); }}>Practise maths</a></li>
              <li><a href="#tools" onClick={(e) => { e.preventDefault(); onNavClick('#tools'); }}>Use the calculators</a></li>
              <li><a href="#library" onClick={(e) => { e.preventDefault(); onNavClick('#library'); }}>Revise with notes</a></li>
              <li><a href="#courses" onClick={(e) => { e.preventDefault(); onNavClick('#courses'); }}>Build new skills</a></li>
            </ol>
          </div>
        </div>

        <h2 className="sh" id="hiw" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginTop: '3.5rem' }}>
          I want to…
        </h2>
        <p className="sub" style={{ marginBottom: '1.2rem' }}>
          Go directly to a service.
        </p>

        <div className="x2" style={{ margin: 0 }}>
          <a className="x2c" href="#tutoring" onClick={(e) => { e.preventDefault(); onNavClick('#tutoring'); }}>
            <h3>📐 Tutoring and practice</h3>
            <p>Find a tutor, practise maths, or apply to tutor.</p>
          </a>
          <a className="x2c" href="#courses" onClick={(e) => { e.preventDefault(); onNavClick('#courses'); }}>
            <h3>🎓 Courses and skills</h3>
            <p>Self-paced guides in digital, study, money and career skills.</p>
          </a>
          <a className="x2c" href="#games" onClick={(e) => { e.preventDefault(); onNavClick('#games'); }}>
            <h3>🎮 Games and quizzes</h3>
            <p>Subject quizzes and learning games with saved scores.</p>
          </a>
          <a className="x2c" href="#jobs" onClick={(e) => { e.preventDefault(); onNavClick('#jobs'); }}>
            <h3>💼 Education jobs</h3>
            <p>Browse vacancies or post one for review.</p>
          </a>
          <a className="x2c" href="#advertise" onClick={(e) => { e.preventDefault(); onNavClick('#advertise'); }}>
            <h3>📢 Advertise with us</h3>
            <p>Promote your school, product or event to Kenyan families.</p>
          </a>
        </div>
      </div>
    </section>
  );
}
