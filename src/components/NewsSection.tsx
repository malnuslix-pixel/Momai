'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ARTICLES, Article } from '@/lib/mwalimu-data';

interface NewsSectionProps {
  onNavClick: (hash: string) => void;
  activeStoryId: string | null;
  onSelectStory: (id: string | null) => void;
}

export default function NewsSection({ onNavClick, activeStoryId, onSelectStory }: NewsSectionProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'all' | 'Education' | 'Explainer'>('all');

  const storyList = Object.values(ARTICLES);
  const activeStory = activeStoryId ? ARTICLES[activeStoryId] : null;

  const filtered = storyList.filter((a) => {
    const matchCat = category === 'all' || a.l === category;
    const matchSearch = !search.trim() || a.t.toLowerCase().includes(search.toLowerCase()) || a.c.some(p => p.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // If a story is open in reader view:
  if (activeStory) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}#/s${activeStory.id.slice(1)}` : '';
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${activeStory.t} ${shareUrl}`)}`;

    return (
      <article className="art" style={{ paddingTop: '7rem' }}>
        <button
          onClick={() => onSelectStory(null)}
          className="bkb"
          style={{ marginBottom: '1.2rem' }}
        >
          ← Back to All News
        </button>

        <h1>{activeStory.t}</h1>
        <p className="by">
          <span className="lab">{activeStory.l}</span>
          By Mwalimu Family News Desk · Published {activeStory.d}
        </p>

        {activeStory.k && (
          <div className="warn">
            <h3 style={{ color: 'var(--hd)' }}>Key facts</h3>
            <ul className="kf">
              {activeStory.k.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {activeStory.c.map((para, idx) => (
          <p key={idx}>{para}</p>
        ))}

        {activeStory.m && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>What it means for you</h2>
            {activeStory.m.map((txt, idx) => (
              <p key={idx}>{txt}</p>
            ))}
          </>
        )}

        {activeStory.q && (
          <>
            <h2 style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Frequently asked questions</h2>
            <div className="fq">
              {activeStory.q.map(([q, ans], idx) => (
                <details key={idx}>
                  <summary>{q}</summary>
                  <p>{ans}</p>
                </details>
              ))}
            </div>
          </>
        )}

        <div style={{ margin: '2rem 0' }}>
          <a className="btn wab" href={waUrl} target="_blank" rel="noopener">
            Share on WhatsApp
          </a>
        </div>

        <p className="src">
          <strong>Sources:</strong> Ministry of Education, KNEC. <strong>Corrections:</strong> none to date.
        </p>

        {activeStory.r && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.8rem' }}>Related stories</h3>
            {activeStory.r.map((relId) => {
              const rel = ARTICLES[relId];
              if (!rel) return null;
              return (
                <p key={relId}>
                  <a
                    href={`#/${relId}`}
                    className="dl"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectStory(relId);
                    }}
                  >
                    {rel.t} →
                  </a>
                </p>
              );
            })}
          </div>
        )}
      </article>
    );
  }

  const featured = ARTICLES.s1;

  return (
    <section className="sec" id="news" aria-labelledby="nh">
      <div className="w">
        <h2 className="sh" id="nh">Latest news</h2>
        <p className="sub">What’s happening in education and across Kenya. Browse by category.</p>

        <div className="sb">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search news stories..."
            aria-label="Search news"
          />
        </div>

        <div className="chips" role="group" aria-label="News categories">
          {(['all', 'Education', 'Explainer'] as const).map((cat) => (
            <button
              key={cat}
              className={`chip ${category === cat ? 'on' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Featured Story */}
        {featured && (!search || category === 'all' || category === featured.l) && (
          <article className="feat">
            <div>
              <p className="meta">{featured.l} · {featured.d} · National examinations</p>
              <h3>{featured.t}</h3>
              <p style={{ margin: '1rem 0 1.4rem' }}>{featured.c[0]}</p>
              <button
                className="btn b1"
                onClick={() => onSelectStory('s1')}
              >
                Read the full story
              </button>
            </div>
            <div className="stats">
              <div><b>1,048,355</b><span>KCSE candidates</span></div>
              <div><b>10,693</b><span>examination centres</span></div>
              <div><b>13,484</b><span>KJSEA examiners</span></div>
              <div><b>24</b><span>KJSEA marking centres</span></div>
            </div>
          </article>
        )}

        {/* Stories List */}
        <div className="rows">
          {filtered.map((item) => (
            <a
              key={item.id}
              href={`#/${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectStory(item.id);
              }}
            >
              <time>{item.d}</time>
              <span className="tag">{item.l}</span>
              <h3>{item.t}</h3>
              <span className="dl">Read Story →</span>
            </a>
          ))}

          {filtered.length === 0 && (
            <p className="empty">No stories match your search. Follow @mwalimufamily on WhatsApp for updates.</p>
          )}
        </div>

        {/* View More News CTA */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/news"
            className="btn b1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.85rem 2.2rem',
              fontSize: '1.05rem',
              textDecoration: 'none'
            }}
          >
            📰 View More News & Updates →
          </Link>
        </div>
      </div>
    </section>
  );
}
