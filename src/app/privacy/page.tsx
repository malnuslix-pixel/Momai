'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{
      margin: 0,
      background: 'var(--bg, #faf8f5)',
      color: 'var(--tx, #1a1a1a)',
      font: "18px/1.7 'Segoe UI', system-ui, sans-serif",
      padding: 'calc(3.5rem + env(safe-area-inset-top, 0px)) 1.5rem max(3rem, env(safe-area-inset-bottom))',
      minHeight: '100vh',
    }}>
      <style jsx global>{`
        :root {
          --bg: #faf8f5;
          --tx: #1a1a1a;
          --mu: #444;
          --g: #2c5f2d;
          --ln: #e0ddd6;
          color-scheme: light;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --bg: #0e1a0f;
            --tx: #f1f1ec;
            --mu: #c3ccc4;
            --g: #7fc080;
            --ln: #2a3d2d;
            color-scheme: dark;
          }
        }
        .privacy-main {
          max-width: 44rem;
          margin: 0 auto;
        }
        .privacy-main h1, .privacy-main h2 {
          font-family: Georgia, serif;
          line-height: 1.2;
          color: var(--g);
        }
        .privacy-main h2 {
          margin-top: 2rem;
          font-size: 1.3rem;
        }
        .privacy-main p, .privacy-main li {
          color: var(--mu);
        }
        .privacy-main a {
          color: var(--g);
        }
        .privacy-table {
          border-collapse: collapse;
          width: 100%;
          display: block;
          overflow-x: auto;
        }
        .privacy-table th, .privacy-table td {
          border: 1px solid var(--ln);
          padding: 0.5rem 0.7rem;
          text-align: left;
          font-size: 0.95rem;
          vertical-align: top;
        }
      `}</style>

      <main className="privacy-main">
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : window.location.assign('/')}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '999px',
              border: '1px solid var(--ln)',
              background: 'none',
              color: 'var(--tx)',
              cursor: 'pointer',
              fontSize: '0.88rem'
            }}
          >
            ← Back
          </button>
        </div>
        <h1>Privacy notice</h1>
        <p>Last updated: 21 November 2026</p>

        <h2>Who we are</h2>
        <p>
          Mwalimu Family publishes education news and learning tools for Kenyan families.
          Contact us on WhatsApp +254 715 363 944 or at [privacy email address].
          [Add registered business name and ODPC registration number once registered.]
        </p>

        <h2>What we collect and why</h2>
        <table className="privacy-table">
          <thead>
            <tr>
              <th>When you…</th>
              <th>We collect</th>
              <th>Why</th>
              <th>Kept for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Subscribe to email updates</td>
              <td>Name (optional), email, time of consent</td>
              <td>To send news and learning resources</td>
              <td>Until you unsubscribe</td>
            </tr>
            <tr>
              <td>Post a job, notice or advert request, or ask for or offer tutoring</td>
              <td>The details you type in the form, including contact details</td>
              <td>To review your request and reply to you</td>
              <td>Up to 180 days (stored securely in database)</td>
            </tr>
            <tr>
              <td>Use Ask Mwalimu</td>
              <td>The question you type</td>
              <td>To produce an answer</td>
              <td>Logged anonymously for system monitoring and Kenyan education query resolution</td>
            </tr>
            <tr>
              <td>Use tools, quizzes and checklists</td>
              <td>Nothing is sent to us. Scores and saved items stay in your own browser</td>
              <td>To remember your progress on your device</td>
              <td>Until you clear your browser data</td>
            </tr>
          </tbody>
        </table>
        <p>Please do not enter exam index numbers, ID numbers or learners' names in Ask Mwalimu or in free-text fields.</p>

        <h2>Who we share it with</h2>
        <p>
          We use service providers to run the site: hosting provider, Supabase database, and our AI provider for the assistant.
          They process data only to provide those services. We do not sell your data.
        </p>

        <h2>Learners under 18</h2>
        <p>A parent or guardian must make tutoring requests and agree to email sign-up for learners under 18.</p>

        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete your data, and you can withdraw consent at any time by contacting us.
          You may also complain to the Office of the Data Protection Commissioner of Kenya.
        </p>

        <h2>Changes</h2>
        <p>We will update this page and its date if our practices change.</p>
      </main>
    </div>
  );
}
