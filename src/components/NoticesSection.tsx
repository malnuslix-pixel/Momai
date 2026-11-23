'use client';

import React, { useState, useEffect } from 'react';

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
  const [lang, setLang] = useState<'en' | 'sw'>('en');
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false, false]);
  const [kjseaCountdown, setKjseaCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [kcseCountdown, setKcseCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('g10_checks');
      if (stored) setCheckedItems(JSON.parse(stored));
    } catch {}

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

  return (
    <section className="sec cine c2 mb board" id="notices" aria-labelledby="nth">
      <div className="gy" aria-hidden="true" />
      <div className="w">
        <h2 className="sh" id="nth">Notice board</h2>
        <p className="sub">Education notices, deadlines and community announcements. Always confirm exact details with the issuing office.</p>

        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>Before you act on a notice</h3>
          <ul className="kf">
            <li>Check who issued it and the date.</li>
            <li>Confirm through the official office or website.</li>
            <li>Never pay to receive a service that should be free.</li>
          </ul>
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
                onClick={() => setLang(l => l === 'en' ? 'sw' : 'en')}
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
      </div>
    </section>
  );
}
