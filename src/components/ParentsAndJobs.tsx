'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { downloadSchoolCalendar, submitOnlineForm } from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

interface ParentsAndJobsProps {
  onNavClick: (hash: string) => void;
  mode?: 'all' | 'parents' | 'jobs';
}

interface JobListing {
  title: string;
  employer: string;
  location: string;
  category: string;
  desc: string;
  featured: boolean;
}

const SAMPLE_JOBS: JobListing[] = [
  {
    title: 'Junior School Mathematics & Science Teacher',
    employer: 'Greenwood Academy',
    location: 'Nairobi',
    category: 'Teaching',
    desc: 'Seeking a registered TSC teacher competent in CBC Grade 7-9 Integrated Science and Mathematics. 2+ years experience.',
    featured: true
  },
  {
    title: 'Senior School Biology & Agriculture Educator',
    employer: 'St. Teresa Secondary',
    location: 'Nakuru',
    category: 'Teaching',
    desc: 'Full-time position for Grade 10 STEM pathway educator. Must have valid TSC certificate and degree in education.',
    featured: false
  },
  {
    title: 'Evening KCSE Mathematics Tutor',
    employer: 'Apex Tuition Centre',
    location: 'Mombasa',
    category: 'Tutoring',
    desc: 'Part-time physical and online evening revision tutor for Form 3 and 4 candidates.',
    featured: false
  },
  {
    title: 'School Administrator & Bursar',
    employer: 'Hillcrest Prep School',
    location: 'Eldoret',
    category: 'School management',
    desc: 'Responsible for fees collection, procurement, NEMIS data management, and day-to-day operations.',
    featured: true
  }
];

