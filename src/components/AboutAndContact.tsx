'use client';

import React, { useState } from 'react';
import { submitOnlineForm } from '@/lib/mwalimu-data';

export default function AboutAndContact() {
  const [contactMode, setContactMode] = useState<'subscribe' | 'message'>('subscribe');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subStatus, setSubStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Direct message / correction state
  const [msgFrom, setMsgFrom] = useState('');
  const [msgContact, setMsgContact] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgConsent, setMsgConsent] = useState(false);
  const [msgSubmitting, setMsgSubmitting] = useState(false);
  const [msgResult, setMsgResult] = useState<{ ref: string; whatsappUrl: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !agreed) return;

    setLoading(true);
    setSubStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, consent: agreed }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubStatus({
          ok: true,
          msg: '✅ Asante sana! You are subscribed to Mwalimu Family education updates.',
        });
        setName('');
        setEmail('');
        setAgreed(false);
      } else {
        setSubStatus({
          ok: false,
          msg: '⚠️ Could not complete subscription. Please check your email and try again.',
        });
      }
    } catch {
      setSubStatus({
        ok: false,
        msg: '⚠️ Network error while subscribing. Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgFrom.trim() || !msgContact.trim() || !msgBody.trim() || !msgConsent) return;
    setMsgSubmitting(true);
    const res = await submitOnlineForm(
      'note',
      'Direct Feedback',
      `Message from ${msgFrom.trim()}`,
      [
        ['From', msgFrom.trim()],
        ['Contact', msgContact.trim()],
        ['Message', msgBody.trim()],
      ],
      msgConsent
    );
    setMsgResult({ ref: res.ref, whatsappUrl: res.whatsappUrl });
    setMsgFrom('');
    setMsgContact('');
    setMsgBody('');
    setMsgConsent(false);
    setMsgSubmitting(false);
  };

  return (
    <>
      {/* About Section */}
      <section className="sec alt" id="about" aria-labelledby="ah">
        <div className="w">
          <span className="tag" style={{ marginBottom: '0.5rem' }}>Who We Are</span>
          <h2 className="sh" id="ah">About Mwalimu Family</h2>
          <p className="sub" style={{ maxWidth: '36em' }}>
            “Mwalimu” means <em>teacher</em> in Swahili. We publish independent education news, verified curriculum templates and learning tools for Kenyan teachers, parents and learners.
          </p>

          <div className="vals">
            <div>
              <h3>📰 News Desk</h3>
              <p>We verify exam timelines and policy announcements directly against official sources such as the Ministry of Education and KNEC.</p>
            </div>
            <div>
              <h3>✍🏾 Curriculum Writers</h3>
              <p>Teaching templates are designed according to published KICD Competency Based Curriculum (CBC) designs.</p>
            </div>
            <div>
              <h3>👩🏾‍🏫 Teacher Feedback</h3>
              <p>Teachers across Kenya contribute real classroom feedback to keep resources practical, accurate, and term-ready.</p>
            </div>
            <div>
              <h3>🔍 Accountability</h3>
              <p>News, analysis and explainers are clearly labelled. Official government sources are linked, and corrections are public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stay in Touch / Contact Section */}
      <section className="contact" id="contact" aria-labelledby="ch">
        <div className="w two">
          <div>
            <span className="tag" style={{ marginBottom: '0.5rem' }}>Alerts &amp; Updates</span>
            <h2 className="sh" id="ch" style={{ color: '#fff' }}>Stay in touch</h2>
            <p style={{ fontSize: '1.15rem', marginTop: '1rem', lineHeight: 1.6 }}>
              Receive Kenya national examination news, term dates, and new teaching schemes directly on WhatsApp or by email.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <a
                className="btn b1"
                href="https://wa.me/254715363944?text=Please%20add%20me%20to%20Mwalimu%20Family%20updates"
                target="_blank"
                rel="noopener"
                style={{ background: '#143215', color: '#ffffff', border: '1.5px solid rgba(255, 255, 255, 0.35)', fontWeight: 700 }}
              >
                Get updates on WhatsApp →
              </a>
            </div>
          </div>

          <div className="fm">
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <button
                type="button"
                className={`chip ${contactMode === 'subscribe' ? 'on' : ''}`}
                onClick={() => setContactMode('subscribe')}
              >
                Email Alerts
              </button>
              <button
                type="button"
                className={`chip ${contactMode === 'message' ? 'on' : ''}`}
                onClick={() => setContactMode('message')}
              >
                Send Message / Correction
              </button>
            </div>

            {contactMode === 'subscribe' ? (
              <form onSubmit={handleSubscribe} style={{ display: 'grid', gap: '0.85rem' }}>
                <div>
                  <label htmlFor="nm">Your Name</label>
                  <input
                    id="nm"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mwalimu Kamau"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="em">Email Address</label>
                  <input
                    id="em"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. kamau@school.ac.ke"
                    required
                    autoComplete="email"
                  />
                </div>

                <label className="ck">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                  <span>I agree to receive education advisories and agree to the privacy policy.</span>
                </label>

                <button
                  type="submit"
                  className="btn b1"
                  disabled={loading || !email || !agreed}
                  style={{ minHeight: '48px', marginTop: '0.4rem' }}
                >
                  {loading ? 'Subscribing...' : 'Subscribe by Email'}
                </button>

                {subStatus && (
                  <p role="status" style={{ fontSize: '0.92rem', color: subStatus.ok ? '#86efac' : '#fca5a5', fontWeight: 600, marginTop: '0.5rem' }}>
                    {subStatus.msg}
                  </p>
                )}
              </form>
            ) : msgResult ? (
              <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(134, 239, 172, 0.12)', border: '1px solid rgba(134, 239, 172, 0.35)' }}>
                <strong style={{ color: '#86efac', display: 'block', marginBottom: '0.4rem' }}>✅ Message Sent to Editorial Desk</strong>
                <p style={{ color: '#f3f5f3', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                  Reference Code: <b>{msgResult.ref}</b>. Track status anytime in My Activity.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a className="btn b1" href={msgResult.whatsappUrl} target="_blank" rel="noopener" style={{ background: '#143215', color: '#ffffff', border: '1.5px solid rgba(255, 255, 255, 0.35)' }}>
                    Follow Up on WhatsApp →
                  </a>
                  <button type="button" className="gb o" onClick={() => setMsgResult(null)} style={{ margin: 0 }}>
                    Send Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDirectMessage} style={{ display: 'grid', gap: '0.85rem' }}>
                <div>
                  <label htmlFor="dm-from">Your Name / School</label>
                  <input
                    id="dm-from"
                    type="text"
                    value={msgFrom}
                    onChange={(e) => setMsgFrom(e.target.value)}
                    placeholder="e.g. Teacher Njeri, Kiambu"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dm-contact">Phone or Email</label>
                  <input
                    id="dm-contact"
                    type="text"
                    value={msgContact}
                    onChange={(e) => setMsgContact(e.target.value)}
                    placeholder="e.g. 0712345678 or njeri@school.ac.ke"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="dm-body">Question, Correction, or Feedback</label>
                  <textarea
                    id="dm-body"
                    className="sel"
                    rows={3}
                    value={msgBody}
                    onChange={(e) => setMsgBody(e.target.value)}
                    placeholder="Share a correction, template request, or question..."
                    required
                  />
                </div>
                <label className="ck">
                  <input type="checkbox" checked={msgConsent} onChange={(e) => setMsgConsent(e.target.checked)} required />
                  <span>I consent to the editorial team reviewing and replying to my message.</span>
                </label>
                <button type="submit" className="btn b1" disabled={msgSubmitting || !msgConsent} style={{ minHeight: '48px' }}>
                  {msgSubmitting ? 'Sending...' : 'Send Message to Desk'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
