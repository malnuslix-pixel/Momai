'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/styles/control-room.css';
import { FeedItem, Submission, SiteFlags, SiteConfig, VerificationCheck, AuditLogEntry, AssistantLog, AiSettings, PricingSettings, LeaderboardSettings } from '@/lib/types';
import { SEED_CONFIG } from '@/lib/supabase';
import { CmsData, DEFAULT_CMS_DATA, mergeCmsData } from '@/lib/cms';
import { DEFAULT_LEADERBOARD_SETTINGS, DEFAULT_PRICING_SETTINGS } from '@/lib/site-controls';
import AdminCmsPanel from '@/components/admin/AdminCmsPanel';
import AdminTitlesPanel from '@/components/admin/AdminTitlesPanel';
import AdminPricingPanel from '@/components/admin/AdminPricingPanel';
import AdminLeaderboardPanel from '@/components/admin/AdminLeaderboardPanel';

type TabType = 'overview' | 'content' | 'titles' | 'inbox' | 'audience' | 'assistant' | 'pricing' | 'leaderboard' | 'health' | 'config' | 'ops';

const TABS: [TabType, string][] = [
  ['overview', 'Overview'],
  ['content', 'Content & CMS'],
  ['titles', 'Site titles'],
  ['inbox', 'Inbox'],
  ['audience', 'Audience'],
  ['assistant', 'AI Tutor & Assistant'],
  ['pricing', 'Pricing & M-Pesa'],
  ['leaderboard', 'Leaderboard & XP'],
  ['health', 'Health & checks'],
  ['config', 'Site flags'],
  ['ops', 'Operations'],
];

const DEFAULT_AI_CONTROLS: AiSettings = {
  tutorEnabled: true,
  assistantEnabled: true,
  allowFallback: true,
  dailyCap: 3000,
  tutorGuidance: '',
};

const CK_LABELS = [
  'Verified phone or organization email',
  'No fee requested from applicants or learners',
  'Dates and location match official records',
];

