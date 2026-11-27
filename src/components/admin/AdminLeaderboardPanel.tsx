'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LeaderboardSettings } from '@/lib/types';

interface LearnerRow {
  rank: number;
  user_id: string;
  display_name: string;
  county: string;
  school?: string;
  total_xp: number;
  level: number;
  streak: number;
  updated_at?: string | null;
}

interface AdminLeaderboardPanelProps {
  settings: LeaderboardSettings;
  onSave: (next: LeaderboardSettings) => Promise<void>;
  saving?: boolean;
  onNotify: (msg: string) => void;
}

export default function AdminLeaderboardPanel({
  settings,
  onSave,
  saving,
  onNotify,
}: AdminLeaderboardPanelProps) {
  const [draft, setDraft] = useState<LeaderboardSettings>(settings);
  const [learners, setLearners] = useState<LearnerRow[]>([]);
  const [loadingLearners, setLoadingLearners] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editXp, setEditXp] = useState<number>(0);
  const [editStreak, setEditStreak] = useState<number>(0);
  const [actionBusy, setActionBusy] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const loadLearners = async () => {
    setLoadingLearners(true);
    try {
      const res = await fetch('/api/admin/controls?scope=leaderboard', { cache: 'no-store' });
      const data = await res.json();
      if (data.ok) {
        setLearners(Array.isArray(data.learners) ? data.learners : []);
      }
    } catch {
    } finally {
      setLoadingLearners(false);
    }
  };

  useEffect(() => {
    loadLearners();
  }, []);

  const handleSaveLearner = async (userId: string) => {
    setActionBusy(true);
    try {
      const res = await fetch('/api/admin/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_learner_xp',
          user_id: userId,
          total_xp: editXp,
          streak: editStreak,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        onNotify('Updated learner XP & streak.');
        setEditingId(null);
        await loadLearners();
      } else {
        onNotify(data.error || 'Failed to update learner');
      }
    } catch {
      onNotify('Network error updating learner');
    } finally {
      setActionBusy(false);
    }
  };

  const handleRemoveLearner = async (userId: string, name: string) => {
    if (!window.confirm(`Remove ${name} from the leaderboard?`)) return;
    setActionBusy(true);
    try {
      const res = await fetch('/api/admin/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove_learner', user_id: userId }),
      });
      const data = await res.json();
      if (data.ok) {
        onNotify(`Removed ${name} from leaderboard.`);
        await loadLearners();
      } else {
        onNotify(data.error || 'Failed to remove learner');
      }
    } catch {
      onNotify('Network error removing learner');
    } finally {
      setActionBusy(false);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm('Reset ALL leaderboard XP entries? This clears every learner ranking from the database.')) {
      return;
    }
    setActionBusy(true);
    try {
      const res = await fetch('/api/admin/controls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_all_xp' }),
      });
      const data = await res.json();
      if (data.ok) {
        onNotify('Leaderboard XP entries reset.');
        await loadLearners();
      } else {
        onNotify(data.error || 'Failed to reset leaderboard');
      }
    } catch {
      onNotify('Network error resetting leaderboard');
    } finally {
      setActionBusy(false);
    }
  };

  const filtered = learners.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.display_name.toLowerCase().includes(q) ||
      l.county.toLowerCase().includes(q) ||
      l.user_id.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Leaderboard &amp; XP Moderation</h2>
          <p className="muted" style={{ margin: '0.2rem 0 0' }}>
            Control public leaderboard visibility, default timeframe, badge showcase, and moderate learner XP.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/leaderboard" className="b s" style={{ textDecoration: 'none' }}>
            ↗ Preview /leaderboard
          </Link>
          <button type="button" className="b s" onClick={loadLearners} disabled={loadingLearners}>
            {loadingLearners ? 'Refreshing…' : '↻ Refresh Rankings'}
          </button>
          <button type="button" className="b p" onClick={() => onSave(draft)} disabled={saving}>
            {saving ? 'Saving…' : '💾 Save Leaderboard Settings'}
          </button>
        </div>
      </div>

      {/* Rules & Visibility */}
      <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.85rem' }}>
        <h3 style={{ margin: 0 }}>Visibility &amp; Display Rules</h3>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.leaderboardEnabled}
              onChange={(e) => setDraft({ ...draft, leaderboardEnabled: e.target.checked })}
            />
            <span>Public Leaderboard Enabled</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.showBadgesTab}
              onChange={(e) => setDraft({ ...draft, showBadgesTab: e.target.checked })}
            />
            <span>Show Achievement Badges Tab</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.showSampleLeaders}
              onChange={(e) => setDraft({ ...draft, showSampleLeaders: e.target.checked })}
            />
            <span>Show Starter Demo Rankings When Empty</span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Default Period</span>
            <select
              value={draft.defaultPeriod}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  defaultPeriod: e.target.value as 'weekly' | 'monthly' | 'alltime',
                })
              }
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="alltime">All-Time</option>
            </select>
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Max Visible Entries (5–100)</span>
            <input
              type="number"
              min={5}
              max={100}
              value={draft.maxEntries}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  maxEntries: Math.min(100, Math.max(5, Number(e.target.value) || 20)),
                })
              }
            />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Hero Heading</span>
            <input
              value={draft.heroTitle}
              onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Hero Subtitle</span>
            <input
              value={draft.heroSubtitle}
              onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
            />
          </label>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Paused Notice (shown when disabled)</span>
            <input
              value={draft.pausedMessage}
              onChange={(e) => setDraft({ ...draft, pausedMessage: e.target.value })}
            />
          </label>
        </div>
      </div>

      {/* Live Learner XP Table */}
      <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0 }}>Registered Learners ({learners.length})</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="search"
              placeholder="Filter name, county, or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: '200px' }}
            />
            {learners.length > 0 && (
              <button
                type="button"
                className="b s"
                style={{ background: '#c0392b', color: '#fff' }}
                onClick={handleResetAll}
                disabled={actionBusy}
              >
                Reset All XP
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            {learners.length === 0
              ? 'No learner XP rows recorded in Supabase yet.'
              : 'No learners match your search filter.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.5rem' }}>Rank</th>
                  <th style={{ padding: '0.5rem' }}>Learner</th>
                  <th style={{ padding: '0.5rem' }}>County</th>
                  <th style={{ padding: '0.5rem' }}>XP</th>
                  <th style={{ padding: '0.5rem' }}>Level</th>
                  <th style={{ padding: '0.5rem' }}>Streak</th>
                  <th style={{ padding: '0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const isEditing = editingId === l.user_id;
                  return (
                    <tr key={l.user_id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>#{l.rank}</td>
                      <td style={{ padding: '0.5rem' }}>
                        <div style={{ fontWeight: 600 }}>{l.display_name}</div>
                        <div className="muted" style={{ fontSize: '0.75rem' }}>{l.user_id}</div>
                      </td>
                      <td style={{ padding: '0.5rem' }}>{l.county}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editXp}
                            onChange={(e) => setEditXp(Math.max(0, Number(e.target.value) || 0))}
                            style={{ width: '90px' }}
                          />
                        ) : (
                          `${l.total_xp.toLocaleString()} XP`
                        )}
                      </td>
                      <td style={{ padding: '0.5rem' }}>Lv {l.level}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            value={editStreak}
                            onChange={(e) => setEditStreak(Math.max(0, Number(e.target.value) || 0))}
                            style={{ width: '70px' }}
                          />
                        ) : (
                          `${l.streak}d`
                        )}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              className="b p s"
                              disabled={actionBusy}
                              onClick={() => handleSaveLearner(l.user_id)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="b s"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <button
                              type="button"
                              className="b s"
                              onClick={() => {
                                setEditingId(l.user_id);
                                setEditXp(l.total_xp);
                                setEditStreak(l.streak);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="b s"
                              style={{ color: '#c0392b' }}
                              disabled={actionBusy}
                              onClick={() => handleRemoveLearner(l.user_id, l.display_name)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
