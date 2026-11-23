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
          <a
            className="btn b1"
            href="https://youtube.com/@mwalimufamily"
            target="_blank"
            rel="noopener"
            style={{ width: 'fit-content' }}
          >
            Subscribe on YouTube →
          </a>
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
    </section>
  );
}
