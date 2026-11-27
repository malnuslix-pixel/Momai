'use client';

import React, { useState, useEffect } from 'react';
import { CmsData, CmsSectionKey, SiteCopyConfig } from '@/lib/cms';
import { CMS_UPDATED_EVENT } from '@/lib/cms-context';

interface AdminTitlesPanelProps {
  cms: CmsData;
  onCmsUpdated: (next: CmsData) => void;
  showToast: (msg: string) => void;
}

const SECTION_LABELS: { key: CmsSectionKey; label: string }[] = [
  { key: 'roleChooser', label: 'Role Chooser (Audience Pathways)' },
  { key: 'search', label: 'Search & Shortcuts' },
  { key: 'news', label: 'Latest News Desk' },
  { key: 'tutorSpotlight', label: 'AI Tutor Spotlight Card' },
  { key: 'library', label: 'Learning & Teaching Library' },
  { key: 'teaching', label: 'Teaching Materials' },
  { key: 'courses', label: 'Short Courses' },
  { key: 'games', label: 'Games & Quizzes' },
  { key: 'exams', label: 'Exams Hub' },
  { key: 'tools', label: 'Classroom & KCSE Tools' },
  { key: 'notices', label: 'Notices & Grade 10 Placement' },
  { key: 'parents', label: 'Parents Hub' },
  { key: 'jobs', label: 'Teaching Jobs' },
  { key: 'videos', label: 'Curated YouTube Classroom' },
  { key: 'help', label: 'Help & CBE Glossary' },
  { key: 'tutoring', label: 'Tutoring & Practice' },
];

