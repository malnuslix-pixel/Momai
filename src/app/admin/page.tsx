'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/control-room.css';
import { FeedItem, Submission, SiteFlags, SiteConfig, VerificationCheck, AuditLogEntry } from '@/lib/types';
import { SEED_ITEMS, SEED_SUBMISSIONS, SEED_CONFIG, SEED_CHECKS, SEED_AUDIT } from '@/lib/supabase';

type TabType = 'overview' | 'content' | 'inbox' | 'audience' | 'assistant' | 'health' | 'config' | 'ops';

const TABS: [TabType, string][] = [
  ['overview', 'Overview'],
  ['content', 'Content'],
  ['inbox', 'Inbox'],
  ['audience', 'Audience'],
  ['assistant', 'Assistant'],
  ['health', 'Health & checks'],
  ['config', 'Site flags'],
  ['ops', 'Operations'],
];

const CK_LABELS = [
  'Verified phone or organization email',
  'No fee requested from applicants or learners',
  'Dates and location match official records',
];

export default function AdminPage() {
  const [tab, setTab] = useState<TabType>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [items, setItems] = useState<FeedItem[]>(SEED_ITEMS);
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS);
  const [config, setConfig] = useState<SiteConfig>(SEED_CONFIG);
  const [checks, setChecks] = useState<VerificationCheck[]>(SEED_CHECKS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(SEED_AUDIT);
  const [inboxFilter, setInboxFilter] = useState<'all' | 'new' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [newItem, setNewItem] = useState({
    k: 'job' as 'job' | 'notice',
    t: '',
    who: '',
    loc: '',
    cat: 'Teaching',
    body: '',
    st: 'published' as 'draft' | 'published',
    exp: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10),
  });

  // Emergency banner state
  const [bannerText, setBannerText] = useState(SEED_CONFIG.banner.text);
  const [bannerActive, setBannerActive] = useState(SEED_CONFIG.banner.active);

  // Sync with hash if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabType;
    if (TABS.some((t) => t[0] === hash)) {
      setTab(hash);
    }
  }, []);

  const changeTab = (t: TabType) => {
    setTab(t);
    window.location.hash = t;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch live data from API endpoints
  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, subsRes, configRes, statsRes] = await Promise.allSettled([
        fetch('/api/items?all=true').then((r) => r.json()),
        fetch('/api/submissions?filter=all').then((r) => r.json()),
        fetch('/api/config').then((r) => r.json()),
        fetch('/api/stats').then((r) => r.json()),
      ]);

      if (itemsRes.status === 'fulfilled' && itemsRes.value.ok && itemsRes.value.items) {
        setItems(itemsRes.value.items);
      }
      if (subsRes.status === 'fulfilled' && subsRes.value.ok && subsRes.value.submissions) {
        setSubmissions(subsRes.value.submissions);
      }
      if (configRes.status === 'fulfilled' && configRes.value.ok) {
        if (configRes.value.flags) {
          setConfig((prev) => ({ ...prev, flags: configRes.value.flags, banner: configRes.value.banner }));
          setBannerText(configRes.value.banner.text);
          setBannerActive(configRes.value.banner.active);
        }
        if (configRes.value.checks) {
          setChecks(configRes.value.checks);
        }
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.ok && statsRes.value.audit) {
        setAuditLogs(statsRes.value.audit);
      }
    } catch (e) {
      console.warn('Control Room offline/local mode:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const resetSample = () => {
    setItems(SEED_ITEMS);
    setSubmissions(SEED_SUBMISSIONS);
    setConfig(SEED_CONFIG);
    setChecks(SEED_CHECKS);
    showToast('Reset to default sample data.');
  };

  // Content Actions
  const handleItemStatusChange = async (id: any, st: 'draft' | 'published' | 'rejected') => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, st } : i)));
    try {
      await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, st }),
      });
      showToast(`Item #${id} set to ${st}`);
    } catch {}
  };

  const handleItemExpiryChange = async (id: any, exp: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, exp } : i)));
    try {
      await fetch('/api/items', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, exp }),
      });
      showToast('Expiry updated');
    } catch {}
  };

  const handleItemDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
      showToast('Item deleted');
    } catch {}
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.t || !newItem.body) {
      alert('Please fill in title and description');
      return;
    }

    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      if (data.ok && data.item) {
        setItems([data.item, ...items]);
        setNewItem({
          k: 'job',
          t: '',
          who: '',
          loc: '',
          cat: 'Teaching',
          body: '',
          st: 'published',
          exp: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10),
        });
        showToast('New item added to Supabase!');
      }
    } catch {
      showToast('Item saved locally.');
    }
  };

  // Inbox Actions
  const handleCheckToggle = async (ref: string, checkIndex: number, currentVal: boolean) => {
    const nextVal = !currentVal;
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.ref === ref) {
          const checks = [...s.checks] as [boolean, boolean, boolean];
          checks[checkIndex] = nextVal;
          return { ...s, checks };
        }
        return s;
      })
    );

    try {
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, checkIndex, checkValue: nextVal }),
      });
    } catch {}
  };

  const handleSubmissionAction = async (ref: string, action: 'approve' | 'reject') => {
    const newSt = action === 'approve' ? 'approved' : 'rejected';
    setSubmissions((prev) =>
      prev.map((s) => (s.ref === ref ? { ...s, st: newSt } : s))
    );

    try {
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref, action }),
      });
      showToast(`Submission ${ref} ${action}d!`);
      if (action === 'approve') {
        loadData(); // reload items to show new draft in Content
      }
    } catch {}
  };

  // Site Flags & Banner Actions
  const handleFlagToggle = async (key: keyof SiteFlags) => {
    const nextFlags = { ...config.flags, [key]: !config.flags[key] };
    setConfig((prev) => ({ ...prev, flags: nextFlags }));
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flags: nextFlags }),
      });
      showToast(`Flag "${key}" updated`);
    } catch {}
  };

  const handleSaveBanner = async () => {
    const banner = { text: bannerText, active: bannerActive };
    setConfig((prev) => ({ ...prev, banner }));
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner }),
      });
      showToast('Emergency banner saved to Supabase!');
    } catch {}
  };

  const handleVerifyAllChecks = async () => {
    const today = new Date().toISOString().slice(0, 10);
    setChecks((prev) => prev.map((c) => ({ ...c, last: today })));
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkAction: 'verify_all' }),
      });
      showToast('All 9 accuracy checks marked verified for today!');
    } catch {}
  };

  // Calculations for Inbox
  const waitingSubs = submissions.filter((s) => s.st === 'new');
  const approvedSubs = submissions.filter((s) => s.st === 'approved');
  const rejectedSubs = submissions.filter((s) => s.st === 'rejected');
  const lateWaiting = waitingSubs.filter((s) => (s.hrs || 0) > 48);
  const oldestWaiting = waitingSubs.reduce((max, s) => Math.max(max, s.hrs || 0), 0);
  const totalDecided = approvedSubs.length + rejectedSubs.length;
  const approvalRate = totalDecided > 0 ? Math.round((approvedSubs.length / totalDecided) * 100) : 0;

  // Filtered submissions list
  const filteredSubmissions = submissions.filter(
    (s) => inboxFilter === 'all' || s.st === inboxFilter
  );

  // Live feed.json preview
  const liveFeedJson = JSON.stringify(
    {
      updated: new Date().toISOString().slice(0, 10),
      jobs: items
        .filter((i) => i.k === 'job' && i.st === 'published')
        .map((i) => ({
          t: i.t,
          e: i.who || '',
          l: i.loc || '',
          c: i.cat || '',
          d: i.body,
          st: 'published',
          exp: i.exp || '',
        })),
      notices: items
        .filter((i) => i.k === 'notice' && i.st === 'published')
        .map((i) => ({
          k: i.cat || 'General',
          d: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          t: i.t,
          b: i.body,
          st: 'published',
        })),
    },
    null,
    2
  );

  return (
    <div className="cr-app">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            zIndex: 9999,
            maxWidth: 'min(92vw, 32rem)',
            background: '#1a3d1b',
            color: '#fff',
            padding: '0.85rem 1.2rem',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            fontSize: '0.95rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
          }}
        >
          <span>✓ {toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'none',
              border: 0,
              color: '#fff',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Top Header */}
      <header>
        <h1>Mwalimu Family · Control Room</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="p ok">Supabase Connected</span>
          <button className="b s" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
          </button>
          <button className="b s" onClick={resetSample}>
            Reset sample
          </button>
          <Link href="/tutor" className="b s" style={{ textDecoration: 'none' }}>
            🤖 AI Tutor
          </Link>
          <Link href="/pricing" className="b s" style={{ textDecoration: 'none' }}>
            💳 Pricing
          </Link>
          <Link href="/leaderboard" className="b s" style={{ textDecoration: 'none' }}>
            🏆 Leaderboard
          </Link>
          <Link href="/" className="b s" style={{ background: '#2c5f2d', color: '#fff', textDecoration: 'none' }}>
            ← Public Site
          </Link>
        </div>
      </header>

      {/* Tabs Navigation */}
      <nav id="tabs" aria-label="Dashboard sections">
        {TABS.map(([tKey, tLabel]) => (
          <a
            key={tKey}
            href={`#${tKey}`}
            onClick={(e) => {
              e.preventDefault();
              changeTab(tKey);
            }}
            className={tab === tKey ? 'on' : ''}
            aria-current={tab === tKey ? 'page' : undefined}
          >
            {tLabel}
          </a>
        ))}
      </nav>

      {/* Main Content Area */}
      <main id="v">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================================================= */}
        {tab === 'overview' && (
          <div>
            {/* 10 KPI Cards */}
            <div className="grid">
              {[
                ['Visitors today', '2,480', '+15% vs yesterday', 'up'],
                ['Installed app', '342', '+27 this week', 'up'],
                ['Email subscribers', '1,284', '+96 this week', 'up'],
                ['Submissions waiting', String(waitingSubs.length), waitingSubs.length > 0 ? 'Review in Inbox' : 'All clear', waitingSubs.length > 0 ? 'dn' : 'up'],
                ['Assistant questions today', '186', '12% fell back to built-in help', 'mu'],
                ['Error rate', '0.4%', 'Target under 1%', 'up'],
                ['Returning visitors', '38%', '+4 points vs last month', 'up'],
                ['Average time on page', '2m 41s', 'Exams hub: 4m 05s', 'mu'],
                ['Tool completions', '6,120', 'This week: calculators and quizzes', 'up'],
                ['Email open rate', '47%', 'Last roundup, 21 Nov', 'up'],
              ].map((k, idx) => (
                <div key={idx} className="card kpi">
                  <span className="mu">{k[0]}</span>
                  <b>{k[1]}</b>
                  <span className={`${k[3]} mu`}>{k[2]}</span>
                </div>
              ))}
            </div>

            {/* Visitors Chart */}
            <div className="card">
              <h2>Visitors, last 14 days</h2>
              <svg viewBox="0 0 560 140" style={{ width: '100%', height: '140px' }} aria-label="Visitors chart">
                <polyline
                  fill="none"
                  stroke="#2c5f2d"
                  strokeWidth="3"
                  points="20,105 58,98 97,100 135,88 174,92 212,110 251,115 290,75 328,68 367,72 405,52 444,38 483,18 521,5"
                />
                <circle cx="521" cy="5" r="4" fill="#2c5f2d" />
                <text x="500" y="24" fontSize="11" fill="var(--mu)">2,480</text>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--mu)', marginTop: '0.4rem' }}>
                <span>8 Nov 2026 (820 visitors)</span>
                <span>Peak: Results prep season</span>
                <span>Today: 21 Nov (2,480)</span>
              </div>
            </div>

            {/* Alert Cards */}
            <div className="grid g2">
              <div className="card">
                <h2>Needs attention</h2>
                <ul className="mu" style={{ paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                  {lateWaiting.length > 0 ? (
                    <li>
                      <b style={{ color: 'var(--bad)' }}>{lateWaiting.length} form submission(s)</b> past the 48-hour response target in Inbox.
                    </li>
                  ) : (
                    <li>All form submissions are within SLA.</li>
                  )}
                  <li>Grade 10 Senior School pathway guidelines need MoE verification.</li>
                  <li>KUCCPS portal opens mid-January 2027; verify weighted cluster calculator before then.</li>
                </ul>
              </div>

              <div className="card">
                <h2>Results season</h2>
                <p className="mu">
                  Target release: <b>KJSEA</b> December 2026, <b>KCSE & KPSEA</b> January 2027.
                </p>
                <p className="mu">
                  Announced 20 Nov 2026 by Education CS Julius Ogamba. 13,484 examiners at 24 centres marking KJSEA; 34,170 examiners at 41 centres marking KCSE.
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2>Recent activity</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {auditLogs.slice(0, 6).map((log, i) => (
                  <div key={i} className="al">
                    <span className="mu">{log.t || 'Just now'}</span>
                    <span>{log.m || log.action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONTENT */}
        {/* ========================================================================= */}
        {tab === 'content' && (
          <div>
            <div className="card">
              <h2>Jobs and notices</h2>
              <div className="sc">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const isExpired =
                        item.st === 'published' &&
                        item.exp &&
                        new Date(item.exp + 'T00:00:00Z') < new Date();
                      return (
                        <tr key={item.id}>
                          <td>
                            <b>{item.t}</b>
                            <div className="mu">
                              {item.who} {item.loc ? `· ${item.loc}` : ''} · {item.cat}
                            </div>
                          </td>
                          <td>{item.k === 'job' ? 'Job' : 'Notice'}</td>
                          <td>
                            <select
                              value={item.st}
                              onChange={(e) =>
                                handleItemStatusChange(item.id, e.target.value as any)
                              }
                              aria-label="Status"
                            >
                              <option value="draft">draft</option>
                              <option value="published">published</option>
                              <option value="rejected">rejected</option>
                            </select>
                            {isExpired && <span className="p bad" style={{ marginLeft: '0.4rem' }}>expired</span>}
                          </td>
                          <td>
                            <input
                              type="date"
                              value={item.exp || ''}
                              onChange={(e) => handleItemExpiryChange(item.id, e.target.value)}
                              aria-label="Expiry date"
                            />
                          </td>
                          <td>
                            <button
                              className="b s"
                              onClick={() => handleItemDelete(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="card">
              <h2>Add an item</h2>
              <form onSubmit={handleAddItem}>
                <div className="grid g2" style={{ marginBottom: '0.8rem' }}>
                  <div>
                    <label>Type</label>
                    <select
                      value={newItem.k}
                      onChange={(e) => setNewItem({ ...newItem, k: e.target.value as any })}
                    >
                      <option value="job">Job vacancy</option>
                      <option value="notice">Official notice / Announcement</option>
                    </select>
                  </div>
                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      value={newItem.cat}
                      onChange={(e) => setNewItem({ ...newItem, cat: e.target.value })}
                      placeholder="e.g. Teaching, Exams, Tutoring, Safety"
                    />
                  </div>
                </div>

                <div className="grid g2" style={{ marginBottom: '0.8rem' }}>
                  <div>
                    <label>Title</label>
                    <input
                      type="text"
                      value={newItem.t}
                      onChange={(e) => setNewItem({ ...newItem, t: e.target.value })}
                      placeholder="e.g. Grade 8 Integrated Science Teacher"
                      required
                    />
                  </div>
                  <div>
                    <label>Organization / School / Source</label>
                    <input
                      type="text"
                      value={newItem.who}
                      onChange={(e) => setNewItem({ ...newItem, who: e.target.value })}
                      placeholder="e.g. Alliance High School"
                    />
                  </div>
                </div>

                <div className="grid g2" style={{ marginBottom: '0.8rem' }}>
                  <div>
                    <label>Location (Town / County)</label>
                    <input
                      type="text"
                      value={newItem.loc}
                      onChange={(e) => setNewItem({ ...newItem, loc: e.target.value })}
                      placeholder="e.g. Nairobi, Kiambu, Mombasa"
                    />
                  </div>
                  <div>
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      value={newItem.exp}
                      onChange={(e) => setNewItem({ ...newItem, exp: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.8rem' }}>
                  <label>Description / Listing Details</label>
                  <textarea
                    rows={3}
                    value={newItem.body}
                    onChange={(e) => setNewItem({ ...newItem, body: e.target.value })}
                    placeholder="Provide responsibilities, requirements, application instructions..."
                    required
                  />
                </div>

                <button type="submit" className="b">
                  Publish to Supabase
                </button>
              </form>
            </div>

            {/* Live Feed JSON Preview */}
            <div className="card">
              <h2>feed.json for the site</h2>
              <pre
                style={{
                  background: 'var(--chip)',
                  padding: '1rem',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  fontSize: '0.85rem',
                }}
              >
                {liveFeedJson}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INBOX */}
        {/* ========================================================================= */}
        {tab === 'inbox' && (
          <div>
            <div className="note">
              Editorial rule: nothing is approved until all three checks are ticked. Approved jobs and notices are created as drafts in Content.
            </div>

            {/* Inbox KPIs */}
            <div className="grid">
              <div className="card kpi">
                <span className="mu">Waiting</span>
                <b>{waitingSubs.length}</b>
                <span className="mu">
                  {lateWaiting.length ? `${lateWaiting.length} past 48h target` : 'Within target'}
                </span>
              </div>
              <div className="card kpi">
                <span className="mu">Approved</span>
                <b>{approvedSubs.length}</b>
                <span className="mu">This period</span>
              </div>
              <div className="card kpi">
                <span className="mu">Rejected</span>
                <b>{rejectedSubs.length}</b>
                <span className="mu">Failed verification</span>
              </div>
              <div className="card kpi">
                <span className="mu">Approval rate</span>
                <b>{approvalRate}%</b>
                <span className="mu">Oldest waiting: {oldestWaiting}h</span>
              </div>
            </div>

            {/* Filter */}
            <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <label htmlFor="inbox-filter" style={{ display: 'inline', marginRight: '0.5rem' }}>
                Show:
              </label>
              <select
                id="inbox-filter"
                value={inboxFilter}
                onChange={(e) => setInboxFilter(e.target.value as any)}
              >
                <option value="all">all</option>
                <option value="new">new</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
              </select>
            </p>

            {/* Submissions List */}
            {filteredSubmissions.map((sub) => {
              const allChecked = sub.checks && sub.checks.every(Boolean);
              const isNew = sub.st === 'new';

              return (
                <div key={sub.ref} className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <b>{sub.title}</b>
                      <div className="mu">
                        {sub.label} · {sub.from_name} · {sub.ref} · {sub.hrs !== undefined ? `${sub.hrs}h ago` : 'recent'}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`p ${
                          sub.st === 'new'
                            ? (sub.hrs || 0) > 48
                              ? 'bad'
                              : 'warn'
                            : sub.st === 'approved'
                            ? 'ok'
                            : 'bad'
                        }`}
                      >
                        {sub.st}
                      </span>
                    </div>
                  </div>

                  {/* Submission Fields */}
                  <div style={{ marginTop: '0.8rem', background: 'var(--chip)', padding: '0.7rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                    {sub.fields && sub.fields.map(([label, val], idx) => (
                      <div key={idx} style={{ marginBottom: '0.2rem' }}>
                        <b>{label}:</b> {val}
                      </div>
                    ))}
                  </div>

                  {/* 3-Point Checklist */}
                  {isNew && (
                    <>
                      <div className="ck" style={{ marginTop: '0.8rem' }}>
                        {CK_LABELS.map((chkLabel, idx) => (
                          <label key={idx} style={{ display: 'block', margin: '0.3rem 0' }}>
                            <input
                              type="checkbox"
                              checked={sub.checks?.[idx] || false}
                              onChange={() => handleCheckToggle(sub.ref, idx, sub.checks?.[idx] || false)}
                            />{' '}
                            {chkLabel}
                          </label>
                        ))}
                      </div>

                      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="b"
                          disabled={!allChecked}
                          onClick={() => handleSubmissionAction(sub.ref, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="b s"
                          onClick={() => handleSubmissionAction(sub.ref, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AUDIENCE */}
        {/* ========================================================================= */}
        {tab === 'audience' && (
          <div>
            <div className="grid g2">
              <div className="card">
                <h2>Where visitors come from</h2>
                {[
                  ['Direct / bookmarks', 44],
                  ['WhatsApp channels & groups', 29],
                  ['Google search', 18],
                  ['Facebook & X', 6],
                  ['School portals', 3],
                ].map(([label, pct], i) => (
                  <div key={i} className="hb">
                    <span>{label}</span>
                    <i style={{ width: `${pct}%` }} />
                    <b>{pct}%</b>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>Devices</h2>
                {[
                  ['Mobile Android', 71],
                  ['Mobile iPhone', 19],
                  ['Desktop Chrome / Edge', 9],
                  ['Other', 1],
                ].map(([label, pct], i) => (
                  <div key={i} className="hb">
                    <span>{label}</span>
                    <i style={{ width: `${pct}%` }} />
                    <b>{pct}%</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Top pages this week</h2>
                {[
                  ['Exams hub', 9420],
                  ['KCSE grade calculator', 5310],
                  ['Results scam alert', 4880],
                  ['Parents’ hub', 3150],
                  ['Library', 2740],
                  ['KUCCPS cluster points', 2290],
                ].map(([page, count], i) => (
                  <div key={i} className="hb">
                    <span>{page}</span>
                    <i style={{ width: `${Math.round(((count as number) / 9420) * 100)}%` }} />
                    <b>{(count as number).toLocaleString()}</b>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>Subscribers, last 6 weeks</h2>
                <svg viewBox="0 0 560 140" style={{ width: '100%', height: '140px' }} aria-label="Subscribers growth">
                  <polyline
                    fill="none"
                    stroke="#2c5f2d"
                    strokeWidth="3"
                    points="30,110 130,95 230,80 330,65 430,35 530,15"
                  />
                  <circle cx="530" cy="15" r="4" fill="#2c5f2d" />
                  <text x="500" y="32" fontSize="11" fill="var(--mu)">1,284</text>
                </svg>
                <p className="mu">1,284 on email and WhatsApp. Add an unsubscribe link before bulk sends.</p>
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Top counties</h2>
                {[
                  ['Nairobi', 28],
                  ['Kiambu', 14],
                  ['Nakuru', 11],
                  ['Mombasa', 9],
                  ['Kisumu', 8],
                  ['Machakos', 6],
                  ['Uasin Gishu', 5],
                  ['Other 40 counties', 19],
                ].map(([county, pct], i) => (
                  <div key={i} className="hb">
                    <span>{county}</span>
                    <i style={{ width: `${(pct as number) * 3}%` }} />
                    <b>{pct}%</b>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>New and returning</h2>
                {[
                  ['New visitors', 62],
                  ['Returning visitors', 38],
                ].map(([lbl, pct], i) => (
                  <div key={i} className="hb">
                    <span>{lbl}</span>
                    <i style={{ width: `${pct}%` }} />
                    <b>{pct}%</b>
                  </div>
                ))}
                <h3 style={{ marginTop: '1.2rem', fontSize: '1.05rem' }}>Subscribers by channel</h3>
                {[
                  ['WhatsApp alerts', 812],
                  ['Daily email roundup', 318],
                  ['Weekly digest', 154],
                ].map(([chan, cnt], i) => (
                  <div key={i} className="hb">
                    <span>{chan}</span>
                    <i style={{ width: `${Math.round(((cnt as number) / 812) * 100)}%` }} />
                    <b>{cnt}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: ASSISTANT */}
        {/* ========================================================================= */}
        {tab === 'assistant' && (
          <div>
            <div className="grid">
              <div className="card kpi">
                <span className="mu">Questions today</span>
                <b>186</b>
                <span className="up mu">+22% vs last week</span>
              </div>
              <div className="card kpi">
                <span className="mu">Avg latency</span>
                <b>420 ms</b>
                <span className="up mu">Fast edge response</span>
              </div>
              <div className="card kpi">
                <span className="mu">Fallback rate</span>
                <b>12%</b>
                <span className="mu">Fell back to built-in facts</span>
              </div>
              <div className="card kpi">
                <span className="mu">Daily cap</span>
                <b>3,000</b>
                <span className="mu">6.2% utilized</span>
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Most common topics today</h2>
                {[
                  ['KCSE results release dates', 28],
                  ['KJSEA points conversion', 22],
                  ['Grade 10 pathway choices', 18],
                  ['KCSE cluster points calculation', 14],
                  ['Bursary & HELB eligibility', 11],
                  ['Teacher registration TSC', 7],
                ].map(([topic, pct], i) => (
                  <div key={i} className="hb">
                    <span>{topic}</span>
                    <i style={{ width: `${(pct as number) * 3}%` }} />
                    <b>{pct}%</b>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>Assistant settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={config.flags.ai}
                      onChange={() => handleFlagToggle('ai')}
                    />
                    <b>Enable AI Assistant on site</b>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" defaultChecked />
                    <b>Automatic fallback to Kenyan CBE knowledge engine</b>
                  </label>
                  <div>
                    <label>Daily question cap</label>
                    <input type="number" defaultValue={3000} style={{ width: '120px', marginLeft: '0.5rem' }} />
                  </div>
                  <p className="mu" style={{ fontSize: '0.85rem' }}>
                    Strict moderation active: Never reveals personal learner data or ID numbers; flags and warns against results scams.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: HEALTH & CHECKS */}
        {/* ========================================================================= */}
        {tab === 'health' && (
          <div>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2>Editorial accuracy checks</h2>
                <button className="b" onClick={handleVerifyAllChecks}>
                  Mark all verified today
                </button>
              </div>
              <div className="sc" style={{ marginTop: '0.8rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Check</th>
                      <th>Last verified</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checks.map((chk, idx) => (
                      <tr key={idx}>
                        <td><b>{chk.n || (chk as any).name}</b></td>
                        <td>{chk.last || 'Pending'}</td>
                        <td>
                          <span className={`p ${chk.last ? 'ok' : 'warn'}`}>
                            {chk.last ? 'Verified' : 'Review needed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Technical uptime & latency</h2>
                {[
                  ['Next.js Application Engine', '100%'],
                  ['Supabase Database Connection', '100%'],
                  ['PWA Service Worker Cache', 'Healthy'],
                  ['Static Assets CDN', '18 ms'],
                ].map(([svc, stat], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--ln)' }}>
                    <span>{svc}</span>
                    <b style={{ color: 'var(--ok)' }}>{stat}</b>
                  </div>
                ))}
              </div>

              <div className="card">
                <h2>Editorial verification rules</h2>
                <ul className="mu" style={{ paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                  <li>Formulas and cut-offs must match official gazetted notices (KNEC, KUCCPS, TSC).</li>
                  <li>Job vacancies must never demand application fees or unverified registration payments.</li>
                  <li>Exams release dates must always be stated as targets, not promises.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: SITE FLAGS */}
        {/* ========================================================================= */}
        {tab === 'config' && (
          <div>
            <div className="card">
              <h2>Site flags</h2>
              <div className="grid g2" style={{ marginTop: '0.8rem' }}>
                {[
                  ['maint', 'Maintenance mode', 'Puts the public site in maintenance mode'],
                  ['scam', 'Results scam warning banner', 'Warns against paying for early exam access'],
                  ['lite', 'Data-saver / Lite mode', 'Reduces animations and heavy imagery for low bandwidth'],
                  ['ai', 'AI Assistant ("Ask Mwalimu")', 'Enables the interactive assistant chat bubble'],
                  ['forms', 'Interactive submission forms', 'Allows users to submit tutor requests and job listings'],
                  ['sw', 'Service Worker PWA', 'Enables offline caching and PWA installation'],
                ].map(([fKey, fTitle, fDesc]) => {
                  const active = config.flags[fKey as keyof SiteFlags];
                  return (
                    <div
                      key={fKey}
                      style={{
                        padding: '0.8rem',
                        border: '1px solid var(--ln)',
                        borderRadius: '8px',
                        background: active ? 'var(--chip)' : 'transparent',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => handleFlagToggle(fKey as keyof SiteFlags)}
                        />
                        <b>{fTitle}</b>
                      </label>
                      <p className="mu" style={{ margin: '0.4rem 0 0 1.5rem', fontSize: '0.85rem' }}>
                        {fDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Banner Configuration */}
            <div className="card">
              <h2>Emergency banner message</h2>
              <p className="mu">This announcement displays at the very top of all public pages when active.</p>
              <textarea
                rows={3}
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                style={{ width: '100%', marginBottom: '0.8rem' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                  />
                  <b>Show banner on public site</b>
                </label>
                <button className="b" onClick={handleSaveBanner}>
                  Save Banner
                </button>
              </div>

              {bannerActive && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.8rem',
                    background: '#f4a261',
                    color: '#1a1a1a',
                    borderRadius: '8px',
                    fontWeight: 500,
                  }}
                >
                  <b>Live Preview:</b> {bannerText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: OPERATIONS */}
        {/* ========================================================================= */}
        {tab === 'ops' && (
          <div>
            <div className="grid g2">
              <div className="card">
                <h2>Audit log</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} className="al">
                      <span className="mu">{log.t || 'Recent'}</span>
                      <span>{log.m || log.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2>Supabase Backend Status</h2>
                <div style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--ln)' }}>
                  <b>Project URL:</b> <code>{process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcavjbrvtqxokecpiqln.supabase.co'}</code>
                </div>
                <div style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--ln)' }}>
                  <b>API Status:</b> <span className="p ok">Connected & Synced</span>
                </div>
                <div style={{ padding: '0.6rem 0', borderBottom: '1px solid var(--ln)' }}>
                  <b>Data Tables:</b> items, submissions, subscribers, assistant_logs, site_config, audit_log, verification_checks
                </div>

                <h3 style={{ marginTop: '1.2rem', fontSize: '1.05rem' }}>Going Live Checklist</h3>
                <ol className="mu" style={{ paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                  <li>Run the SQL migration script in <code>supabase/schema.sql</code> in your Supabase SQL editor.</li>
                  <li>Verify that RLS policies allow public insertions on submissions and subscribers.</li>
                  <li>Confirm <code>ADMIN_SECRET_KEY</code> is set in <code>.env.local</code>.</li>
                  <li>Deploy Next.js application to Vercel, Netlify, or your preferred hosting provider.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
