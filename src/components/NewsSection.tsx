'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useCms, useSectionCopy } from '@/lib/cms-context';

interface NewsSectionProps {
  onNavClick: (hash: string) => void;
  activeStoryId: string | null;
  onSelectStory: (id: string | null) => void;
}

export default function NewsSection({ onNavClick, activeStoryId, onSelectStory }: NewsSectionProps) {
  const [lang] = useLanguage();
  const { cms } = useCms();
  const copy = useSectionCopy('news', lang);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummarizing, setAiSummarizing] = useState(false);

  const handleSummarizeStory = async (story: Article, lang: 'en' | 'sw') => {
    setAiSummarizing(true);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'summarize',
          title: story.t,
          content: story.c.join('\n\n'),
          lang,
        }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setAiSummary(data.text);
      }
    } catch {
    } finally {
      setAiSummarizing(false);
    }
  };

  const storyList = cms.news.articles;
  const articleMap = useMemo(() => {
    const map: Record<string, Article> = {};
    for (const a of storyList) map[a.id] = a;
    return map;
  }, [storyList]);
  const categories = useMemo(
    () => ['all', ...Array.from(new Set(storyList.map((a) => a.l).filter(Boolean)))],
    [storyList]
  );
  const activeStory = activeStoryId ? articleMap[activeStoryId] || null : null;

  const filtered = storyList.filter((a) => {
    const matchCat = category === 'all' || a.l === category;
    const matchSearch = !search.trim() || a.t.toLowerCase().includes(search.toLowerCase()) || a.c.some(p => p.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  // If a story is open in reader view:
  if (activeStory) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/news/${activeStory.id}` : '';
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

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.8rem 0 1.2rem' }}>
          <button
            type="button"
            className="gb"
            onClick={() => handleSummarizeStory(activeStory, 'en')}
            disabled={aiSummarizing}
          >
            {aiSummarizing ? 'Summarizing…' : 'AI Plain Summary'}
          </button>
          <button
            type="button"
            className="gb o"
            style={{ color: 'var(--gl)', borderColor: 'var(--gl)' }}
            onClick={() => handleSummarizeStory(activeStory, 'sw')}
            disabled={aiSummarizing}
          >
            🇰🇪 Muhtasari (Kiswahili)
          </button>
        </div>

        {aiSummary && (
          <div className="note" style={{ marginTop: 0, marginBottom: '1.4rem' }}>
            <strong style={{ color: 'var(--ac)', display: 'block', marginBottom: '0.35rem' }}>
              AI Quick Summary
            </strong>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{aiSummary}</div>
          </div>
        )}

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
              const rel = articleMap[relId];
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

  const featured = articleMap[cms.news.featuredId] || storyList[0];

  return (
    <section className="sec" id="news" aria-labelledby="nh">
      <div className="w">
        <span className="tag" style={{ marginBottom: '0.45rem' }}>{copy.tag}</span>
        <h2 className="sh" id="nh">{copy.title}</h2>
        <p className="sub">{copy.subtitle}</p>

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
          {categories.map((cat) => (
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
              <p className="meta">{featured.l} · {featured.d} · National updates</p>
              <h3>{featured.t}</h3>
              <p style={{ margin: '1rem 0 1.4rem' }}>{featured.c[0]}</p>
              <Link
                href={`/news/${featured.id}`}
                className="btn b1"
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                Read the full story
              </Link>
            </div>
            <div className="stats">
              {cms.news.featuredStats.map((st, idx) => (
                <div key={idx}><b>{st.value}</b><span>{st.label}</span></div>
              ))}
            </div>
          </article>
        )}

        {/* Stories List */}
        <div className="rows">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
            >
              <time>{item.d}</time>
              <span className="tag">{item.l}</span>
              <h3>{item.t}</h3>
              <span className="dl">Read Story →</span>
            </Link>
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