export default function AdminPage() {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccounts, setHasAccounts] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [signedInAdminEmail, setSignedInAdminEmail] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authSecretKey, setAuthSecretKey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [tab, setTab] = useState<TabType>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [config, setConfig] = useState<SiteConfig>(SEED_CONFIG);
  const [checks, setChecks] = useState<VerificationCheck[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [aiSettings, setAiSettings] = useState<AiSettings>(DEFAULT_AI_CONTROLS);
  const [aiSettingsSaving, setAiSettingsSaving] = useState(false);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [pricingSaving, setPricingSaving] = useState(false);
  const [leaderboardSettings, setLeaderboardSettings] = useState<LeaderboardSettings>(DEFAULT_LEADERBOARD_SETTINGS);
  const [leaderboardSaving, setLeaderboardSaving] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ status: string; timestamp?: string } | null>(null);
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

  // AI Dashboard State
  const [aiUploadText, setAiUploadText] = useState('');
  const [aiUploadLoading, setAiUploadLoading] = useState(false);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [aiBriefLoading, setAiBriefLoading] = useState(false);
  const [aiScreenings, setAiScreenings] = useState<Record<string, { riskLevel: string; summary: string; suggestedChecks: [boolean, boolean, boolean]; recommendation: string }>>({});
  const [aiScreeningRef, setAiScreeningRef] = useState<string | null>(null);
  const [cmsData, setCmsData] = useState<CmsData>(DEFAULT_CMS_DATA);
  const [contentSubTab, setContentSubTab] = useState<'jobs' | 'news' | 'courses' | 'learning' | 'games'>('jobs');
  const [recentAssistantLogs, setRecentAssistantLogs] = useState<AssistantLog[]>([]);
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({});
  const [aiReplyRef, setAiReplyRef] = useState<string | null>(null);
  const [aiTrends, setAiTrends] = useState<string | null>(null);
  const [aiTrendsLoading, setAiTrendsLoading] = useState(false);

  // Sync with hash if present
  useEffect(() => {
    // Verify server-side session & whether admin account(s) exist
    fetch('/api/admin/auth')
      .then((r) => r.json())
      .then((data) => {
        const accountsExist = Boolean(data.hasAccounts);
        setHasAccounts(accountsExist);
        if (data.ok && data.authenticated) {
          setIsAuthenticated(true);
          setSignedInAdminEmail(data.adminEmail || null);
          loadData();
        } else {
          setIsAuthenticated(false);
          setAuthMode(accountsExist ? 'login' : 'register');
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const email = authEmail.trim().toLowerCase();
    const password = authPassword;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setAuthError('Please enter a valid administrator email address.');
      setAuthLoading(false);
      return;
    }

    if (authMode === 'register') {
      if (password.length < 8) {
        setAuthError('Password must be at least 8 characters long.');
        setAuthLoading(false);
        return;
      }
      if (password !== authConfirmPassword) {
        setAuthError('Passwords do not match.');
        setAuthLoading(false);
        return;
      }
      if (!authSecretKey.trim()) {
        setAuthError('Administrator secret key is required to create an account.');
        setAuthLoading(false);
        return;
      }
    } else if (!password) {
      setAuthError('Please enter your account password.');
      setAuthLoading(false);
      return;
    }

    try {
      const payload =
        authMode === 'register'
          ? { mode: 'register', email, password, secretKey: authSecretKey.trim() }
          : { mode: 'login', email, password };

      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setIsAuthenticated(true);
        setHasAccounts(true);
        setSignedInAdminEmail(data.adminEmail || email);
        setAuthPassword('');
        setAuthConfirmPassword('');
        setAuthSecretKey('');
        setAuthLoading(false);
        loadData();
      } else {
        if (data.hasAccounts === false) {
          setHasAccounts(false);
          setAuthMode('register');
        }
        setAuthError(data.message || 'Authentication failed. Check your credentials.');
        setAuthLoading(false);
      }
    } catch {
      setAuthError('Connection error during authentication. Please retry.');
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch {}
    setIsAuthenticated(false);
    setAuthMode('login');
    setSignedInAdminEmail(null);
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
    setAuthSecretKey('');
    setAuthError(null);
  };

  // Fetch live data from API endpoints
  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, subsRes, configRes, statsRes, cmsRes, healthRes] = await Promise.allSettled([
        fetch('/api/items?all=true').then((r) => r.json()),
        fetch('/api/submissions?filter=all').then((r) => r.json()),
        fetch('/api/config', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/stats', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/cms', { cache: 'no-store' }).then((r) => r.json()),
        fetch('/api/health', { cache: 'no-store' }).then((r) => r.json()),
      ]);

      if (itemsRes.status === 'fulfilled' && itemsRes.value.ok && Array.isArray(itemsRes.value.items)) {
        setItems(itemsRes.value.items);
      }
      if (subsRes.status === 'fulfilled' && subsRes.value.ok && Array.isArray(subsRes.value.submissions)) {
        setSubmissions(subsRes.value.submissions);
      }
      if (configRes.status === 'fulfilled' && configRes.value.ok) {
        if (configRes.value.flags) {
          setConfig((prev) => ({ ...prev, flags: configRes.value.flags, banner: configRes.value.banner }));
          setBannerText(configRes.value.banner.text);
          setBannerActive(configRes.value.banner.active);
        }
        if (Array.isArray(configRes.value.checks)) {
          setChecks(configRes.value.checks);
        }
        if (configRes.value.aiSettings) {
          setAiSettings({ ...DEFAULT_AI_CONTROLS, ...configRes.value.aiSettings });
        }
        if (configRes.value.pricingSettings) {
          setPricingSettings(configRes.value.pricingSettings);
        }
        if (configRes.value.leaderboardSettings) {
          setLeaderboardSettings(configRes.value.leaderboardSettings);
        }
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
        setLiveStats(statsRes.value);
        if (Array.isArray(statsRes.value.audit)) setAuditLogs(statsRes.value.audit);
        if (Array.isArray(statsRes.value.recentAssistantLogs)) {
          setRecentAssistantLogs(statsRes.value.recentAssistantLogs);
        }
      }
      if (cmsRes.status === 'fulfilled' && cmsRes.value.ok && cmsRes.value.cms) {
        setCmsData(mergeCmsData(cmsRes.value.cms));
      }
      if (healthRes.status === 'fulfilled' && healthRes.value) {
        setHealthStatus(healthRes.value);
      }
    } catch (e) {
      console.warn('Admin offline/local mode:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleSaveAiSettings = async (override?: Partial<AiSettings>) => {
    const nextAi = { ...aiSettings, ...(override || {}) };
    setAiSettings(nextAi);
    setAiSettingsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiSettings: nextAi }),
      });
      const json = await res.json();
      if (json.ok) {
        setConfig((prev) => ({ ...prev, flags: { ...prev.flags, ai: nextAi.assistantEnabled } }));
        showToast('AI Tutor & Assistant controls saved!');
      } else {
        showToast('Failed to save AI controls.');
      }
    } catch {
      showToast('Network error saving AI controls.');
    } finally {
      setAiSettingsSaving(false);
    }
  };

  const handleSavePricingSettings = async (next: PricingSettings) => {
    setPricingSettings(next);
    setPricingSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pricingSettings: next }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast('Pricing & M-Pesa settings saved!');
      } else {
        showToast('Failed to save pricing settings.');
      }
    } catch {
      showToast('Network error saving pricing settings.');
    } finally {
      setPricingSaving(false);
    }
  };

  const handleSaveLeaderboardSettings = async (next: LeaderboardSettings) => {
    setLeaderboardSettings(next);
    setLeaderboardSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leaderboardSettings: next }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast('Leaderboard controls saved!');
      } else {
        showToast('Failed to save leaderboard settings.');
      }
    } catch {
      showToast('Network error saving leaderboard settings.');
    } finally {
      setLeaderboardSaving(false);
    }
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
        showToast('New item added!');
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
    // Strictly enforce 3-point editorial checklist prior to approval
    const target = submissions.find((s) => s.ref === ref);
    if (action === 'approve' && target) {
      const allChecked = target.checks.every((c) => Boolean(c));
      if (!allChecked) {
        alert('Editorial Policy: All 3 verification checks must be completed before approving a submission.');
        return;
      }
    }

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
    if (key === 'ai') {
      setAiSettings((prev) => ({ ...prev, assistantEnabled: nextFlags.ai }));
    }
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
      showToast('Emergency banner saved!');
    } catch {}
  };

  // AI Dashboard Handlers
  const runAIUploadExtract = async (textToExtract?: string, fileName?: string) => {
    const payloadText = (textToExtract ?? aiUploadText).trim();
    if (!payloadText) {
      showToast('Upload a file or paste circular/job text first.');
      return;
    }
    setAiUploadLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'extract_upload', text: payloadText, fileName }),
      });
      const data = await res.json();
      if (data.ok && data.item) {
        setNewItem((prev) => ({
          ...prev,
          k: data.item.k || prev.k,
          t: data.item.t || prev.t,
          who: data.item.who || prev.who,
          loc: data.item.loc || prev.loc,
          cat: data.item.cat || prev.cat,
          body: data.item.body || prev.body,
          exp: data.item.exp || prev.exp,
        }));
        showToast(`AI extracted fields (${data.provider}). Review & publish!`);
      } else {
        showToast(data.error || 'AI extraction failed.');
      }
    } catch {
      showToast('Network error during AI extraction.');
    } finally {
      setAiUploadLoading(false);
    }
  };

  const handleAIFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await file.text();
      setAiUploadText(content.slice(0, 6000));
      await runAIUploadExtract(content.slice(0, 6000), file.name);
    } catch {
      showToast('Could not read file text. Paste the circular text instead.');
    }
  };

  const handleAIDraftItem = async (lang: 'en' | 'sw' = 'en') => {
    setAiDraftLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'draft_item', ...newItem, lang }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setNewItem((prev) => ({ ...prev, body: data.text }));
        showToast(`AI drafted listing (${lang.toUpperCase()}).`);
      }
    } catch {
      showToast('Could not draft with AI.');
    } finally {
      setAiDraftLoading(false);
    }
  };

  const handleAIScreenSubmission = async (sub: Submission) => {
    setAiScreeningRef(sub.ref);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'screen_submission', submission: sub }),
      });
      const data = await res.json();
      if (data.ok && data.screening) {
        setAiScreenings((prev) => ({ ...prev, [sub.ref]: data.screening }));
        showToast(`AI screened ${sub.ref}: ${data.screening.riskLevel}`);
      }
    } catch {
      showToast('AI screening failed.');
    } finally {
      setAiScreeningRef(null);
    }
  };

  const handleApplyAIChecks = async (ref: string, suggested: [boolean, boolean, boolean]) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.ref === ref ? { ...s, checks: [...suggested] as [boolean, boolean, boolean] } : s))
    );
    try {
      await Promise.all(
        suggested.map((val, idx) =>
          fetch('/api/submissions', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ref, checkIndex: idx, checkValue: val }),
          })
        )
      );
      showToast(`Applied AI suggested checks to ${ref}.`);
    } catch {}
  };

  const handleAIOpsBrief = async () => {
    setAiBriefLoading(true);
    try {
      const expiredCount = items.filter(
        (i) => i.st === 'published' && i.exp && new Date(i.exp + 'T00:00:00Z') < new Date()
      ).length;
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ops_brief',
          stats: {
            waitingCount: waitingSubs.length,
            lateCount: lateWaiting.length,
            publishedCount: items.filter((i) => i.st === 'published').length,
            expiredCount,
            recentAudit: auditLogs.slice(0, 5),
          },
        }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setAiBrief(data.text);
      }
    } catch {
      showToast('Failed to generate AI editorial brief.');
    } finally {
      setAiBriefLoading(false);
    }
  };

  const handleAIDraftBanner = async () => {
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'draft_item',
          k: 'notice',
          t: 'Urgent Public Advisory Banner',
          notes: bannerText || 'Official KNEC exam dates and results scam warning',
          lang: 'en',
        }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setBannerText(data.text);
        showToast('AI polished emergency banner.');
      }
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

  const handleAIDraftReply = async (sub: Submission) => {
    setAiReplyRef(sub.ref);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'draft_reply', submission: sub }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setAiReplies((prev) => ({ ...prev, [sub.ref]: data.text }));
        showToast(`AI drafted reply for ${sub.ref}.`);
      }
    } catch {
      showToast('AI reply draft failed.');
    } finally {
      setAiReplyRef(null);
    }
  };

  const handleAnalyzeAssistant = async () => {
    setAiTrendsLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze_assistant', logs: recentAssistantLogs }),
      });
      const data = await res.json();
      if (data.ok && data.text) setAiTrends(data.text);
    } catch {
      showToast('Assistant trend analysis failed.');
    } finally {
      setAiTrendsLoading(false);
    }
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

  if (isAuthenticated === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0e1a0f',
        color: '#7fc080',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <p>Loading Admin Portal…</p>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#0e1a0f',
        color: '#f1f1ec',
        padding: '1.5rem',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          background: '#16251a',
          border: '1px solid #2a3d2d',
          borderRadius: '16px',
          padding: '2.4rem 2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>🛡️</div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#7fc080', fontSize: '1.65rem', margin: 0 }}>
              {authMode === 'register' ? 'Create Admin Account' : 'Staff Admin Sign In'}
            </h1>
            <p style={{ color: '#b8c2b9', fontSize: '0.88rem', marginTop: '0.4rem', lineHeight: 1.45 }}>
              {authMode === 'register'
                ? 'Register your administrator email and password using the authorized server secret key.'
                : 'Sign in with your registered administrator email and password.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.2rem' }}>
            <button
              type="button"
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
              style={{
                padding: '0.55rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.22)',
                background: authMode === 'login' ? '#143215' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              style={{
                padding: '0.55rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.22)',
                background: authMode === 'register' ? '#143215' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Create Account
            </button>
          </div>

          {!hasAccounts && authMode === 'register' && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.14)',
              border: '1px solid rgba(245, 158, 11, 0.38)',
              color: '#fde68a',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              lineHeight: 1.45,
            }}>
              First-time setup: create an administrator account. Future visits will require signing in with your email and password.
            </div>
          )}

          {authError && (
            <div style={{
              background: 'rgba(231, 76, 60, 0.15)',
              border: '1px solid rgba(231, 76, 60, 0.4)',
              color: '#fca5a5',
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '1.2rem',
              textAlign: 'center'
            }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="admin-user" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d6efd6', marginBottom: '0.35rem' }}>
                Admin Email
              </label>
              <input
                id="admin-user"
                type="email"
                autoComplete="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@mwalimufamily.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: '#0e1a0f',
                  border: '1px solid #2a3d2d',
                  color: '#fff',
                  font: 'inherit',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label htmlFor="admin-pass" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d6efd6' }}>
                  {authMode === 'register' ? 'Account Password (min 8 chars)' : 'Account Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d1dcd2',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="admin-pass"
                type={showPassword ? 'text' : 'password'}
                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                required
                minLength={authMode === 'register' ? 8 : 1}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder={authMode === 'register' ? 'Choose a strong password' : 'Enter your password'}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '8px',
                  background: '#0e1a0f',
                  border: '1px solid #2a3d2d',
                  color: '#fff',
                  font: 'inherit',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {authMode === 'register' && (
              <>
                <div>
                  <label htmlFor="admin-confirm-pass" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d6efd6', marginBottom: '0.35rem' }}>
                    Confirm Password
                  </label>
                  <input
                    id="admin-confirm-pass"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '8px',
                      background: '#0e1a0f',
                      border: '1px solid #2a3d2d',
                      color: '#fff',
                      font: 'inherit',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label htmlFor="admin-secret-key" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d6efd6' }}>
                      Admin Secret Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d1dcd2',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {showSecretKey ? 'Hide Key' : 'Show Key'}
                    </button>
                  </div>
                  <input
                    id="admin-secret-key"
                    type={showSecretKey ? 'text' : 'password'}
                    autoComplete="off"
                    required
                    value={authSecretKey}
                    onChange={(e) => setAuthSecretKey(e.target.value)}
                    placeholder="Enter authorization secret key"
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.9rem',
                      borderRadius: '8px',
                      background: '#0e1a0f',
                      border: '1px solid #2a3d2d',
                      color: '#fff',
                      font: 'inherit',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={authLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                background: '#143215',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: authLoading ? 'wait' : 'pointer',
                marginTop: '0.4rem',
                transition: 'background 0.2s',
                opacity: authLoading ? 0.7 : 1
              }}
            >
              {authLoading
                ? 'Verifying Credentials…'
                : authMode === 'register'
                ? 'Create Admin Account →'
                : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div style={{ marginTop: '1.8rem', textAlign: 'center', borderTop: '1px solid #2a3d2d', paddingTop: '1.2rem' }}>
            <Link
              href="/"
              style={{
                color: '#b8c2b9',
                fontSize: '0.88rem',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}
            >
              ← Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <h1>Mwalimu Family · Admin Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="p ok">System Online</span>
          {signedInAdminEmail && <span className="p">{signedInAdminEmail}</span>}
          <button className="b s" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
          </button>
          <button className="b s" onClick={loadData} disabled={loading}>
            {loading ? 'Refreshing…' : '↻ Refresh Data'}
          </button>
          <button
            type="button"
            className="b s"
            onClick={() => changeTab('assistant')}
          >
            🤖 AI Tutor
          </button>
          <button
            type="button"
            className="b s"
            onClick={() => changeTab('pricing')}
          >
            💳 Pricing
          </button>
          <button
            type="button"
            className="b s"
            onClick={() => changeTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
          <Link href="/" className="b s" style={{ background: '#143215', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', textDecoration: 'none' }}>
            ← Public Site
          </Link>
          <button
            className="b s"
            style={{ background: '#c0392b', color: '#fff' }}
            onClick={handleSignOut}
          >
            🔒 Sign Out
          </button>
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
        {/* TAB 1: OVERVIEW (100% LIVE METRICS) */}
        {/* ========================================================================= */}
        {tab === 'overview' && (
          <div>
            {/* Live Operational KPI Cards */}
            <div className="grid">
              {[
                ['Published Jobs & Notices', String(liveStats?.publishedItems ?? items.filter((i) => i.st === 'published').length), `${liveStats?.jobsCount ?? items.filter((i) => i.k === 'job' && i.st === 'published').length} jobs · ${liveStats?.noticesCount ?? items.filter((i) => i.k === 'notice' && i.st === 'published').length} notices`, 'up'],
                ['Published News Stories', String(cmsData.news.articles.length), 'Managed in Content & CMS', 'up'],
                ['Courses & Study Packs', String(cmsData.courses.length + cmsData.learning.materials.length + cmsData.teaching.length), `${cmsData.courses.length} courses · ${cmsData.learning.materials.length} packs · ${cmsData.teaching.length} templates`, 'up'],
                ['Submissions Waiting', String(waitingSubs.length), waitingSubs.length > 0 ? 'Review in Inbox' : 'Inbox clear', waitingSubs.length > 0 ? 'dn' : 'up'],
                ['Registered Subscribers', String(liveStats?.subscribers ?? 0), 'Live subscribers database', 'up'],
                ['Ask Mwalimu Questions', String(liveStats?.assistantTotal ?? 0), `${liveStats?.assistantToday ?? 0} today · ${liveStats?.fallbackRate ?? 0}% fallback`, 'mu'],
                ['AI Tutor Sessions', String(liveStats?.tutorTotal ?? 0), `${liveStats?.tutorToday ?? 0} prompts today (${liveStats?.uniqueTutorSessions ?? 0} sessions)`, 'up'],
                ['Tracked XP Learners', String(liveStats?.activeLearnersCount ?? 0), 'Leaderboard & streak profiles', 'up'],
              ].map((k, idx) => (
                <div key={idx} className="card kpi">
                  <span className="mu">{k[0]}</span>
                  <b>{k[1]}</b>
                  <span className={`${k[3]} mu`}>{k[2]}</span>
                </div>
              ))}
            </div>

            {/* Real 7-Day Platform Activity */}
            <div className="card">
              <h2>Platform activity, last 7 days (live database records)</h2>
              {Array.isArray(liveStats?.activity7d) && liveStats.activity7d.length > 0 ? (
                <div className="sc">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>AI &amp; Tutor Queries</th>
                        <th>Form Submissions</th>
                        <th>New Subscribers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveStats.activity7d.map((day: any) => (
                        <tr key={day.date}>
                          <td><b>{day.label}</b></td>
                          <td>{day.aiQueries}</td>
                          <td>{day.submissions}</td>
                          <td>{day.subscribers}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mu" style={{ margin: 0 }}>Loading live 7-day activity metrics…</p>
              )}
            </div>

            {/* Live Action & Status Cards */}
            <div className="grid g2">
              <div className="card">
                <h2>Needs attention</h2>
                <ul className="mu" style={{ paddingLeft: '1.2rem', lineHeight: 1.7 }}>
                  {lateWaiting.length > 0 ? (
                    <li>
                      <b style={{ color: 'var(--bad)' }}>{lateWaiting.length} form submission(s)</b> past the 48-hour response target in Inbox.
                    </li>
                  ) : (
                    <li>All inbox submissions ({waitingSubs.length} waiting) are within 48h SLA.</li>
                  )}
                  {(liveStats?.draftItems ?? items.filter((i) => i.st === 'draft').length) > 0 && (
                    <li>{liveStats?.draftItems ?? items.filter((i) => i.st === 'draft').length} draft job/notice item(s) waiting for publish review in Content.</li>
                  )}
                  {checks.filter((c) => !c.last).length > 0 && (
                    <li>{checks.filter((c) => !c.last).length} editorial accuracy check(s) pending review in Health &amp; checks.</li>
                  )}
                  <li>
                    AI Controls: AI Tutor is <b>{aiSettings.tutorEnabled ? 'Active' : 'Paused'}</b> · Ask Mwalimu is <b>{aiSettings.assistantEnabled ? 'Active' : 'Paused'}</b>.
                  </li>
                </ul>
              </div>

              <div className="card">
                <h2>Live AI &amp; System Status</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Database Engine</span>
                    <b>{liveStats?.systemStatus || 'Connecting…'}</b>
                  </div>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Gemini API Key</span>
                    <b>{liveStats?.hasGeminiKey ? 'Configured' : 'Missing'}</b>
                  </div>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Emergency Scam Banner</span>
                    <b>{bannerActive ? 'Visible on site' : 'Hidden'}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Editorial & Operations Brief */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <h2 style={{ margin: 0 }}>AI Editorial &amp; Operations Brief</h2>
                <button className="b s" onClick={handleAIOpsBrief} disabled={aiBriefLoading}>
                  {aiBriefLoading ? 'Analyzing…' : 'Generate AI Brief'}
                </button>
              </div>
              {aiBrief ? (
                <div style={{ background: 'var(--chip)', padding: '0.9rem', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '0.92rem' }}>
                  {aiBrief}
                </div>
              ) : (
                <p className="mu" style={{ margin: 0 }}>
                  Click &ldquo;Generate AI Brief&rdquo; to summarize live inbox SLA status, expiring notices, and editorial priorities.
                </p>
              )}
            </div>

            <div className="card">
              <h2>Recent activity</h2>
              {auditLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {auditLogs.slice(0, 6).map((log, i) => (
                    <div key={i} className="al">
                      <span className="mu">{log.t || 'Just now'}</span>
                      <span>{log.m || log.action}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mu" style={{ margin: 0 }}>No admin audit events recorded yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CONTENT & FULL CMS */}
        {/* ========================================================================= */}
        {tab === 'content' && (
          <div>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {(
                [
                  ['jobs', 'Jobs & Notices'],
                  ['news', `📰 News (${cmsData.news.articles.length})`],
                  ['courses', `🎓 Courses (${cmsData.courses.length})`],
                  ['learning', `📚 Learning & Teaching (${cmsData.learning.materials.length + cmsData.teaching.length})`],
                  ['games', '🎮 Games & Quizzes'],
                ] as const
              ).map(([k, lbl]) => (
                <button
                  key={k}
                  type="button"
                  className={`b ${contentSubTab === k ? '' : 's'}`}
                  onClick={() => setContentSubTab(k)}
                >
                  {lbl}
                </button>
              ))}
            </div>

            {contentSubTab !== 'jobs' ? (
              <AdminCmsPanel
                cms={cmsData}
                onCmsUpdated={setCmsData}
                showToast={showToast}
                subTab={contentSubTab}
              />
            ) : (
            <>
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

            {/* AI Document Upload & Circular Extractor */}
            <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
              <h2>AI Document Upload &amp; Circular Parser</h2>
              <p className="mu" style={{ marginBottom: '0.8rem' }}>
                Upload a text/markdown/CSV circular or paste a school job advert / MoE memo. AI will automatically extract the fields below.
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.7rem' }}>
                <input
                  type="file"
                  accept=".txt,.md,.csv,.json,.doc,.html"
                  onChange={handleAIFileSelect}
                  aria-label="Upload document for AI extraction"
                />
                <button
                  type="button"
                  className="b s"
                  onClick={() => runAIUploadExtract()}
                  disabled={aiUploadLoading}
                >
                  {aiUploadLoading ? 'Extracting…' : 'Extract Fields with AI'}
                </button>
              </div>
              <textarea
                rows={3}
                value={aiUploadText}
                onChange={(e) => setAiUploadText(e.target.value)}
                placeholder="Or paste circular, memo, or job vacancy text here..."
                style={{ width: '100%' }}
              />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.35rem' }}>
                    <label style={{ margin: 0 }}>Description / Listing Details</label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="b s"
                        onClick={() => handleAIDraftItem('en')}
                        disabled={aiDraftLoading}
                      >
                        {aiDraftLoading ? 'Drafting…' : 'Draft / Polish EN'}
                      </button>
                      <button
                        type="button"
                        className="b s"
                        onClick={() => handleAIDraftItem('sw')}
                        disabled={aiDraftLoading}
                      >
                        🌍 Polish SW
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={newItem.body}
                    onChange={(e) => setNewItem({ ...newItem, body: e.target.value })}
                    placeholder="Provide responsibilities, requirements, application instructions..."
                    required
                  />
                </div>

                <button type="submit" className="b">
                  Publish Item
                </button>
              </form>
            </div>
            </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2B: SITE TITLES & BRANDING */}
        {/* ========================================================================= */}
        {tab === 'titles' && (
          <AdminTitlesPanel
            cms={cmsData}
            onCmsUpdated={setCmsData}
            showToast={showToast}
          />
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

                      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                        <button
                          type="button"
                          className="b s"
                          onClick={() => handleAIScreenSubmission(sub)}
                          disabled={aiScreeningRef === sub.ref}
                        >
                          {aiScreeningRef === sub.ref ? 'Screening…' : '🤖 AI Pre-Screen'}
                        </button>
                        <button
                          type="button"
                          className="b s"
                          onClick={() => handleAIDraftReply(sub)}
                          disabled={aiReplyRef === sub.ref}
                        >
                          {aiReplyRef === sub.ref ? 'Drafting…' : 'AI Draft Reply'}
                        </button>
                      </div>

                      {aiReplies[sub.ref] && (
                        <div style={{ marginTop: '0.7rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--chip)', fontSize: '0.88rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <b>Suggested Reply ({sub.from_name})</b>
                            <a
                              className="b s"
                              style={{ textDecoration: 'none' }}
                              href={`https://wa.me/?text=${encodeURIComponent(aiReplies[sub.ref])}`}
                              target="_blank"
                              rel="noopener"
                            >
                              Send via WhatsApp →
                            </a>
                          </div>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{aiReplies[sub.ref]}</p>
                        </div>
                      )}

                      {aiScreenings[sub.ref] && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: '8px', background: 'var(--chip)', borderLeft: `4px solid ${aiScreenings[sub.ref].riskLevel === 'High Risk' ? 'var(--bad)' : aiScreenings[sub.ref].riskLevel === 'Low Risk' ? 'var(--ok)' : '#f4a261'}`, fontSize: '0.88rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <b>AI Assessment: {aiScreenings[sub.ref].riskLevel} ({aiScreenings[sub.ref].recommendation})</b>
                            <button
                              type="button"
                              className="b s"
                              onClick={() => handleApplyAIChecks(sub.ref, aiScreenings[sub.ref].suggestedChecks)}
                            >
                              Apply Suggested Checks
                            </button>
                          </div>
                          <p className="mu" style={{ margin: '0.35rem 0 0' }}>{aiScreenings[sub.ref].summary}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AUDIENCE (REAL DATABASE AGGREGATIONS) */}
        {/* ========================================================================= */}
        {tab === 'audience' && (
          <div>
            <div className="grid g2">
              <div className="card">
                <h2>Registered Subscribers by Channel ({liveStats?.subscribers ?? 0})</h2>
                {Array.isArray(liveStats?.subscribersByChannel) && liveStats.subscribersByChannel.length > 0 ? (
                  liveStats.subscribersByChannel.map(([chan, cnt]: [string, number], i: number) => (
                    <div key={i} className="hb">
                      <span>{chan}</span>
                      <i style={{ width: `${Math.min(100, Math.round((cnt / Math.max(1, liveStats.subscribers)) * 100))}%` }} />
                      <b>{cnt}</b>
                    </div>
                  ))
                ) : (
                  <p className="mu" style={{ margin: 0 }}>No subscriber records found in database yet.</p>
                )}
              </div>

              <div className="card">
                <h2>Community Submissions by Type ({liveStats?.totalSubmissions ?? submissions.length})</h2>
                {Array.isArray(liveStats?.submissionsByType) && liveStats.submissionsByType.length > 0 ? (
                  liveStats.submissionsByType.map(([lbl, cnt]: [string, number], i: number) => (
                    <div key={i} className="hb">
                      <span>{lbl}</span>
                      <i style={{ width: `${Math.min(100, Math.round((cnt / Math.max(1, liveStats.totalSubmissions)) * 100))}%` }} />
                      <b>{cnt}</b>
                    </div>
                  ))
                ) : (
                  <p className="mu" style={{ margin: 0 }}>No submissions logged yet.</p>
                )}
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Counties &amp; Locations in Profiles &amp; Listings</h2>
                {Array.isArray(liveStats?.locationsBreakdown) && liveStats.locationsBreakdown.length > 0 ? (
                  liveStats.locationsBreakdown.map(([loc, cnt]: [string, number], i: number) => (
                    <div key={i} className="hb">
                      <span>{loc}</span>
                      <i style={{ width: `${Math.min(100, cnt * 15)}%` }} />
                      <b>{cnt}</b>
                    </div>
                  ))
                ) : (
                  <p className="mu" style={{ margin: 0 }}>No location metadata recorded yet.</p>
                )}
              </div>

              <div className="card">
                <h2>Learner Engagement Overview</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Tracked XP Learner Profiles</span>
                    <b>{liveStats?.activeLearnersCount ?? 0}</b>
                  </div>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Unique AI Tutor Study Sessions</span>
                    <b>{liveStats?.uniqueTutorSessions ?? 0}</b>
                  </div>
                  <div className="al" style={{ justifyContent: 'space-between' }}>
                    <span>Approved Community Submissions</span>
                    <b>{liveStats?.submissionsApproved ?? approvedSubs.length}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AI TUTOR & ASSISTANT CONTROLS */}
        {/* ========================================================================= */}
        {tab === 'assistant' && (
          <div>
            <div className="grid">
              <div className="card kpi">
                <span className="mu">Ask Mwalimu Total</span>
                <b>{liveStats?.assistantTotal ?? 0}</b>
                <span className="up mu">{liveStats?.assistantToday ?? 0} asked today</span>
              </div>
              <div className="card kpi">
                <span className="mu">AI Tutor Turns</span>
                <b>{liveStats?.tutorTotal ?? 0}</b>
                <span className="up mu">{liveStats?.tutorToday ?? 0} today · {liveStats?.uniqueTutorSessions ?? 0} sessions</span>
              </div>
              <div className="card kpi">
                <span className="mu">Fallback Rate</span>
                <b>{liveStats?.fallbackRate ?? 0}%</b>
                <span className="mu">Across logged queries</span>
              </div>
              <div className="card kpi">
                <span className="mu">Daily Question Cap</span>
                <b>{aiSettings.dailyCap.toLocaleString()}</b>
                <span className="mu">
                  {(liveStats?.assistantToday ?? 0) + (liveStats?.tutorToday ?? 0)} used today
                </span>
              </div>
            </div>

            <div className="grid g2">
              <div className="card">
                <h2>Most common logged topics</h2>
                {Array.isArray(liveStats?.topTopics) && liveStats.topTopics.length > 0 ? (
                  liveStats.topTopics.map(([topic, count]: [string, number], i: number) => {
                    const maxCnt = liveStats.topTopics[0][1] || 1;
                    return (
                      <div key={i} className="hb">
                        <span>{topic}</span>
                        <i style={{ width: `${Math.round((count / maxCnt) * 100)}%` }} />
                        <b>{count}</b>
                      </div>
                    );
                  })
                ) : (
                  <p className="mu" style={{ margin: 0 }}>Topic distribution will populate as users query Ask Mwalimu and AI Tutor.</p>
                )}
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <h2 style={{ margin: 0 }}>AI Tutor &amp; Assistant Controls</h2>
                  <Link href="/tutor" className="b s" style={{ textDecoration: 'none' }}>Open /tutor →</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.assistantEnabled}
                      onChange={(e) => setAiSettings({ ...aiSettings, assistantEnabled: e.target.checked })}
                    />
                    <b>Enable Floating &ldquo;Ask Mwalimu&rdquo; Assistant</b>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.tutorEnabled}
                      onChange={(e) => setAiSettings({ ...aiSettings, tutorEnabled: e.target.checked })}
                    />
                    <b>Enable Full AI Tutor Workspace (/tutor)</b>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={aiSettings.allowFallback}
                      onChange={(e) => setAiSettings({ ...aiSettings, allowFallback: e.target.checked })}
                    />
                    <b>Automatic fallback to Kenyan CBE knowledge engine</b>
                  </label>
                  <div>
                    <label htmlFor="ai-daily-cap">Daily question cap (shared across Chat &amp; Tutor)</label>
                    <input
                      id="ai-daily-cap"
                      type="number"
                      min={10}
                      max={100000}
                      value={aiSettings.dailyCap}
                      onChange={(e) => setAiSettings({ ...aiSettings, dailyCap: Number(e.target.value) || 3000 })}
                      style={{ width: '140px', marginLeft: '0.5rem' }}
                    />
                  </div>
                  <div>
                    <label htmlFor="ai-guidance">Editorial AI Prompt Guidance (appended to AI Tutor &amp; Assistant)</label>
                    <textarea
                      id="ai-guidance"
                      rows={3}
                      value={aiSettings.tutorGuidance}
                      onChange={(e) => setAiSettings({ ...aiSettings, tutorGuidance: e.target.value })}
                      placeholder="Optional term reminder, syllabus emphasis, or scam notice rule for the AI Tutor..."
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="b"
                      disabled={aiSettingsSaving}
                      onClick={() => handleSaveAiSettings()}
                    >
                      {aiSettingsSaving ? 'Saving…' : 'Save AI Controls'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <h2 style={{ margin: 0 }}>Recent AI Conversations &amp; Topic Trends</h2>
                <button type="button" className="b s" onClick={handleAnalyzeAssistant} disabled={aiTrendsLoading}>
                  {aiTrendsLoading ? 'Analyzing…' : 'Analyze Questions with AI'}
                </button>
              </div>
              {aiTrends && (
                <div style={{ background: 'var(--chip)', padding: '0.85rem', borderRadius: '8px', marginBottom: '0.8rem', whiteSpace: 'pre-wrap', lineHeight: 1.55, fontSize: '0.9rem' }}>
                  {aiTrends}
                </div>
              )}
              {recentAssistantLogs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {recentAssistantLogs.slice(0, 8).map((l, idx) => (
                    <div key={l.id || idx} className="al" style={{ justifyContent: 'space-between', gap: '0.8rem' }}>
                      <span><b>Q:</b> {l.question}</span>
                      <span className="mu">{l.model || 'gemini'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mu" style={{ margin: 0 }}>Live questions from Ask Mwalimu will stream here automatically.</p>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: PRICING & M-PESA */}
        {/* ========================================================================= */}
        {tab === 'pricing' && (
          <AdminPricingPanel
            settings={pricingSettings}
            onSave={handleSavePricingSettings}
            saving={pricingSaving}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB: LEADERBOARD & XP */}
        {/* ========================================================================= */}
        {tab === 'leaderboard' && (
          <AdminLeaderboardPanel
            settings={leaderboardSettings}
            onSave={handleSaveLeaderboardSettings}
            saving={leaderboardSaving}
            onNotify={showToast}
          />
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
                <h2>Live system diagnostics</h2>
                {[
                  ['Health Endpoint (/api/health)', healthStatus?.status === 'ok' ? 'Healthy' : 'Checking…', healthStatus?.status === 'ok'],
                  ['Supabase Database', liveStats?.systemStatus || 'Connecting…', liveStats?.systemStatus === 'Operational'],
                  ['Gemini AI Engine Key', liveStats?.hasGeminiKey ? 'Configured' : 'Missing', Boolean(liveStats?.hasGeminiKey)],
                  ['Admin Secret Key', liveStats?.hasAdminKey ? 'Configured' : 'Missing', Boolean(liveStats?.hasAdminKey)],
                  ['AI Tutor Workspace (/tutor)', aiSettings.tutorEnabled ? 'Enabled' : 'Paused', aiSettings.tutorEnabled],
                ].map(([svc, stat, ok], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--ln)' }}>
                    <span>{svc}</span>
                    <b style={{ color: ok ? 'var(--ok)' : 'var(--bad)' }}>{stat}</b>
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
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="button" className="b s" onClick={handleAIDraftBanner}>
                    Polish with AI
                  </button>
                  <button className="b" onClick={handleSaveBanner}>
                    Save Banner
                  </button>
                </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <h2 style={{ margin: 0 }}>AI Operations &amp; Audit Summary</h2>
                  <button className="b s" onClick={handleAIOpsBrief} disabled={aiBriefLoading}>
                    {aiBriefLoading ? 'Analyzing…' : 'Refresh AI Digest'}
                  </button>
                </div>
                {aiBrief ? (
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, margin: 0 }}>{aiBrief}</p>
                ) : (
                  <p className="mu" style={{ margin: 0 }}>
                    Click &ldquo;Refresh AI Digest&rdquo; to audit active queues, CMS counts ({cmsData.news.articles.length} news, {cmsData.courses.length} courses, {cmsData.learning.materials.length + cmsData.teaching.length} packs), and SLA targets.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
