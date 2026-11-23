'use client';

import React from 'react';

export default function VideosSection() {
  const VIDEOS = [
    {
      title: 'Mini Lessons',
      desc: 'Concise 10-minute CBC curriculum video lessons on Mathematics, Science and English grammar concepts.',
      tag: 'Curriculum'
    },
    {
      title: 'Family Vlogs',
      desc: 'Day-in-the-life routines, school visits, parenting conversations, and educational outings across Kenya.',
      tag: 'Family Life'
    },
    {
      title: 'School Celebrations',
      desc: 'Graduations, prize-giving days, sports competitions, holidays, and milestones celebrating learner success.',
      tag: 'Celebration'
    }
  ];

  return (
    <section className="sec alt" id="videos" aria-labelledby="vh" style={{ paddingLeft: 0, paddingRight: 0 }}>
      <div className="w">
        <div className="hh">
          <div>
            <h2 className="sh rv" id="vh">Watch and learn</h2>
            <p className="sub rv">
              Educational lessons, parent guidance discussions and family documentaries on our official YouTube channel.
            </p>
          </div>
        </div>
      </div>

      <div className="vs" tabIndex={0} aria-label="Video categories" style={{ marginTop: '1.5rem' }}>
        {VIDEOS.map((v, idx) => (
          <a
            key={idx}
            href="https://youtube.com/@mwalimufamily"
            target="_blank"
            rel="noopener"
            className="v"
            style={{ textDecoration: 'none' }}
          >
            <span className="play" aria-hidden="true">▶</span>
            <div>
              <span className="tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '0.5rem', display: 'inline-block' }}>
                {v.tag}
              </span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Subscribe CTA Placed Below Video Cards */}
      <div className="w" style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <a
          className="btn b1"
          href="https://youtube.com/@mwalimufamily"
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 2.2rem',
            fontSize: '1.05rem',
            textDecoration: 'none',
            background: '#cc0000',
            color: '#ffffff',
            borderRadius: '999px',
            boxShadow: '0 4px 18px rgba(204, 0, 0, 0.28)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Subscribe on YouTube (@mwalimufamily) →
        </a>
      </div>
    </section>
  );
}
