'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { submitOnlineForm } from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

interface NoticeDisplay {
  category: string;
  date: string;
  title: string;
  body: string;
  url: string;
  isLive?: boolean;
}

const INITIAL_NOTICES: NoticeDisplay[] = [
  {
    category: 'Exams',
    date: '20 Nov 2026',
    title: 'Results release windows targeted by Ministry of Education',
    body: 'Education CS Julius Ogamba confirmed that KJSEA results are expected in December 2026, while KCSE and KPSEA results are targeted for January 2027.',
    url: '/news/s1'
  },
  {
    category: 'Safety',
    date: '21 Nov 2026',
    title: 'Results scam alert: Never pay anyone claiming early access',
    body: 'KNEC and MoE remind families that results are accessible strictly via official SMS codes and verified portals without any advance payment.',
    url: '/news/s4'
  },
  {
    category: 'Community',
    date: '18 Nov 2026',
    title: 'Schools and community organisations announcement desk',
    body: 'Registered educational charities, schools, and alumni groups can submit verified community education notices for publication.',
    url: ''
  }
];

const CHECKLIST = {
  en: [
    'Wait for official KJSEA results announcements',
    'Talk with your child about interests and strengths',
    'Read the Ministry’s guidance on senior school pathways',
    'Note the school selection steps and deadlines when announced',
    'Keep your child’s documents together in one safe folder'
  ],
  sw: [
    'Subiri matangazo rasmi ya matokeo ya KJSEA',
    'Zungumza na mtoto wako kuhusu vipaji na mapendeleo yake',
    'Soma mwongozo wa Wizara kuhusu mikondo ya shule ya sekondari ya juu',
    'Andika hatua na tarehe za kuchagua shule zitakapotangazwa',
    'Weka nyaraka za mtoto wako mahali pamoja na salama'
  ]
};