export default function AdminTitlesPanel({ cms, onCmsUpdated, showToast }: AdminTitlesPanelProps) {
  const [draft, setDraft] = useState<SiteCopyConfig>(cms.siteCopy);
  const [saving, setSaving] = useState(false);
  const [aiBusyKey, setAiBusyKey] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cms.siteCopy);
  }, [cms.siteCopy]);

  const handleSaveAllTitles = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'siteCopy', data: draft }),
      });
      const json = await res.json();
      if (json.ok && json.cms) {
        onCmsUpdated(json.cms);
        window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT, { detail: { cms: json.cms } }));
        showToast('All frontend site titles & headings saved!');
      } else {
        showToast(json.error || 'Could not save site titles.');
      }
    } catch {
      showToast('Network error saving site titles.');
    } finally {
      setSaving(false);
    }
  };

  const polishWithAI = async (key: string, title: string, subtitle: string, apply: (c: any) => void) => {
    setAiBusyKey(key);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rewrite_titles', context: key, title, subtitle }),
      });
      const json = await res.json();
      if (json.ok && json.copy) {
        apply(json.copy);
        showToast(`AI polished EN + SW copy (${json.provider}).`);
      }
    } catch {
      showToast('AI title polish failed.');
    } finally {
      setAiBusyKey(null);
    }
  };

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Global Branding, Hero Titles &amp; Section Headings</h2>
          <p className="mu" style={{ margin: '0.25rem 0 0' }}>Edit any frontend title, subtitle, hero slide, or ticker item shown on the public site.</p>
        </div>
        <button className="b" onClick={handleSaveAllTitles} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save All Frontend Titles'}
        </button>
      </div>

      {/* Global Brand & Footer */}
      <div className="card">
        <h2>Site Identity &amp; Latest Ticker</h2>
        <div className="grid g3" style={{ marginBottom: '0.8rem' }}>
          <div>
            <label>Site Brand Title (Navbar &amp; Footer)</label>
            <input type="text" value={draft.brandName} onChange={(e) => setDraft({ ...draft, brandName: e.target.value })} />
          </div>
          <div>
            <label>Footer Tagline</label>
            <input type="text" value={draft.footerTagline} onChange={(e) => setDraft({ ...draft, footerTagline: e.target.value })} />
          </div>
          <div>
            <label>Footer Copyright Line</label>
            <input type="text" value={draft.footerCopy} onChange={(e) => setDraft({ ...draft, footerCopy: e.target.value })} />
          </div>
        </div>
        <h3>Hero Bottom Ticker Items</h3>
        {draft.tickerItems.map((tk, idx) => (
          <div key={idx} className="grid g3" style={{ marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={tk.label}
              onChange={(e) => {
                const next = [...draft.tickerItems];
                next[idx] = { ...next[idx], label: e.target.value };
                setDraft({ ...draft, tickerItems: next });
              }}
              placeholder="English ticker headline"
            />
            <input
              type="text"
              value={tk.labelSw}
              onChange={(e) => {
                const next = [...draft.tickerItems];
                next[idx] = { ...next[idx], labelSw: e.target.value };
                setDraft({ ...draft, tickerItems: next });
              }}
              placeholder="Kiswahili ticker headline"
            />
            <input
              type="text"
              value={tk.href}
              onChange={(e) => {
                const next = [...draft.tickerItems];
                next[idx] = { ...next[idx], href: e.target.value };
                setDraft({ ...draft, tickerItems: next });
              }}
              placeholder="/news/s1"
            />
          </div>
        ))}
      </div>

      {/* 3 Hero Scenes */}
      <div className="card">
        <h2>Hero Cinematic Scenes (EN &amp; SW)</h2>
        {draft.heroScenes.map((sc, idx) => (
          <div key={idx} style={{ padding: '0.85rem', border: '1px solid var(--ln)', borderRadius: '8px', marginBottom: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <b>Hero Slide {idx + 1}</b>
              <button
                type="button"
                className="b s"
                disabled={aiBusyKey === `hero-${idx}`}
                onClick={() =>
                  polishWithAI(`hero-${idx}`, sc.title, sc.subtitle, (c) => {
                    const next = [...draft.heroScenes];
                    next[idx] = { ...next[idx], title: c.title, titleSw: c.titleSw, subtitle: c.subtitle, subtitleSw: c.subtitleSw };
                    setDraft({ ...draft, heroScenes: next });
                  })
                }
              >
                {aiBusyKey === `hero-${idx}` ? 'Polishing…' : 'AI Polish + SW'}
              </button>
            </div>
            <div className="grid g2" style={{ marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={sc.title}
                onChange={(e) => {
                  const next = [...draft.heroScenes];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setDraft({ ...draft, heroScenes: next });
                }}
                placeholder="English Headline"
              />
              <input
                type="text"
                value={sc.titleSw}
                onChange={(e) => {
                  const next = [...draft.heroScenes];
                  next[idx] = { ...next[idx], titleSw: e.target.value };
                  setDraft({ ...draft, heroScenes: next });
                }}
                placeholder="Kiswahili Headline"
              />
            </div>
            <div className="grid g2">
              <input
                type="text"
                value={sc.subtitle}
                onChange={(e) => {
                  const next = [...draft.heroScenes];
                  next[idx] = { ...next[idx], subtitle: e.target.value };
                  setDraft({ ...draft, heroScenes: next });
                }}
                placeholder="English Subtitle"
              />
              <input
                type="text"
                value={sc.subtitleSw}
                onChange={(e) => {
                  const next = [...draft.heroScenes];
                  next[idx] = { ...next[idx], subtitleSw: e.target.value };
                  setDraft({ ...draft, heroScenes: next });
                }}
                placeholder="Kiswahili Subtitle"
              />
            </div>
          </div>
        ))}
      </div>

      {/* All Section Titles */}
      <div className="card">
        <h2>Frontend Section Titles &amp; Subtitles</h2>
        <div className="grid g2">
          {SECTION_LABELS.map(({ key, label }) => {
            const sec = draft.sections[key];
            return (
              <div key={key} style={{ padding: '0.8rem', border: '1px solid var(--ln)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <b>{label}</b>
                  <button
                    type="button"
                    className="b s"
                    disabled={aiBusyKey === `sec-${key}`}
                    onClick={() =>
                      polishWithAI(label, sec.title, sec.subtitle, (c) => {
                        setDraft({
                          ...draft,
                          sections: {
                            ...draft.sections,
                            [key]: { ...sec, title: c.title, titleSw: c.titleSw, subtitle: c.subtitle, subtitleSw: c.subtitleSw },
                          },
                        });
                      })
                    }
                  >
                    {aiBusyKey === `sec-${key}` ? '…' : 'AI Polish'}
                  </button>
                </div>
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) =>
                    setDraft({ ...draft, sections: { ...draft.sections, [key]: { ...sec, title: e.target.value } } })
                  }
                  placeholder="English Section Title"
                  style={{ width: '100%', marginBottom: '0.4rem' }}
                />
                <input
                  type="text"
                  value={sec.titleSw}
                  onChange={(e) =>
                    setDraft({ ...draft, sections: { ...draft.sections, [key]: { ...sec, titleSw: e.target.value } } })
                  }
                  placeholder="Kiswahili Section Title"
                  style={{ width: '100%', marginBottom: '0.4rem' }}
                />
                <textarea
                  rows={2}
                  value={sec.subtitle}
                  onChange={(e) =>
                    setDraft({ ...draft, sections: { ...draft.sections, [key]: { ...sec, subtitle: e.target.value } } })
                  }
                  placeholder="English Subtitle"
                  style={{ width: '100%' }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button className="b" onClick={handleSaveAllTitles} disabled={saving}>
            {saving ? 'Saving…' : '💾 Save All Frontend Titles'}
          </button>
        </div>
      </div>
    </div>
  );
}
