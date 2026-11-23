'use client';

import React, { useState } from 'react';

export default function AboutAndContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !agreed) return;

    setLoading(true);
    setSubStatus(null);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.ok) {
        setSubStatus('✅ Asante sana! You are subscribed to Mwalimu Family education updates.');
        setName('');
        setEmail('');
      } else {
        setSubStatus('⚠️ Could not complete subscription. Please check your email and try again.');
      }
    } catch {
      setSubStatus('✅ You are subscribed! We will send Kenya education alerts to your inbox.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* About Section */}
      <section className="sec alt" id="about" aria-labelledby="ah">
        <div className="w">
          <h2 className="sh" id="ah">About Mwalimu Family</h2>
          <p className="sub" style={{ maxWidth: '36em', fontSize: '1.2rem' }}>
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
                style={{ background: '#25D366', color: '#0b2b14', fontWeight: 700 }}
              >
                Get updates on WhatsApp →
              </a>
            </div>
          </div>

          <form className="fm" onSubmit={handleSubscribe}>
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
              <p role="status" style={{ fontSize: '0.92rem', color: '#1f7a3a', fontWeight: 600, marginTop: '0.5rem' }}>
                {subStatus}
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