export default function ParentsAndJobs({ onNavClick, mode = 'all' }: ParentsAndJobsProps) {
  const [lang] = useLanguage();
  const parentsCopy = useSectionCopy('parents', lang);
  const jobsCopy = useSectionCopy('jobs', lang);
  // Term Calendar
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

  // Jobs Search & Filter (hydrated with live published vacancies from /api/items)
  const [jobs, setJobs] = useState<JobListing[]>(SAMPLE_JOBS);
  const [jobCategory, setJobCategory] = useState('');
  const [jobQuery, setJobQuery] = useState('');

  useEffect(() => {
    fetch('/api/items?k=job')
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items) && data.items.length > 0) {
          const liveJobs: JobListing[] = data.items.map((item: any) => ({
            title: item.t,
            employer: item.who || 'Verified Institution',
            location: item.loc || 'Kenya',
            category: item.cat || 'Teaching',
            desc: item.body,
            featured: Boolean(item.featured),
          }));
          const seen = new Set<string>();
          const merged = [...liveJobs, ...SAMPLE_JOBS].filter((j) => {
            const key = `${j.title}::${j.employer}`.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setJobs(merged);
        }
      })
      .catch(() => {});
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesCat = !jobCategory || j.category === jobCategory;
    const matchesQuery = !jobQuery ||
      (j.title + ' ' + j.employer + ' ' + j.location + ' ' + j.desc).toLowerCase().includes(jobQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Post a Job Form State
  const [employer, setEmployer] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [postCategory, setPostCategory] = useState('Teaching');
  const [visibility, setVisibility] = useState('Standard listing');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [desc, setDesc] = useState('');
  const [jobConsent, setJobConsent] = useState(false);
  const [jobSubmitting, setJobSubmitting] = useState(false);
  const [jobRef, setJobRef] = useState<string | null>(null);
  const [jobWaUrl, setJobWaUrl] = useState('');

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employer || !jobTitle || !contact || !desc || !jobConsent) return;

    setJobSubmitting(true);
    const fields: [string, string][] = [
      ['Employer / School', employer],
      ['Job Title', jobTitle],
      ['Category', postCategory],
      ['Visibility', visibility],
      ['Location / County', location || 'Kenya'],
      ['How to Apply', contact],
      ['Description & Deadline', desc]
    ];

    const res = await submitOnlineForm('job', 'Job Listing', jobTitle, fields, jobConsent);
    setJobRef(res.ref);
    setJobWaUrl(res.whatsappUrl);
    setEmployer('');
    setJobTitle('');
    setLocation('');
    setContact('');
    setDesc('');
    setJobConsent(false);
    setJobSubmitting(false);
  };

  return (
    <>
      {/* PARENTS HUB SECTION */}
      {mode !== 'jobs' && (
      <section className="sec" id="parents" aria-labelledby="ph">
        <div className="w">
          <h2 className="sh rv" id="ph">{parentsCopy.title}</h2>
          <p className="sub rv">{parentsCopy.subtitle}</p>

          <h3 style={{ fontSize: '1.4rem', margin: '2rem 0 1rem' }}>Grade 10 Senior School pathways</h3>
          <div className="ex3">
            <div>
              <h3>🔬 STEM Pathway</h3>
              <dl>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Suits learners who</dt>
                <dd>enjoy experiments, problem solving, mathematics and building machines.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Tracks</dt>
                <dd>Pure Sciences, Applied Sciences, Technical & Engineering Studies.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Careers</dt>
                <dd>Engineering, medicine, computing/AI, architecture, agriculture, TVET technical trades.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Ask the school</dt>
                <dd>Which laboratory equipment, computing labs and teacher specialisations are available?</dd>
              </dl>
            </div>

            <div>
              <h3>📚 Social Sciences</h3>
              <dl>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Suits learners who</dt>
                <dd>excel in reading, debate, creative writing, history, citizenship and business.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Tracks</dt>
                <dd>Languages & Literature, Humanities, Business Studies.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Careers</dt>
                <dd>Law, journalism, teaching, public service, entrepreneurship, international relations.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Ask the school</dt>
                <dd>Which subject combinations and humanities options does the school offer?</dd>
              </dl>
            </div>

            <div>
              <h3>🎨 Arts and Sports Science</h3>
              <dl>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Suits learners who</dt>
                <dd>have strong creative or athletic talents and practical expression.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Tracks</dt>
                <dd>Sports Science, Performing Arts (Music/Theatre), Visual Arts.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Careers</dt>
                <dd>Professional athletics, sports coaching, media design, film production, music, fine arts.</dd>
                <dt style={{ fontWeight: 700, color: 'var(--gl)', marginTop: '0.5rem' }}>Ask the school</dt>
                <dd>What sports facilities, coaching programs and arts studios are in place?</dd>
              </dl>
            </div>
          </div>

          <h3 style={{ fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '0.8rem' }}>
            Questions to ask at a parent-teacher meeting
          </h3>
          <ol className="jn" style={{ lineHeight: 1.8, fontSize: '0.98rem' }}>
            <li>How is my child progressing against the expected CBC competencies in their grade?</li>
            <li>Which specific subjects or learning strands require extra guidance and revision at home?</li>
            <li>How are formative classroom assessments and practical projects recorded in their portfolio?</li>
            <li>Which pathway do my child’s academic strengths and interests suggest for Senior School?</li>
            <li>What is the school’s emergency contact policy between regular term meetings?</li>
          </ol>

          {/* Official Educational Links */}
          <h3 style={{ fontSize: '1.35rem', marginTop: '2.5rem', marginBottom: '1rem' }}>
            Guides and official portals
          </h3>
          <div className="x2">
            <a className="x2c" href="https://www.kuccps.net" target="_blank" rel="noopener">
              <h3>University & College Placement</h3>
              <p>KUCCPS portal for university course cut-offs, cluster points, and TVET placement.</p>
            </a>
            <a className="x2c" href="https://www.helb.co.ke" target="_blank" rel="noopener">
              <h3>HELB Student Loans</h3>
              <p>Apply for higher education loans and bursaries directly on the official HELB site.</p>
            </a>
            <a className="x2c" href="https://www.education.go.ke" target="_blank" rel="noopener">
              <h3>Ministry of Education</h3>
              <p>Official circulars, school term calendar, NEMIS/UPI and capitation updates.</p>
            </a>
            <a className="x2c" href="https://www.knec.ac.ke" target="_blank" rel="noopener">
              <h3>KNEC Examination Portal</h3>
              <p>Official results portals, examination schedules, and timetable confirmations.</p>
            </a>
          </div>

          {/* School Term Calendar Generator */}
          <div className="card" style={{ marginTop: '2.5rem' }}>
            <h3>My school calendar downloader</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--mu)' }}>
              Set your school&apos;s term opening and closing dates, then download an `.ics` calendar file to automatically sync dates to your phone:
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

          {/* Where Next */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--ln)', paddingTop: '1.5rem' }}>
            <h4 style={{ color: '#86efac', marginBottom: '0.6rem', fontSize: '1.05rem' }}>Where next?</h4>
            <div className="chips">
              <Link className="chip on" href="/notices">Notice Board →</Link>
              <Link className="chip on" href="/tools">Pathway Starter →</Link>
              <Link className="chip on" href="/learn">Learning Library →</Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* EDUCATION JOBS SECTION */}
      {mode !== 'parents' && (
      <section className="sec mb bp" id="jobs" aria-labelledby="jbh">
        <div className="w">
          <h2 className="sh" id="jbh">{jobsCopy.title}</h2>
          <p className="sub">{jobsCopy.subtitle}</p>

          {/* Search & Category Filter */}
          <div className="fl" style={{ marginBottom: '1.5rem' }}>
            <input
              className="sel"
              type="search"
              placeholder="Search jobs, e.g. Mathematics, Mombasa..."
              value={jobQuery}
              onChange={(e) => setJobQuery(e.target.value)}
              style={{ width: 'auto', minWidth: '240px' }}
            />
            <select
              className="sel"
              value={jobCategory}
              onChange={(e) => setJobCategory(e.target.value)}
              style={{ width: 'auto', minWidth: '180px' }}
            >
              <option value="">All categories</option>
              <option value="Teaching">Teaching</option>
              <option value="School management">School management</option>
              <option value="Support staff">Support staff</option>
              <option value="Tutoring">Tutoring</option>
            </select>
          </div>

          {/* Job Listings Grid */}
          <div className="x2" style={{ marginBottom: '2.5rem' }}>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((j, idx) => (
                <div key={idx} style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.5rem' }}>
                  {j.featured && <span className="lab" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>Featured Listing</span>}
                  <span className="tag">{j.category} · {j.location}</span>
                  <h3 style={{ color: '#fff', fontSize: '1.3rem', marginTop: '0.5rem' }}>{j.title}</h3>
                  <p style={{ color: '#b8c2b9', fontWeight: 600, fontSize: '0.95rem' }}>{j.employer}</p>
                  <p style={{ color: '#d6efd6', fontSize: '0.9rem', margin: '0.6rem 0' }}>{j.desc}</p>
                  <a
                    className="dl"
                    href={`https://wa.me/254715363944?text=${encodeURIComponent(`Hello, I am enquiring about the ${j.title} position at ${j.employer}.`)}`}
                    target="_blank"
                    rel="noopener"
                    style={{ color: '#f4a261', fontWeight: 700 }}
                  >
                    Apply / Enquire via Mwalimu Desk →
                  </a>
                </div>
              ))
            ) : (
              <p style={{ color: '#fff' }}>No vacancies currently match your search filter.</p>
            )}
          </div>

          {/* Job Advice Cards */}
          <div className="x2" style={{ marginBottom: '3rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 style={{ color: '#fff' }}>Tips for Teacher Applicants</h3>
              <ul className="kf" style={{ color: '#fff', opacity: 0.9 }}>
                <li>Confirm your TSC registration status and certificate validity.</li>
                <li>Tailor your CV to the specific CBC learning area.</li>
                <li>Never send money or pay an interview or processing fee.</li>
              </ul>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <h3 style={{ color: '#fff' }}>Spot an Employment Scam</h3>
              <ul className="kf" style={{ color: '#fff', opacity: 0.9 }}>
                <li>They request M-Pesa registration or processing fees.</li>
                <li>They use unofficial free email addresses (e.g. personal Gmail).</li>
                <li>They offer immediate placement without an interview.</li>
              </ul>
            </div>
          </div>

          {/* POST A JOB FORM */}
          <div className="fm fm-light" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Post a teaching vacancy</h3>
            <p style={{ fontSize: '0.88rem', marginBottom: '1.2rem' }}>
              Schools and education organisations can submit job vacancies for review. Once verified against our anti-scam checklist, the listing goes live.
            </p>

            {jobRef ? (
              <div className="fm-confirm-box">
                <h4>✅ Vacancy Submitted for Review</h4>
                <p style={{ fontSize: '0.92rem', margin: '0.45rem 0 0.85rem' }}>
                  Reference Code: <b>{jobRef}</b>. Track approval status in <Link href="/activity" style={{ textDecoration: 'underline', fontWeight: 700, color: '#14532d' }}>My Activity</Link>.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {jobWaUrl && (
                    <a className="btn wab" href={jobWaUrl} target="_blank" rel="noopener" style={{ margin: 0, padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
                      Send Copy on WhatsApp →
                    </a>
                  )}
                  <button className="gb" onClick={() => setJobRef(null)} style={{ margin: 0 }}>
                    Submit Another Vacancy
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePostJob}>
                <div className="fm-grid-2">
                  <div>
                    <label htmlFor="jb-emp">Employer / School Name:</label>
                    <input id="jb-emp" className="sel" type="text" value={employer} onChange={(e) => setEmployer(e.target.value)} required placeholder="e.g. Alliance High School" />
                  </div>
                  <div>
                    <label htmlFor="jb-title">Job Title:</label>
                    <input id="jb-title" className="sel" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required placeholder="e.g. Grade 8 Maths Teacher" />
                  </div>
                </div>

                <div className="fm-grid-2" style={{ marginTop: '0.8rem' }}>
                  <div>
                    <label htmlFor="jb-cat">Category:</label>
                    <select id="jb-cat" className="sel" value={postCategory} onChange={(e) => setPostCategory(e.target.value)}>
                      <option value="Teaching">Teaching</option>
                      <option value="School management">School management</option>
                      <option value="Support staff">Support staff</option>
                      <option value="Tutoring">Tutoring</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="jb-vis">Visibility:</label>
                    <select id="jb-vis" className="sel" value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                      <option value="Standard listing">Standard listing (Free)</option>
                      <option value="Featured listing">Featured listing (Top of page)</option>
                    </select>
                  </div>
                </div>

                <div className="fm-grid-2" style={{ marginTop: '0.8rem' }}>
                  <div>
                    <label htmlFor="jb-loc">Location / County:</label>
                    <input id="jb-loc" className="sel" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kiambu County" />
                  </div>
                  <div>
                    <label htmlFor="jb-contact">How to Apply (Email / Phone):</label>
                    <input id="jb-contact" className="sel" type="text" value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="e.g. jobs@school.ac.ke" />
                  </div>
                </div>

                <div style={{ marginTop: '0.8rem' }}>
                  <label htmlFor="jb-desc">Job Description, Requirements & Deadline:</label>
                  <textarea
                    id="jb-desc"
                    className="sel"
                    rows={4}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    required
                    placeholder="Provide required qualifications, TSC status, and application deadline..."
                  />
                </div>

                <label className="ck">
                  <input
                    type="checkbox"
                    checked={jobConsent}
                    onChange={(e) => setJobConsent(e.target.checked)}
                    required
                  />
                  <span>I confirm this is a genuine vacancy and no application fee will be charged to candidates.</span>
                </label>

                <button
                  type="submit"
                  className="btn b1"
                  disabled={jobSubmitting || !jobConsent}
                  style={{ minHeight: '48px', width: '100%' }}
                >
                  {jobSubmitting ? 'Submitting Vacancy...' : 'Send Vacancy for Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
