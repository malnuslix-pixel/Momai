'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type PlanType = 'free' | 'premium' | 'pro';

const PLANS = [
  {
    id: 'free' as PlanType,
    name: 'Mwanafunzi',
    subtitle: 'Foundation access for every learner',
    price: 0,
    period: '',
    features: [
      'Daily Kenya education news & advisories',
      'KCSE & KJSEA performance calculators',
      'Official jobs & notices board',
      'Ask Mwalimu assistant (5 questions/day)',
      'Daily revision quizzes',
    ],
    cta: 'Get Started Free',
    disabled: true,
  },
  {
    id: 'premium' as PlanType,
    name: 'Msomi',
    subtitle: 'The ultimate study companion',
    price: 199,
    period: '/month',
    popular: true,
    features: [
      'Everything in Mwanafunzi',
      'AI Tutor — unlimited CBC & 8-4-4 questions',
      'Subject-by-subject practice tests with solutions',
      'KUCCPS cluster calculator & course advisor',
      'Personalized study plans & exam countdown',
      'WhatsApp exam alerts & revision drops',
      'Completely ad-free experience',
    ],
    cta: 'Subscribe with M-Pesa',
    disabled: false,
  },
  {
    id: 'pro' as PlanType,
    name: 'Profesa',
    subtitle: 'Complete academic acceleration',
    price: 499,
    period: '/month',
    features: [
      'Everything in Msomi',
      'Photo-solve homework with step-by-step guidance',
      'Weekly live group masterclasses with top teachers',
      'Priority verification for tutoring requests',
      'School & county mean-score performance analytics',
      'Downloadable revision notes & marking schemes',
      'Verified Certificate of Completion',
    ],
    cta: 'Subscribe with M-Pesa',
    disabled: false,
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const handleSubscribeClick = (plan: PlanType) => {
    setSelectedPlan(plan);
    setMessage(null);
  };

  const handlePay = async () => {
    if (!phone || !selectedPlan) return;

    const planData = PLANS.find((p) => p.id === selectedPlan);
    if (!planData) return;

    setLoading(true);
    setMessage({ type: 'info', text: 'Connecting to Safaricom Daraja gateway...' });

    try {
      const res = await fetch('/api/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          amount: planData.price,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();

      if (data.ok && data.checkout_request_id) {
        setMessage({
          type: 'info',
          text: '📱 Prompt sent! Check your phone and enter your M-Pesa PIN.',
        });

        const checkoutId = data.checkout_request_id;
        let attempts = 0;
        const maxAttempts = 15; // Poll for 45s

        const interval = setInterval(async () => {
          attempts++;
          try {
            const checkRes = await fetch(`/api/mpesa/status?checkout_id=${checkoutId}`);
            const checkData = await checkRes.json();
            if (checkData.ok && checkData.payment?.status === 'completed') {
              clearInterval(interval);
              setLoading(false);
              setMessage({
                type: 'success',
                text: `✅ Payment confirmed! Receipt: ${checkData.payment.mpesa_receipt || 'Confirmed'}. Your ${selectedPlan} Study Pass is now active!`,
              });
              try {
                localStorage.setItem('mf_study_pass', selectedPlan);
              } catch {}
            } else if (checkData.ok && checkData.payment?.status === 'failed') {
              clearInterval(interval);
              setLoading(false);
              setMessage({
                type: 'error',
                text: `Transaction cancelled or failed: ${checkData.payment.result_desc || 'Declined'}`,
              });
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              setLoading(false);
              setMessage({
                type: 'info',
                text: 'Waiting window closed. If you entered your PIN, your subscription will activate shortly via SMS confirmation.',
              });
            }
          } catch {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              setLoading(false);
            }
          }
        }, 3000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Payment request could not be completed. Please try again.',
        });
        setLoading(false);
      }
    } catch {
      setMessage({ type: 'error', text: 'Network connection issue. Please check your internet.' });
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f5',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: '#1a1a1a',
    }}>
      {/* Top Banner */}
      <div style={{
        background: '#2c5f2d',
        color: '#fff',
        padding: 'calc(3.5rem + env(safe-area-inset-top, 0px)) 1.5rem 3.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
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
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            margin: '0.8rem 0 0.5rem',
            fontWeight: 700,
          }}>
            Invest in Academic Excellence 🇰🇪
          </h1>
          <p style={{
            fontSize: '1.05rem',
            opacity: 0.92,
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Unlock unlimited AI tutoring, CBC practice questions, and KCSE/KUCCPS course advisors.
            Pay effortlessly and securely with <b>M-Pesa</b>.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div style={{
        maxWidth: '1050px',
        margin: '-2.2rem auto 0',
        padding: '0 clamp(1rem, 3vw, 1.5rem) 3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '1.25rem',
      }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '1.8rem 1.5rem',
              border: plan.popular ? '3px solid #2c5f2d' : '1px solid #e2ded5',
              position: 'relative',
              boxShadow: plan.popular
                ? '0 12px 36px rgba(44, 95, 45, 0.16)'
                : '0 2px 10px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {plan.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#f4a261',
                  color: '#1a1a1a',
                  padding: '0.25rem 1.1rem',
                  borderRadius: '50px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                ⭐ RECOMMENDED FOR PARENTS & STUDENTS
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <h2 style={{
                fontFamily: 'Fraunces, Georgia, serif',
                color: '#2c5f2d',
                margin: '0 0 0.3rem',
                fontSize: '1.5rem',
              }}>
                {plan.name}
              </h2>
              <p style={{ color: '#666', margin: 0, fontSize: '0.86rem' }}>
                {plan.subtitle}
              </p>
              <div style={{ marginTop: '0.9rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Fraunces, Georgia, serif' }}>
                  {plan.price === 0 ? 'Free' : `KES ${plan.price}`}
                </span>
                {plan.period && <span style={{ color: '#777', fontSize: '0.95rem' }}>{plan.period}</span>}
              </div>
            </div>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 1.8rem',
              flex: 1,
            }}>
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    padding: '0.45rem 0',
                    borderBottom: '1px solid #f2eee8',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.6rem',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#2c5f2d', fontWeight: 800 }}>✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.disabled && handleSubscribeClick(plan.id)}
              disabled={plan.disabled}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '50px',
                border: plan.popular ? 'none' : '2px solid #2c5f2d',
                background: plan.popular ? '#2c5f2d' : plan.disabled ? '#eee' : 'transparent',
                color: plan.popular ? '#fff' : plan.disabled ? '#888' : '#2c5f2d',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: plan.disabled ? 'default' : 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease',
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* M-Pesa STK Push Modal */}
      {selectedPlan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 9999,
            padding: '1.2rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPlan(null);
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '2.2rem 1.8rem',
            maxWidth: '430px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.3rem' }}>📱</div>
            <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c5f2d', margin: '0 0 0.4rem' }}>
              Pay via Safaricom M-Pesa
            </h2>
            <p style={{ color: '#555', fontSize: '0.92rem', margin: '0 0 1.4rem' }}>
              Subscribing to <b>{PLANS.find((p) => p.id === selectedPlan)?.name}</b> — KES{' '}
              {PLANS.find((p) => p.id === selectedPlan)?.price} for 30 days
            </p>

            <div style={{ textAlign: 'left', marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                Enter your Safaricom phone number:
              </label>
              <input
                type="tel"
                placeholder="e.g. 0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  borderRadius: '10px',
                  border: '2px solid #e2ded5',
                  fontSize: '1.15rem',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                  letterSpacing: '0.04em',
                }}
              />
            </div>

            {message && (
              <div style={{
                padding: '0.85rem',
                borderRadius: '10px',
                marginBottom: '1.2rem',
                background:
                  message.type === 'success'
                    ? '#eaf5ea'
                    : message.type === 'info'
                    ? '#f0f4f9'
                    : '#ffeaea',
                color:
                  message.type === 'success'
                    ? '#1f7a3a'
                    : message.type === 'info'
                    ? '#1a4b8c'
                    : '#b3261e',
                fontSize: '0.9rem',
                textAlign: 'left',
              }}>
                {message.text}
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading || !phone.trim()}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '50px',
                border: 'none',
                background: loading ? '#888' : '#2c5f2d',
                color: '#fff',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'inherit',
                marginBottom: '0.8rem',
              }}
            >
              {loading ? '⏳ Contacting Safaricom...' : 'Send M-Pesa PIN Prompt'}
            </button>

            <button
              onClick={() => setSelectedPlan(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#777',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Trust & Guarantee */}
      <div style={{
        background: '#fff',
        padding: '3rem 1.5rem',
        borderTop: '1px solid #e2ded5',
        textAlign: 'center',
      }}>
        <h3 style={{ fontFamily: 'Fraunces, Georgia, serif', color: '#2c5f2d', margin: '0 0 1.2rem', fontSize: '1.3rem' }}>
          Empowering Teachers and Learners in all 47 Counties
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap',
          maxWidth: '640px',
          margin: '0 auto',
        }}>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2c5f2d' }}>1,280+</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Subscribers</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2c5f2d' }}>6,120+</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>Revision Tools Used</div>
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2c5f2d' }}>100%</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>CBC & 8-4-4 Aligned</div>
          </div>
        </div>
      </div>
    </div>
  );
}
