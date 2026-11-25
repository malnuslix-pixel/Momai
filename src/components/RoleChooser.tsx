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
import { useLanguage } from '@/lib/language';

interface RoleChooserProps {
  onNavClick?: (hash: string) => void;
}

export default function RoleChooser({ onNavClick }: RoleChooserProps) {
  const [lang] = useLanguage();

  return (
    <section className="sec" id="haud" aria-labelledby="hau">
      <div className="w">
        <div style={{ marginBottom: '1.8rem' }}>
          <span className="tag">
            {lang === 'sw' ? 'Njia za Wadau' : 'Audience Pathways'}
          </span>
          <h2 className="sh" id="hau" style={{ margin: '0.4rem 0 0.2rem' }}>
            {lang === 'sw'
              ? 'Imeandaliwa Mahususi kwa Kila Mdau wa Elimu'
              : 'Tailored for Every Educational Stakeholder'}
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            {lang === 'sw'
              ? 'Chagua nafasi yako kupata nyenzo rasmi za mtaala, matangazo ya serikali, na zana za kuokoa muda.'
              : 'Choose your role to find verified curriculum resources, official notices, and time-saving tools.'}
          </p>
        </div>

        {/* 3 Main Role Columns */}
        <div className="x2 x2-3">
          {/* Teacher Pathway */}
          <div className="portal-card">
            <div className="portal-header">
              <span className="portal-icon">
                <GraduationCap size={22} />
              </span>
              <div>
                <h3>{lang === 'sw' ? 'Walimu wa Kenya' : 'Kenyan Teachers'}</h3>
                <span className="portal-sub">
                  {lang === 'sw' ? 'Maandalizi ya darasani na maazimio' : 'Classroom preparation & schemes'}
                </span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/learn">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Pakua maazimio ya CBC na sampuli za masomo' : 'Download CBC schemes & lesson templates'}</span>
                </Link>
              </li>
              <li>
                <Link href="/teach">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Panga ratiba za muhula na rekodi za rubriki' : 'Plan term schedules & rubric records'}</span>
                </Link>
              </li>
              <li>
                <Link href="/jobs">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Tazama nafasi za kazi zilizothibitishwa' : 'Browse vetted teaching vacancies'}</span>
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
                <h3>{lang === 'sw' ? 'Wazazi na Walezi' : 'Parents & Guardians'}</h3>
                <span className="portal-sub">
                  {lang === 'sw' ? 'Ratiba za mitihani na miongozo ya karo' : 'Exam timelines & fee guidance'}
                </span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/news">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Tarehe rasmi za Wizara ya Elimu na KNEC' : 'Verified MoE & KNEC release dates'}</span>
                </Link>
              </li>
              <li>
                <Link href="/notices">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Nyaraka rasmi na tahadhari za utapeli' : 'Official circulars & scam warnings'}</span>
                </Link>
              </li>
              <li>
                <Link href="/parents">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Mwongozo wa mwelekeo wa Gredi 10 Senior School' : 'Grade 10 Senior School pathway planner'}</span>
                </Link>
              </li>
              <li>
                <Link href="/tutoring">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Tafuta walimu wa ziada wa nyumbani na mtandaoni' : 'Find vetted home & online tutors'}</span>
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
                <h3>{lang === 'sw' ? 'Wanafunzi na Watahiniwa' : 'Learners & Candidates'}</h3>
                <span className="portal-sub">
                  {lang === 'sw' ? 'Muhtasari wa masomo na mahesabu' : 'Revision notes & calculations'}
                </span>
              </div>
            </div>
            <ol className="jn">
              <li>
                <Link href="/tools">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Kikokotoo cha alama 84 za KCSE na makundi ya KUCCPS' : 'KCSE 84-pt & KUCCPS cluster calculators'}</span>
                </Link>
              </li>
              <li>
                <Link href="/tutor">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Uliza Mwalimu AI maelezo hatua kwa hatua' : 'Ask Mwalimu AI for step-by-step help'}</span>
                </Link>
              </li>
              <li>
                <Link href="/learn">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Pakua muhtasari wa marudio ya masomo' : 'Download subject revision summaries'}</span>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  <CheckCircle2 size={15} className="jn-icon" />
                  <span>{lang === 'sw' ? 'Jenga stadi za kidijitali na maisha' : 'Build digital & practical life skills'}</span>
                </Link>
              </li>
            </ol>
          </div>
        </div>

        {/* Action Direct Hubs */}
        <div style={{ marginTop: '3.5rem', marginBottom: '1.2rem' }}>
          <span className="tag">
            {lang === 'sw' ? 'Vituo vya Moja kwa Moja' : 'Direct Hubs'}
          </span>
          <h2 className="sh" id="hiw" style={{ margin: '0.4rem 0 0.2rem' }}>
            {lang === 'sw' ? 'Chunguza Nyanja za Mwalimu Family' : 'Explore Mwalimu Family Portals'}
          </h2>
          <p className="sub" style={{ margin: 0 }}>
            {lang === 'sw'
              ? 'Ufikiaji wa haraka wa vituo maalum vya elimu na huduma za jamii.'
              : 'Instant access to dedicated educational hubs and community services.'}
          </p>
        </div>

        <div className="x2" style={{ margin: 0 }}>
          <Link className="x2c" href="/tutoring">
            <div className="hub-tag-icon"><Sparkles size={20} /></div>
            <h3>{lang === 'sw' ? 'Mafunzo ya Ziada' : 'Tutoring & Practice'}</h3>
            <p>{lang === 'sw' ? 'Pata walimu walioidhinishwa au fanya maswali ya mazoezi.' : 'Find vetted tutors, complete daily practice drills, or apply as an educator.'}</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {lang === 'sw' ? 'Tafuta Walimu' : 'Find Tutoring'} <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/courses">
            <div className="hub-tag-icon"><BookOpen size={20} /></div>
            <h3>{lang === 'sw' ? 'Kozi na Stadi' : 'Courses & Skills'}</h3>
            <p>{lang === 'sw' ? 'Miongozo ya kujisomea katika stadi za kidijitali, marudio na taaluma.' : 'Self-paced guides in digital literacy, revision tactics, and career skills.'}</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {lang === 'sw' ? 'Tazama Kozi' : 'Browse Courses'} <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/games">
            <div className="hub-tag-icon"><Gamepad2 size={20} /></div>
            <h3>{lang === 'sw' ? 'Maswali na Michezo' : 'Quizzes & Games'}</h3>
            <p>{lang === 'sw' ? 'Maswali ya masomo, kadi za kumbukumbu za CBC na alama za kusoma.' : 'Subject quizzes, CBC interactive flashcards, and saved study points.'}</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {lang === 'sw' ? 'Cheza Michezo' : 'Play Quizzes'} <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/jobs">
            <div className="hub-tag-icon"><Briefcase size={20} /></div>
            <h3>{lang === 'sw' ? 'Kazi za Elimu' : 'Education Jobs'}</h3>
            <p>{lang === 'sw' ? 'Nafasi za shule zilizothibitishwa. 100% bure bila ada za udalali.' : 'Verified school vacancies. 100% free with strict zero-fee employer rules.'}</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {lang === 'sw' ? 'Tazama Kazi' : 'Browse Jobs'} <ArrowRight size={14} />
            </span>
          </Link>

          <Link className="x2c" href="/advertise">
            <div className="hub-tag-icon"><Megaphone size={20} /></div>
            <h3>{lang === 'sw' ? 'Tangaza Nasi' : 'Advertise With Us'}</h3>
            <p>{lang === 'sw' ? 'Tangaza shule yako, vitabu vya kiada au matukio kwa familia za Kenya.' : 'Promote your school, educational books, or events to Kenyan families.'}</p>
            <span className="dl" style={{ marginTop: '0.6rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {lang === 'sw' ? 'Gharama za Matangazo' : 'Advertising Rates'} <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