export default function NoticesSection() {
  const [noticeCategory, setNoticeCategory] = useState('All');
  const [notices, setNotices] = useState<NoticeDisplay[]>(INITIAL_NOTICES);
  const [lang, setLang] = useLanguage();
  const copy = useSectionCopy('notices', lang);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [kjseaCountdown, setKjseaCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [kcseCountdown, setKcseCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  // Submit Notice Form
  const [org, setOrg] = useState('');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDetails, setNoticeDetails] = useState('');
  const [noticeContact, setNoticeContact] = useState('');
  const [noticeConsent, setNoticeConsent] = useState(false);
  const [noticeSubmitting, setNoticeSubmitting] = useState(false);
  const [noticeRef, setNoticeRef] = useState<string | null>(null);
  const [noticeWaUrl, setNoticeWaUrl] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('g10_checks');
      if (stored) setCheckedItems(JSON.parse(stored));
    } catch {}

    fetch('/api/items?k=notice')
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.items) && data.items.length > 0) {
          const liveNotices: NoticeDisplay[] = data.items.map((item: any) => ({
            category: item.cat || 'Community',
            date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Verified',
            title: item.t,
            body: item.body,
            url: '',
            isLive: true,
          }));
          const seen = new Set<string>();
          const merged = [...liveNotices, ...INITIAL_NOTICES].filter((n) => {
            const key = n.title.trim().toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          setNotices(merged);
        }
      })
      .catch(() => {});

    const updateCountdowns = () => {
      const now = new Date().getTime();
      const kjseaTarget = new Date(2026, 11, 1).getTime(); // Dec 1 2026
      const kcseTarget = new Date(2027, 0, 1).getTime();  // Jan 1 2027

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

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCheck = (idx: number) => {
    const next = [...checkedItems];
    next[idx] = !next[idx];
    setCheckedItems(next);
    try {
      localStorage.setItem('g10_checks', JSON.stringify(next));
    } catch {}
  };

  const completedCount = checkedItems.filter(Boolean).length;
  const progressPct = Math.round((completedCount / checkedItems.length) * 100);

  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !noticeTitle || !noticeDetails || !noticeContact || !noticeConsent) return;

    setNoticeSubmitting(true);
    const fields: [string, string][] = [
      ['Organisation', org],
      ['Notice Title', noticeTitle],
      ['Details & Dates', noticeDetails],
      ['Official Contact', noticeContact]
    ];

    const res = await submitOnlineForm('note', 'Notice', noticeTitle, fields, noticeConsent);
    setNoticeRef(res.ref);
    setNoticeWaUrl(res.whatsappUrl);
    setOrg('');
    setNoticeTitle('');
    setNoticeDetails('');
    setNoticeContact('');
    setNoticeConsent(false);
    setNoticeSubmitting(false);
  };

  const categories = ['All', ...Array.from(new Set(notices.map((n) => n.category)))];
  const filteredNotices = notices.filter(n => {
    if (noticeCategory === 'All') return true;
    return n.category === noticeCategory;
  });

  return (
    <section className="sec cine c2 mb board" id="notices" aria-labelledby="nth">
      <div className="gy" aria-hidden="true" />
      <div className="w">
        <h2 className="sh" id="nth">{copy.title}</h2>
        <p className="sub">{copy.subtitle}</p>

        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>Before you act on a notice</h3>
          <ul className="kf">
            <li>Check who issued it and the date of announcement.</li>
            <li>Confirm through the official school office or ministry website.</li>
            <li>Never pay to receive a service that should be free.</li>
          </ul>
        </div>

        {/* Notice Category Filter */}
        <div className="chips" style={{ margin: '1.5rem 0' }}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`chip ${noticeCategory === cat ? 'on' : ''}`}
              onClick={() => setNoticeCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notices Grid */}
        <div className="x2" style={{ marginBottom: '2.5rem' }}>
          {filteredNotices.map((n, idx) => (
            <div key={idx} style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.5rem' }}>
              <span className="tag">{n.category} · {n.date}</span>
              <h3 style={{ color: '#fff', fontSize: '1.25rem', marginTop: '0.5rem' }}>{n.title}</h3>
              <p style={{ color: '#d6efd6', fontSize: '0.92rem', margin: '0.6rem 0', whiteSpace: 'pre-line' }}>{n.body}</p>
              {n.url && (
                <Link className="dl" href={n.url} style={{ color: '#f4a261', fontWeight: 700 }}>
                  Read the story →
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="eg" style={{ marginTop: '2rem' }}>
          {/* Live Countdowns */}
          <div className="gl">
            <h3>Live results countdowns</h3>
            <p>KJSEA results targeted window (December 2026):</p>
            <div className="clk">
              <div><b>{kjseaCountdown.d}</b><small>days</small></div>
              <div><b>{kjseaCountdown.h}</b><small>hrs</small></div>
              <div><b>{kjseaCountdown.m}</b><small>min</small></div>
              <div><b>{kjseaCountdown.s}</b><small>sec</small></div>
            </div>

            <p style={{ marginTop: '1.2rem' }}>KCSE and KPSEA targeted window (January 2027):</p>
            <div className="clk">
              <div><b>{kcseCountdown.d}</b><small>days</small></div>
              <div><b>{kcseCountdown.h}</b><small>hrs</small></div>
              <div><b>{kcseCountdown.m}</b><small>min</small></div>
              <div><b>{kcseCountdown.s}</b><small>sec</small></div>
            </div>
          </div>

          {/* Placement Checklist */}
          <div className="gl ckl">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h3 style={{ margin: 0 }}>Grade 10 placement checklist</h3>
              <button
                className="gb o"
                onClick={() => setLang(lang === 'en' ? 'sw' : 'en')}
                style={{ padding: '0.2rem 0.7rem', fontSize: '0.8rem', margin: 0 }}
              >
                {lang === 'en' ? 'Kiswahili' : 'English'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f4a261', fontFamily: 'Fraunces, serif' }}>
                {progressPct}%
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', height: '10px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPct}%`, background: '#f4a261', height: '100%', transition: 'width 0.4s' }} />
              </div>
            </div>

            {CHECKLIST[lang].map((item, idx) => (
              <label key={idx} style={{ cursor: 'pointer', padding: '0.25rem 0' }}>
                <input
                  type="checkbox"
                  checked={checkedItems[idx] || false}
                  onChange={() => handleCheck(idx)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ textDecoration: checkedItems[idx] ? 'line-through' : 'none', opacity: checkedItems[idx] ? 0.7 : 1 }}>
                  {item}
                </span>
              </label>
            ))}

            {progressPct === 100 && (
              <p style={{ fontWeight: 700, color: '#a3f0a3', marginTop: '0.8rem' }}>
                🎉 {lang === 'en' ? 'All done. Well prepared!' : 'Umemaliza. Hongera!'}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT A NOTICE FORM */}
        <div className="fm fm-light" style={{ maxWidth: '640px', margin: '3rem auto 0' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Submit a notice for review</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            Schools, institutions and community groups can submit official announcements. Our desk verifies them before publication.
          </p>

          {noticeRef ? (
            <div className="fm-confirm-box">
              <h4>✅ Notice Submitted for Review</h4>
              <p style={{ fontSize: '0.92rem', margin: '0.45rem 0 0.85rem' }}>
                Reference Code: <b>{noticeRef}</b>. Track status in <Link href="/activity" style={{ textDecoration: 'underline', fontWeight: 700, color: '#14532d' }}>My Activity</Link> while our editorial desk verifies your notice.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {noticeWaUrl && (
                  <a className="btn wab" href={noticeWaUrl} target="_blank" rel="noopener" style={{ margin: 0, padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
                    Send Copy on WhatsApp →
                  </a>
                )}
                <button className="gb" onClick={() => setNoticeRef(null)} style={{ margin: 0 }}>
                  Submit Another Notice
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitNotice}>
              <div className="fm-grid-2">
                <div>
                  <label htmlFor="nt-org">Organisation / School:</label>
                  <input id="nt-org" className="sel" type="text" value={org} onChange={(e) => setOrg(e.target.value)} required placeholder="e.g. Nairobi Teachers Forum" />
                </div>
                <div>
                  <label htmlFor="nt-title">Notice Title:</label>
                  <input id="nt-title" className="sel" type="text" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} required placeholder="e.g. Free Term 1 CBC Workshop" />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label htmlFor="nt-det">Details & Dates:</label>
                <textarea
                  id="nt-det"
                  className="sel"
                  rows={4}
                  value={noticeDetails}
                  onChange={(e) => setNoticeDetails(e.target.value)}
                  required
                  placeholder="State the date, venue, target audience, and key information..."
                />
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label htmlFor="nt-contact">Official Contact (Email / Phone):</label>
                <input id="nt-contact" className="sel" type="text" value={noticeContact} onChange={(e) => setNoticeContact(e.target.value)} required placeholder="e.g. info@organisation.or.ke" />
              </div>

              <label className="ck">
                <input
                  type="checkbox"
                  checked={noticeConsent}
                  onChange={(e) => setNoticeConsent(e.target.checked)}
                  required
                />
                <span>I confirm this notice is accurate and from my organisation.</span>
              </label>

              <button
                type="submit"
                className="btn b1"
                disabled={noticeSubmitting || !noticeConsent}
                style={{ minHeight: '48px', width: '100%' }}
              >
                {noticeSubmitting ? 'Submitting Notice...' : 'Send Notice for Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
