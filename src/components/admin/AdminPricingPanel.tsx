'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PricingPlanConfig, PricingSettings } from '@/lib/types';

interface PaymentRow {
  id?: string | number;
  phone?: string;
  amount?: number;
  plan?: string;
  status?: string;
  mpesa_receipt?: string;
  result_desc?: string;
  checkout_request_id?: string;
  created_at?: string;
}

interface PricingSummary {
  totalPayments: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenueKes: number;
}

interface AdminPricingPanelProps {
  settings: PricingSettings;
  onSave: (next: PricingSettings) => Promise<void>;
  saving?: boolean;
}

export default function AdminPricingPanel({ settings, onSave, saving }: AdminPricingPanelProps) {
  const [draft, setDraft] = useState<PricingSettings>(settings);
  const [summary, setSummary] = useState<PricingSummary>({
    totalPayments: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalRevenueKes: 0,
  });
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  const loadPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch('/api/admin/controls?scope=pricing', { cache: 'no-store' });
      const data = await res.json();
      if (data.ok) {
        if (data.summary) setSummary(data.summary);
        setPayments(Array.isArray(data.payments) ? data.payments : []);
      }
    } catch {
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const updatePlan = (id: PricingPlanConfig['id'], patch: Partial<PricingPlanConfig>) => {
    setDraft((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Pricing &amp; Study Pass Control</h2>
          <p className="muted" style={{ margin: '0.2rem 0 0' }}>
            Configure Study Pass plans, KES pricing, M-Pesa checkout availability, and inspect live payments.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/pricing" className="b s" style={{ textDecoration: 'none' }}>
            ↗ Preview /pricing
          </Link>
          <button type="button" className="b s" onClick={loadPayments} disabled={loadingPayments}>
            {loadingPayments ? 'Refreshing…' : '↻ Refresh Payments'}
          </button>
          <button type="button" className="b p" onClick={() => onSave(draft)} disabled={saving}>
            {saving ? 'Saving…' : '💾 Save Pricing Settings'}
          </button>
        </div>
      </div>

      {/* Live M-Pesa KPIs */}
      <div className="kpis">
        <div className="k">
          <div className="l">Completed Revenue</div>
          <div className="v">KES {summary.totalRevenueKes.toLocaleString()}</div>
          <div className="s">{summary.completedCount} confirmed payments</div>
        </div>
        <div className="k">
          <div className="l">Total Checkouts</div>
          <div className="v">{summary.totalPayments}</div>
          <div className="s">Recorded STK requests</div>
        </div>
        <div className="k">
          <div className="l">Pending</div>
          <div className="v">{summary.pendingCount}</div>
          <div className="s">Awaiting PIN / callback</div>
        </div>
        <div className="k">
          <div className="l">Failed / Cancelled</div>
          <div className="v">{summary.failedCount}</div>
          <div className="s">Declined or timed out</div>
        </div>
      </div>

      {/* Global Pricing & M-Pesa Toggles */}
      <div className="card" style={{ padding: '1rem', display: 'grid', gap: '0.8rem' }}>
        <h3 style={{ margin: 0 }}>Checkout &amp; Page Controls</h3>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.pricingEnabled}
              onChange={(e) => setDraft({ ...draft, pricingEnabled: e.target.checked })}
            />
            <span>Public Pricing Page Enabled</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.mpesaEnabled}
              onChange={(e) => setDraft({ ...draft, mpesaEnabled: e.target.checked })}
            />
            <span>M-Pesa STK Push Checkout Enabled</span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            <span className="muted">Hero Heading</span>
            <input
              value={draft.heroTitle}
              onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
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

        <label style={{ display: 'grid', gap: '0.25rem' }}>
          <span className="muted">Hero Subtitle</span>
          <textarea
            rows={2}
            value={draft.heroSubtitle}
            onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })}
          />
        </label>
      </div>

      {/* Plan Cards Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
        {draft.plans.map((plan) => (
          <div key={plan.id} className="card" style={{ padding: '1rem', display: 'grid', gap: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ textTransform: 'uppercase', fontSize: '0.82rem', letterSpacing: '0.05em' }}>
                Plan: {plan.id}
              </strong>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={plan.enabled}
                  onChange={(e) => updatePlan(plan.id, { enabled: e.target.checked })}
                />
                Visible
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '0.5rem' }}>
              <label style={{ display: 'grid', gap: '0.2rem' }}>
                <span className="muted">Plan Name</span>
                <input
                  value={plan.name}
                  onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: '0.2rem' }}>
                <span className="muted">Price (KES)</span>
                <input
                  type="number"
                  min={0}
                  value={plan.price}
                  onChange={(e) => updatePlan(plan.id, { price: Math.max(0, Number(e.target.value) || 0) })}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <label style={{ display: 'grid', gap: '0.2rem' }}>
                <span className="muted">Billing Period</span>
                <input
                  value={plan.period}
                  placeholder="/month"
                  onChange={(e) => updatePlan(plan.id, { period: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: '0.2rem' }}>
                <span className="muted">CTA Button Text</span>
                <input
                  value={plan.cta}
                  onChange={(e) => updatePlan(plan.id, { cta: e.target.value })}
                />
              </label>
            </div>

            <label style={{ display: 'grid', gap: '0.2rem' }}>
              <span className="muted">Subtitle</span>
              <input
                value={plan.subtitle}
                onChange={(e) => updatePlan(plan.id, { subtitle: e.target.value })}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <input
                type="checkbox"
                checked={Boolean(plan.popular)}
                onChange={(e) => updatePlan(plan.id, { popular: e.target.checked })}
              />
              Highlight as Most Popular
            </label>

            <label style={{ display: 'grid', gap: '0.2rem' }}>
              <span className="muted">Features (one per line)</span>
              <textarea
                rows={5}
                value={plan.features.join('\n')}
                onChange={(e) =>
                  updatePlan(plan.id, {
                    features: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        ))}
      </div>

      {/* Live M-Pesa Transactions Table */}
      <div className="card" style={{ padding: '1rem' }}>
        <h3 style={{ margin: '0 0 0.7rem' }}>Recent M-Pesa Transactions</h3>
        {payments.length === 0 ? (
          <p className="muted" style={{ margin: 0 }}>
            No M-Pesa payment records found in the database yet.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.5rem' }}>Phone</th>
                  <th style={{ padding: '0.5rem' }}>Plan</th>
                  <th style={{ padding: '0.5rem' }}>Amount</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                  <th style={{ padding: '0.5rem' }}>Receipt</th>
                  <th style={{ padding: '0.5rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={p.id ?? p.checkout_request_id ?? idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.5rem' }}>{p.phone || '—'}</td>
                    <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{p.plan || '—'}</td>
                    <td style={{ padding: '0.5rem' }}>KES {Number(p.amount || 0).toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <span className={`p ${p.status === 'completed' ? 'ok' : p.status === 'failed' ? 'err' : ''}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: '0.5rem' }}>{p.mpesa_receipt || p.result_desc || '—'}</td>
                    <td style={{ padding: '0.5rem' }}>{p.created_at ? new Date(p.created_at).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
