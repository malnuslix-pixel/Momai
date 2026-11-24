'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  BookOpen,
  Briefcase,
  Gamepad2,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface RoleChooserProps {
  onNavClick?: (hash: string) => void;
}

export default function RoleChooser({ onNavClick }: RoleChooserProps) {
  return (
    <section className="sec" id="haud" aria-labelledby="hau">
      <div className="w">
        <div style={{ marginBottom: '1.8rem' }}>
          <span className="tag">Audience Pathways</span>
          <h2 className="sh" id="hau" style={{ margin: '0.4rem 0 0.2rem' }}>
            Tailored for Every Educational Stakeholder
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            Choose your role to find verified curriculum resources, official notices, and time-saving tools.
          </p>
        </div>

        {/* 3 Main Role Columns */}
        <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Teacher Pathway */}
          <div className="portal-card">
            <div className="portal-header">
              <span className="portal-icon">
                <GraduationCap size={22} />
              </span>
              <div>
                <h3>Kenyan Teachers</h3>
                <span className="portal-sub">Classroom preparation & schemes</span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/learn">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Download CBC schemes & lesson templates</span>
                </Link>
              </li>
              <li>
                <Link href="/teach">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Plan term schedules & rubric records</span>
                </Link>
              </li>
              <li>
                <Link href="/jobs">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Browse vetted teaching vacancies</span>
                </Link>
              </li>
            </ol>
          </div>

          {/* Parent Pathway */}
          <div className="portal-card">
            <div className="portal-header">
              <span className="portal-icon">
                <Users size={22} />
              </span>
              <div>
                <h3>Parents & Guardians</h3>
                <span className="portal-sub">Exam timelines & fee guidance</span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/news">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Verified MoE & KNEC release dates</span>
                </Link>
              </li>
              <li>
                <Link href="/notices">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Official circulars & scam warnings</span>
                </Link>
              </li>
              <li>
                <Link href="/parents">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Grade 10 Senior School pathway planner</span>
                </Link>
              </li>
              <li>
                <Link href="/tutoring">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Find vetted home & online tutors</span>
                </Link>
              </li>
            </ol>
          </div>

          {/* Learner Pathway */}
          <div className="portal-card">
            <div className="portal-header">
              <span className="portal-icon">
                <BookOpen size={22} />
              </span>
              <div>
                <h3>Learners & Candidates</h3>
                <span className="portal-sub">Revision notes & calculations</span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/tools">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>KCSE 84-pt & KUCCPS cluster calculators</span>
                </Link>
              </li>
              <li>
                <Link href="/tutor">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Ask Mwalimu AI for step-by-step help</span>
                </Link>
              </li>
              <li>
                <Link href="/learn">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Download subject revision summaries</span>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>Build digital & practical life skills</span>
                </Link>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Direct Hubs */}
        <div style={{ marginTop: '3.5rem', marginBottom: '1.2rem' }}>
          <span className="tag">Direct Hubs</span>
          <h2 className="sh" id="hiw" style={{ margin: '0.4rem 0 0.2rem' }}>
            Explore Mwalimu Family Portals
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            Instant access to dedicated educational hubs and community services.
          </p>
        </div>

        <div className="x2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', margin: 0 }}>
          <Link className="x2c" href="/tutoring">
            <div className="hub-tag-icon"><Sparkles size={20} /></div>
            <h3>Tutoring & Practice</h3>
            <p>Find vetted tutors, complete daily practice drills, or apply as an educator.</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Find Tutoring <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/courses">
            <div className="hub-tag-icon"><BookOpen size={20} /></div>
            <h3>Courses & Skills</h3>
            <p>Self-paced guides in digital literacy, revision tactics, and career skills.</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Browse Courses <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/games">
            <div className="hub-tag-icon"><Gamepad2 size={20} /></div>
            <h3>Quizzes & Games</h3>
            <p>Subject quizzes, CBC interactive flashcards, and saved study points.</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Play Quizzes <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/jobs">
            <div className="hub-tag-icon"><Briefcase size={20} /></div>
            <h3>Education Jobs</h3>
            <p>Verified school vacancies. 100% free with strict zero-fee employer rules.</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Browse Jobs <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/advertise">
            <div className="hub-tag-icon"><Megaphone size={20} /></div>
            <h3>Advertise With Us</h3>
            <p>Promote your school, educational books, or events to Kenyan families.</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Advertising Rates <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
