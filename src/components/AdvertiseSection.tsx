'use client';

import React, { useState } from 'react';
import { submitOnlineForm } from '@/lib/mwalimu-data';

interface AdvertiseSectionProps {
  onNavClick?: (hash: string) => void;
}

export default function AdvertiseSection({ onNavClick }: AdvertiseSectionProps) {
  const [business, setBusiness] = useState('');
  const [contact, setContact] = useState('');
  const [pkg, setPkg] = useState('Sponsored notice');
  const [details, setDetails] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState<string | null>(null);
  const [waUrl, setWaUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !contact || !details || !consent) return;

    setSubmitting(true);
    const fields: [string, string][] = [
      ['Business / Organisation', business],
      ['Contact (Phone or Email)', contact],
      ['Selected Package', pkg],
      ['Promotion Details', details]
    ];

    const res = await submitOnlineForm('ad', 'Advertising Quote', business, fields, consent);
    setRef(res.ref);
    setWaUrl(res.whatsappUrl);
    setBusiness('');
    setContact('');
    setDetails('');
    setConsent(false);
    setSubmitting(false);
  };

  return (
    <section className="sec mb bp" id="advertise" aria-labelledby="adh">
      <div className="w">
        <h2 className="sh" id="adh">Advertise and promote</h2>
        <p className="sub">
          Reach teachers, parents, school heads and learners across Kenya. Tailored promotion packages with transparent reporting.
        </p>

        {/* 5 Package Cards */}
        <div className="x2" style={{ marginBottom: '2.5rem' }}>
          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>📢 Sponsored Notice</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              A pinned and labelled notice on the Mwalimu Family notice board and news feeds.
            </p>
          </div>

          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>💼 Featured Job Listing</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              Highlight your teaching vacancy at the top of the education jobs board for maximum educator visibility.
            </p>
          </div>

          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>📱 Newsletter & WhatsApp</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              Direct mention in our daily education updates to thousands of teachers and Kenyan families.
            </p>
          </div>

          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>🌟 Homepage Banner</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              A prominent promotion spot on the portal home page viewed by students, teachers and parents daily.
            </p>
          </div>

          <div style={{ background: '#16251a', border: '1px solid #2a3d2d', borderRadius: '16px', padding: '1.4rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>🎪 Event Promotion</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', marginTop: '0.4rem' }}>
              Dedicated campaigns for education open days, school fairs, STEM workshops and academic conferences.
            </p>
          </div>
        </div>

        {/* How Advertising Works & Standards */}
        <div className="x2" style={{ marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>How Advertising Works</h3>
            <ol className="jn" style={{ color: '#fff', opacity: 0.95, lineHeight: 1.8 }}>
              <li>Send an enquiry below with what you wish to promote.</li>
              <li>Our team reviews the request for accuracy, safety, and educational fit.</li>
              <li>We share competitive rates and a proof for your sign-off.</li>
              <li>Your promotion goes live with a clear &quot;Sponsored&quot; label and active tracking.</li>
            </ol>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Advertising Standards</h3>
            <p style={{ color: '#d6efd6', fontSize: '0.92rem', lineHeight: 1.6, marginTop: '0.4rem' }}>
              Every paid promotion is strictly labelled &quot;Sponsored&quot;. Content must be honest, verified, and relevant to education and family welfare. We strictly decline promotions that target minors unethically or promote predatory financial products.
            </p>
          </div>
        </div>

        {/* REQUEST A QUOTE FORM */}
        <div className="fm fm-light" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Request an advertising quote</h3>
          <p style={{ fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            Tell us about your brand or school campaign. Our promotions team will reply within 24 hours with package rates.
          </p>

          {ref ? (
            <div className="fm-confirm-box">
              <h4>✅ Quote Request Submitted</h4>
              <p style={{ fontSize: '0.92rem', margin: '0.45rem 0 0.85rem' }}>
                Reference Code: <b>{ref}</b>. Saved to your Activity tracker and queued for our promotions desk.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {waUrl && (
                  <a className="btn wab" href={waUrl} target="_blank" rel="noopener" style={{ margin: 0, padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
                    Send Copy on WhatsApp →
                  </a>
                )}
                <button className="gb" onClick={() => setRef(null)} style={{ margin: 0 }}>
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="fm-grid-2">
                <div>
                  <label htmlFor="adv-biz">Business / Organisation:</label>
                  <input id="adv-biz" className="sel" type="text" value={business} onChange={(e) => setBusiness(e.target.value)} required placeholder="e.g. Oxford Bookshop Nairobi" />
                </div>
                <div>
                  <label htmlFor="adv-contact">Contact (Phone or Email):</label>
                  <input id="adv-contact" className="sel" type="text" value={contact} onChange={(e) => setContact(e.target.value)} required placeholder="e.g. 0712345678 or ads@brand.com" />
                </div>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label htmlFor="adv-pkg">Preferred Package:</label>
                <select id="adv-pkg" className="sel" value={pkg} onChange={(e) => setPkg(e.target.value)}>
                  <option value="Sponsored notice">Sponsored notice</option>
                  <option value="Featured job listing">Featured job listing</option>
                  <option value="Newsletter and WhatsApp mention">Newsletter and WhatsApp mention</option>
                  <option value="Homepage banner">Homepage banner</option>
                  <option value="Event promotion">Event promotion</option>
                </select>
              </div>

              <div style={{ marginTop: '0.8rem' }}>
                <label htmlFor="adv-det">What are you promoting? (Dates, message, target audience):</label>
                <textarea
                  id="adv-det"
                  className="sel"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                  placeholder="Describe your event, school admission, publishing catalog or service..."
                />
              </div>

              <label className="ck">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>I agree to the Mwalimu Family advertising standards and editorial review.</span>
              </label>

              <button
                type="submit"
                className="btn b1"
                disabled={submitting || !consent}
                style={{ minHeight: '48px', width: '100%' }}
              >
                {submitting ? 'Sending Request...' : 'Request Quote →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
