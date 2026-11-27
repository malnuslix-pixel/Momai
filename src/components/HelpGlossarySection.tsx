'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GLOSSARY } from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';
import { useSectionCopy } from '@/lib/cms-context';

export default function HelpGlossarySection() {
  const [lang] = useLanguage();
  const copy = useSectionCopy('help', lang);
  const [glossSearch, setGlossSearch] = useState('');
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingTerm, setLoadingTerm] = useState<string | null>(null);

  const handleExplainTerm = async (term: string, def: string) => {
    setLoadingTerm(term);
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: 'explain_term', term, definition: def, lang }),
      });
      const data = await res.json();
      if (data.ok && data.text) {
        setAiExplanations((prev) => ({ ...prev, [term]: data.text }));
      }
    } catch {
    } finally {
      setLoadingTerm(null);
    }
  };

  const filteredGlossary = GLOSSARY.filter(([term, def]) => {
    const q = glossSearch.toLowerCase();
    return term.toLowerCase().includes(q) || def.toLowerCase().includes(q);
  });

  return (
    <section className="sec" id="help" aria-labelledby="hlh">
      <div className="w">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="sh rv" id="hlh">{copy.title}</h2>
            <p className="sub rv">{copy.subtitle}</p>
          </div>
          <button
            className="gb o"
            onClick={() => window.print()}
            style={{ margin: 0, padding: '0.5rem 1.2rem' }}
          >
            🖨️ Print Glossary & FAQs
          </button>
        </div>

        {/* FAQs */}
        <h3 style={{ fontSize: '1.4rem', marginTop: '2rem', marginBottom: '1rem' }}>Frequently asked questions</h3>
        <div className="fq" style={{ marginBottom: '3rem' }}>
          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              Where do I check KJSEA, KPSEA or KCSE examination results?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Only through official Ministry of Education and KNEC SMS codes and verified websites (knec.ac.ke). Never pay anyone claiming early or leaked results.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              How is Grade 10 Senior School pathway placement decided?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Placement follows Ministry of Education guidelines based on the learner’s KJSEA summative scores, formative assessment portfolio in Junior School, and demonstrated interests in STEM, Social Sciences, or Arts & Sports.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              How do I apply for a HELB loan or government university scholarship?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Apply directly through the official Higher Education Financing (HEF) portal at hef.co.ke or helb.co.ke. Never use cyber café agents who request confidential passwords.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              How do university and college placements work in Kenya?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              KUCCPS coordinates placements based on KCSE mean grades and weighted cluster points. Check our Cluster Calculator in Tools to calculate your subject aggregate.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              Are the schemes of work and teaching templates completely free?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Yes. Every scheme of work, lesson plan, exam paper and rubric is 100% free to download as an editable Word (.doc) file without registration or payment.
            </p>
          </details>

          <details style={{ padding: '0.6rem 0', borderTop: '1px solid #e0ddd6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--hd)' }}>
              How do I report a mistake in a template or a suspicious results message?
            </summary>
            <p style={{ color: 'var(--mu)', marginTop: '0.4rem', fontSize: '0.95rem' }}>
              Message our newsroom directly via WhatsApp (+254 715 363 944) or use the feedback form in About & Contact.
            </p>
          </details>
        </div>

        {/* 15-TERM GLOSSARY */}
        <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Kenya Education Glossary</h3>
        <div className="sb" style={{ marginBottom: '1.5rem', maxWidth: '480px' }}>
          <input
            className="sel"
            type="search"
            placeholder="Search terms, e.g. CBE, NEMIS, UPI, Capitation..."
            value={glossSearch}
            onChange={(e) => setGlossSearch(e.target.value)}
          />
        </div>

        <dl className="gloss" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {filteredGlossary.map(([term, def]) => (
            <div key={term} style={{ background: '#ffffff', color: '#1f2937', border: '1px solid #d5dfd5', borderRadius: '14px', padding: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
              <dt style={{ fontWeight: 800, color: '#143215', fontSize: '1.2rem', margin: '0 0 0.35rem' }}>
                {term}
              </dt>
              <dd style={{ color: '#1f2937', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                {def}
              </dd>
              <div style={{ marginTop: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => handleExplainTerm(term, def)}
                  disabled={loadingTerm === term}
                  style={{
                    background: '#eef6ee',
                    color: '#14532d',
                    border: '1px solid #cce3cc',
                    borderRadius: '999px',
                    padding: '0.25rem 0.7rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {loadingTerm === term ? 'Explaining…' : 'AI Plain Guide'}
                </button>
                {aiExplanations[term] && (
                  <p style={{ marginTop: '0.5rem', marginBottom: 0, padding: '0.55rem', background: '#f8faf8', borderRadius: '8px', fontSize: '0.84rem', color: '#143215', lineHeight: 1.5 }}>
                    {aiExplanations[term]}
                  </p>
                )}
              </div>
            </div>
          ))}
        </dl>

        {filteredGlossary.length === 0 && (
          <div className="warn" style={{ marginTop: '1rem' }}>
            <p style={{ color: 'var(--tx)', margin: 0 }}>
              No glossary terms match &ldquo;{glossSearch}&rdquo;.{' '}
              <Link href={`/tutor?q=${encodeURIComponent(`Explain ${glossSearch} in Kenyan curriculum`)}`} className="dl">
                Ask Mwalimu AI →
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
