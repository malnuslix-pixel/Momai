'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ALL_BADGES, getLevelName, getStreakEmoji } from '@/lib/gamification';

interface LeaderEntry {
  rank: number;
  display_name: string;
  county: string;
  school?: string;
  total_xp: number;
  level: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'badges'>('leaderboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gamification?action=leaderboard&period=${period}&limit=20`);
      const data = await res.json();
      if (data.ok && data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch {
      // Keep resilient default
    } finally {
      setLoading(false);
    }
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { background: 'linear-gradient(135deg, #FFD700, #FFA000)', color: '#1a1a1a' };
    if (rank === 2) return { background: 'linear-gradient(135deg, #C0C0C0, #A0A0A0)', color: '#1a1a1a' };
    if (rank === 3) return { background: 'linear-gradient(135deg, #CD7F32, #A0522D)', color: '#fff' };
    return { background: '#eaf0ea', color: '#2c5f2d' };
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f5',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: '#1a1a1a',
    }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #2c5f2d, #1a3d1b)',
        color: '#fff',
        padding: '2rem 1.5rem 3rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : window.location.assign('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.9rem',
                minHeight: '38px',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '999px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 2.6rem)',
            margin: '0.8rem 0 0.3rem',
          }}>
            🏆 Academic Leaderboard
          </h1>
          <p style={{ opacity: 0.9, margin: 0, fontSize: '0.95rem' }}>
            Earn XP and study streaks by completing daily quizzes, asking Mwalimu AI questions, and mastering Kenyan syllabus topics.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        maxWidth: '720px',
        margin: '-1.4rem auto 0',
        padding: '0 1rem',
        gap: '0.5rem',
      }}>
        {[
          { id: 'leaderboard' as const, label: '🏆 National Rankings' },
          { id: 'badges' as const, label: '🎖️ Badges & Achievements' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === t.id ? '#fff' : 'rgba(255,255,255,0.75)',
              boxShadow: activeTab === t.id ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: activeTab === t.id ? '#2c5f2d' : '#666',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.2rem' }}>
        {activeTab === 'leaderboard' && (
          <>
            {/* Period Filters */}
            <div style={{
              display: 'flex',
              gap: '0.4rem',
              marginBottom: '1.2rem',
              background: '#fff',
              borderRadius: '10px',
              padding: '0.3rem',
              border: '1px solid #e2ded5',
            }}>
              {[
                { id: 'weekly' as const, label: 'This Week' },
                { id: 'monthly' as const, label: 'This Month' },
                { id: 'alltime' as const, label: 'All Time' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPeriod(p.id)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: period === p.id ? '#2c5f2d' : 'transparent',
                    color: period === p.id ? '#fff' : '#1a1a1a',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Podium (Top 3) */}
            {leaderboard.length >= 3 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 'clamp(0.3rem, 1.5vw, 0.6rem)',
                marginBottom: '1.5rem',
                padding: '1rem 0',
              }}>
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
                  const heights = ['110px', '140px', '95px'];
                  const medals = ['🥈', '🥇', '🥉'];
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{medals[idx]}</span>
                      <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        maxWidth: '85px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {entry?.display_name}
                      </span>
                      <div style={{
                        width: 'clamp(70px, 25vw, 90px)',
                        height: heights[idx],
                        ...getRankStyle(entry?.rank || idx + 1),
                        borderRadius: '12px 12px 0 0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontFamily: 'Fraunces, Georgia, serif',
                      }}>
                        <div style={{ fontSize: '1.25rem' }}>{entry?.total_xp?.toLocaleString()}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Full List */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              border: '1px solid #e2ded5',
              overflow: 'hidden',
            }}>
              {leaderboard.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.85rem 1.1rem',
                    borderBottom: i < leaderboard.length - 1 ? '1px solid #f2eee8' : 'none',
                    gap: '0.8rem',
                    background: entry.rank <= 3 ? '#f9fcf9' : 'transparent',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    fontSize: entry.rank <= 3 ? '1.2rem' : '0.85rem',
                    ...getRankStyle(entry.rank),
                  }}>
                    {getRankMedal(entry.rank)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      {entry.display_name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#777' }}>
                      {entry.county} · Level {entry.level} ({getLevelName(entry.level)})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontFamily: 'Fraunces, Georgia, serif', color: '#2c5f2d' }}>
                      {entry.total_xp.toLocaleString()} XP
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#777' }}>
                      {getStreakEmoji(entry.streak)} {entry.streak}d streak
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Badges Gallery */}
        {activeTab === 'badges' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: '0.85rem',
          }}>
            {ALL_BADGES.map((b) => (
              <div
                key={b.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e2ded5',
                  borderRadius: '14px',
                  padding: '1.2rem 0.8rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {b.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.4 }}>
                  {b.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div style={{ textAlign: 'center', margin: '2.2rem 0 1rem' }}>
          <Link
            href="/tutor"
            style={{
              display: 'inline-block',
              padding: '0.85rem 2.2rem',
              borderRadius: '50px',
              background: '#2c5f2d',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(44, 95, 45, 0.25)',
            }}
          >
            Study with Mwalimu AI to Earn XP →
          </Link>
        </div>
      </div>
    </div>
  );
}
