'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { submitOnlineForm } from '@/lib/mwalimu-data';
import { awardLearnerXP } from '@/lib/learner-profile';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

interface TutoringSectionProps {
  onNavClick?: (hash: string) => void;
}

export default function TutoringSection({ onNavClick }: TutoringSectionProps) {
  const [lang] = useLanguage();
  const copy = useSectionCopy('tutoring', lang);
  // Maths Practice State
  const [op, setOp] = useState<'+' | '−' | '×' | '÷'>('+');
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [problems, setProblems] = useState<{ a: number; b: number; ans: number }[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [practiceResult, setPracticeResult] = useState<string | null>(null);

  const generateProblems = () => {
    const maxVal = level === 1 ? 12 : level === 2 ? 50 : 200;
    const newProbs = [];
    for (let i = 0; i < 5; i++) {
      let a = Math.floor(Math.random() * maxVal) + 2;
      let b = Math.floor(Math.random() * maxVal) + 2;
      let ans = a + b;

      if (op === '−') {
        if (b > a) { const tmp = a; a = b; b = tmp; }
        ans = a - b;
      } else if (op === '×') {
        const factorMax = level === 1 ? 9 : level === 2 ? 15 : 25;
        a = Math.floor(Math.random() * factorMax) + 2;
        b = Math.floor(Math.random() * factorMax) + 2;
        ans = a * b;
      } else if (op === '÷') {
        b = Math.floor(Math.random() * 10) + 2;
        ans = Math.floor(Math.random() * (level * 8)) + 2;
        a = b * ans;
      }
      newProbs.push({ a, b, ans });
    }
    setProblems(newProbs);
    setUserAnswers(['', '', '', '', '']);
    setPracticeResult(null);
  };

  const checkPracticeAnswers = () => {
    let score = 0;
    problems.forEach((p, idx) => {
      if (Number(userAnswers[idx]) === p.ans) {
        score++;
      }
    });
    const earned = score >= 3 ? awardLearnerXP('quiz_completed', 'maths') : awardLearnerXP('session_completed', 'maths');
    setPracticeResult(`Score: ${score} / ${problems.length} (+${earned.xpEarned} XP) ${score === problems.length ? '🏆 Perfect Score!' : ''}`);
  };

  // Find a Tutor Form State
  const [findSubject, setFindSubject] = useState('');
  const [findGrade, setFindGrade] = useState('');
  const [findMode, setFindMode] = useState('Online');
  const [findLocation, setFindLocation] = useState('');
  const [findContact, setFindContact] = useState('');
  const [findConsent, setFindConsent] = useState(false);
  const [findSubmitting, setFindSubmitting] = useState(false);
  const [findRef, setFindRef] = useState<string | null>(null);
  const [findWaUrl, setFindWaUrl] = useState('');

  const handleFindTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findSubject || !findGrade || !findContact || !findConsent) return;

    setFindSubmitting(true);
    const fields: [string, string][] = [
      ['Subject Required', findSubject],
      ['Grade / Level', findGrade],
      ['Preferred Mode', findMode],
      ['Location / Town', findLocation || 'Any'],
      ['Parent Contact', findContact]
    ];

    const res = await submitOnlineForm('find', 'Tutor Request', `${findGrade} ${findSubject}`, fields, findConsent);
    setFindRef(res.ref);
    setFindWaUrl(res.whatsappUrl);
    setFindSubject('');
    setFindGrade('');
    setFindLocation('');
    setFindContact('');
    setFindConsent(false);
    setFindSubmitting(false);
  };

  // Apply as Tutor Form State
  const [tutName, setTutName] = useState('');
  const [tutSubs, setTutSubs] = useState('');
  const [tutQuals, setTutQuals] = useState('');
  const [tutLocation, setTutLocation] = useState('');
  const [tutContact, setTutContact] = useState('');
  const [tutConsent, setTutConsent] = useState(false);
  const [tutSubmitting, setTutSubmitting] = useState(false);
  const [tutRef, setTutRef] = useState<string | null>(null);
  const [tutWaUrl, setTutWaUrl] = useState('');

  const handleApplyTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutName || !tutSubs || !tutQuals || !tutContact || !tutConsent) return;

    setTutSubmitting(true);
    const fields: [string, string][] = [
      ['Tutor Name', tutName],
      ['Subjects & Grades', tutSubs],
      ['Qualifications & Experience', tutQuals],
      ['Location / Online', tutLocation || 'Kenya'],
      ['Contact Details', tutContact]
    ];

    const res = await submitOnlineForm('tut', 'Tutor Application', tutName, fields, tutConsent);
    setTutRef(res.ref);
    setTutWaUrl(res.whatsappUrl);
    setTutName('');
    setTutSubs('');
    setTutQuals('');
    setTutLocation('');
    setTutContact('');
    setTutConsent(false);
    setTutSubmitting(false);
  };

  return (
    <section className="sec mb board" id="tutoring" aria-labelledby="tuh">
      <div className="w">
        <h2 className="sh" id="tuh">{copy.title}</h2>
        <p className="sub">{copy.subtitle}</p>

        <div className="x2" style={{ marginBottom: '3rem' }}>
          {/* MATHS PRACTICE GENERATOR */}
          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '20px', padding: '1.8rem', color: '#fff' }}>
            <h3 style={{ color: '#fff', fontSize: '1.35rem', marginBottom: '0.8rem' }}>🔢 Daily Maths Practice</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem' }}>Operation:</label>
                <select className="sel" value={op} onChange={(e) => setOp(e.target.value as any)}>
                  <option value="+">Addition (+)</option>
                  <option value="−">Subtraction (−)</option>
                  <option value="×">Multiplication (×)</option>
                  <option value="÷">Division (÷)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem' }}>Difficulty:</label>
                <select className="sel" value={level} onChange={(e) => setLevel(Number(e.target.value) as any)}>
                  <option value={1}>1. Easy (Primary)</option>
                  <option value={2}>2. Medium (Junior)</option>
                  <option value={3}>3. Hard (Advanced)</option>
                </select>
              </div>
            </div>

            <button className="gb" onClick={generateProblems} style={{ width: '100%', marginBottom: '1rem' }}>
              Generate New Set of 5 Problems
            </button>

            {problems.length > 0 && (
              <div style={{ display: 'grid', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px' }}>
                {problems.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                      {idx + 1}. {p.a} {op} {p.b} =
                    </span>
                    <input
                      className="sel"
                      type="number"
                      value={userAnswers[idx] || ''}
                      onChange={(e) => {
                        const next = [...userAnswers];
                        next[idx] = e.target.value;
                        setUserAnswers(next);
                      }}
                      style={{ width: '90px', padding: '0.3rem 0.5rem', textAlign: 'center' }}
                    />
                  </div>
                ))}

                <button className="gb o" onClick={checkPracticeAnswers} style={{ marginTop: '0.5rem' }}>
                  Check Answers
                </button>

                {practiceResult && (
                  <p style={{ fontWeight: 700, color: '#f4a261', marginTop: '0.4rem', textAlign: 'center', fontSize: '1.05rem' }}>
                    {practiceResult}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* FIND A TUTOR FORM */}
          <div className="fm fm-light">
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>Find an accredited tutor</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              Parents can request targeted 1-on-1 tutoring in CBC subjects, KCSE revision, or remedial numeracy.
            </p>

            {findRef ? (
              <div className="fm-confirm-box">
                <h4>✅ Tutor Request Logged</h4>
                <p style={{ fontSize: '0.9rem', margin: '0.45rem 0 0.8rem' }}>
                  Reference Code: <b>{findRef}</b>. Track status in <Link href="/activity" style={{ textDecoration: 'underline', fontWeight: 700, color: '#14532d' }}>My Activity</Link>.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {findWaUrl && (
                    <a className="btn wab" href={findWaUrl} target="_blank" rel="noopener" style={{ margin: 0, padding: '0.5rem 1rem', fontSize: '0.86rem' }}>
                      Send on WhatsApp →
                    </a>
                  )}
                  <button className="gb" onClick={() => setFindRef(null)} style={{ margin: 0 }}>
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFindTutor}>
                <div className="fm-grid-2">
                  <div>
                    <label htmlFor="ft-sub">Subject:</label>
                    <input id="ft-sub" className="sel" type="text" value={findSubject} onChange={(e) => setFindSubject(e.target.value)} required placeholder="e.g. Mathematics" />
                  </div>
                  <div>
                    <label htmlFor="ft-grd">Grade or Level:</label>
                    <input id="ft-grd" className="sel" type="text" value={findGrade} onChange={(e) => setFindGrade(e.target.value)} required placeholder="e.g. Grade 8" />
                  </div>
                </div>

                <div className="fm-grid-2" style={{ marginTop: '0.6rem' }}>
                  <div>
                    <label htmlFor="ft-mod">Mode:</label>
                    <select id="ft-mod" className="sel" value={findMode} onChange={(e) => setFindMode(e.target.value)}>
                      <option value="Online">Online</option>
                      <option value="In person">In person</option>
                      <option value="Either">Either</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ft-loc">Location / Town:</label>
                    <input id="ft-loc" className="sel" type="text" value={findLocation} onChange={(e) => setFindLocation(e.target.value)} placeholder="e.g. Ruiru, Kiambu" />
                  </div>
                </div>

                <div style={{ marginTop: '0.6rem' }}>
                  <label htmlFor="ft-cnt">Parent / Guardian Phone or Email:</label>
                  <input id="ft-cnt" className="sel" type="text" value={findContact} onChange={(e) => setFindContact(e.target.value)} required placeholder="e.g. 0722000000" />
                </div>

                <label className="ck" style={{ fontSize: '0.82rem' }}>
                  <input type="checkbox" checked={findConsent} onChange={(e) => setFindConsent(e.target.checked)} required />
                  <span>I agree to be contacted by verified tutors. Learners under 18 require parent supervision.</span>
                </label>

                <button type="submit" className="btn b1" disabled={findSubmitting || !findConsent} style={{ width: '100%', minHeight: '44px' }}>
                  {findSubmitting ? 'Sending Request...' : 'Send Tutor Request'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* BECOME A TUTOR FORM */}
        <div className="fm fm-light" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Apply to become a tutor</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            Join our registry of vetted educators. Tutors must hold valid credentials or university transcripts.
          </p>

          {tutRef ? (
            <div className="fm-confirm-box">
              <h4>✅ Tutor Application Received</h4>
              <p style={{ fontSize: '0.92rem', margin: '0.45rem 0 0.85rem' }}>
                Reference Code: <b>{tutRef}</b>. Track verification in <Link href="/activity" style={{ textDecoration: 'underline', fontWeight: 700, color: '#14532d' }}>My Activity</Link>.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {tutWaUrl && (
                  <a className="btn wab" href={tutWaUrl} target="_blank" rel="noopener" style={{ margin: 0, padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
                    Send on WhatsApp →
                  </a>
                )}
                <button className="gb" onClick={() => setTutRef(null)} style={{ margin: 0 }}>
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApplyTutor}>
              <div className="fm-grid-2">
                <div>
                  <label htmlFor="tt-name">Full Name:</label>
                  <input id="tt-name" className="sel" type="text" value={tutName} onChange={(e) => setTutName(e.target.value)} required placeholder="e.g. Samuel Mutua" />
                </div>
                <div>
                  <label htmlFor="tt-sub">Subjects & Target Grades:</label>
                  <input id="tt-sub" className="sel" type="text" value={tutSubs} onChange={(e) => setTutSubs(e.target.value)} required placeholder="e.g. Grade 7-9 Science & Maths" />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label htmlFor="tt-qual">Qualifications & Teaching Experience:</label>
                <textarea
                  id="tt-qual"
                  className="sel"
                  rows={3}
                  value={tutQuals}
                  onChange={(e) => setTutQuals(e.target.value)}
                  required
                  placeholder="Detail your degree/diploma, TSC status, and tutoring background..."
                />
              </div>

              <div className="fm-grid-2" style={{ marginTop: '0.8rem' }}>
                <div>
                  <label htmlFor="tt-loc">Location / Mode:</label>
                  <input id="tt-loc" className="sel" type="text" value={tutLocation} onChange={(e) => setTutLocation(e.target.value)} placeholder="e.g. Nairobi (Online & Physical)" />
                </div>
                <div>
                  <label htmlFor="tt-cnt">Phone / Email:</label>
                  <input id="tt-cnt" className="sel" type="text" value={tutContact} onChange={(e) => setTutContact(e.target.value)} required placeholder="e.g. 0712345678" />
                </div>
              </div>

              <label className="ck">
                <input type="checkbox" checked={tutConsent} onChange={(e) => setTutConsent(e.target.checked)} required />
                <span>I confirm my qualifications are authentic and consent to teacher identity verification.</span>
              </label>

              <button type="submit" className="btn b1" disabled={tutSubmitting || !tutConsent} style={{ minHeight: '48px', width: '100%' }}>
                {tutSubmitting ? 'Submitting Application...' : 'Apply as Tutor'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
