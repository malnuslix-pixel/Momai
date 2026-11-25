import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWidgets from '@/components/FloatingWidgets';
import { ARTICLES, Article } from '@/lib/mwalimu-data';
import { SITE_URL } from '@/lib/seo';
import {
  Calendar,
  Tag,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Share2
} from 'lucide-react';

interface ArticlePageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((id) => ({ id }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = ARTICLES[params.id];
  if (!article) return { title: 'Article Not Found' };

  const ogUrl = `${SITE_URL}/api/og?${new URLSearchParams({
    title: article.t,
    tag: article.l,
    desc: article.c[0] || 'Kenyan educational reporting and examination guidance.',
  }).toString()}`;

  return {
    title: `${article.t} | Mwalimu Family News Desk`,
    description: article.c[0] || 'Kenyan educational reporting and examination guidance.',
    openGraph: {
      title: article.t,
      description: article.c[0],
      url: `${SITE_URL}/news/${article.id}`,
      siteName: 'Mwalimu Family News Desk',
      locale: 'en_KE',
      type: 'article',
      publishedTime: article.d,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: article.t }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.t,
      description: article.c[0],
      images: [ogUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/news/${article.id}`,
    },
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = ARTICLES[params.id];

  if (!article) {
    notFound();
  }

  // Schema.org NewsArticle + BreadcrumbList + optional FAQPage Structured Data
  const jsonLd: Record<string, any>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.t,
      datePublished: article.d,
      dateModified: article.d,
      author: {
        '@type': 'Organization',
        name: 'Mwalimu Family News Desk',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Mwalimu Family',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/icons/apple-touch-icon.png`,
        },
      },
      description: article.c[0],
      mainEntityOfPage: `${SITE_URL}/news/${article.id}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
        { '@type': 'ListItem', position: 3, name: article.t, item: `${SITE_URL}/news/${article.id}` },
      ],
    },
  ];

  if (article.q && article.q.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.q.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    });
  }

  const relatedArticles = (article.r || [])
    .map((rid) => ARTICLES[rid])
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header activeNav="news" />

      <main style={{ minHeight: '80vh', paddingTop: '74px' }}>
        {/* Editorial Broadsheet Header */}
        <article className="w" style={{ maxWidth: '840px', padding: '2rem 1rem 4rem' }}>
          {/* Breadcrumbs & Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
            <Link
              href="/news"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--ac, #f59e0b)',
              }}
            >
              <ArrowLeft size={16} /> All Educational Stories
            </Link>

            <nav className="bc" aria-label="Breadcrumb" style={{ margin: 0, color: 'var(--mf-text-muted, #d1dcd2)' }}>
              <Link href="/" style={{ color: '#ffffff' }}>Home</Link>
              <span aria-hidden="true" style={{ opacity: 0.6 }}>/</span>
              <Link href="/news" style={{ color: '#ffffff' }}>News</Link>
              <span aria-hidden="true" style={{ opacity: 0.6 }}>/</span>
              <span aria-current="page" style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'bottom', color: 'var(--ac, #f59e0b)' }}>
                {article.t}
              </span>
            </nav>
          </div>

          {/* Article Category & Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.85rem' }}>
            <span className="tag">
              {article.l}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.88rem', color: 'var(--mf-text-muted, #d1dcd2)' }}>
              <Calendar size={14} /> {article.d}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "var(--font-display, 'Fraunces', Georgia, serif)",
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              lineHeight: 1.18,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              marginBottom: '1.2rem',
            }}
          >
            {article.t}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              paddingBottom: '1.2rem',
              borderBottom: '1px solid var(--mf-border-main, rgba(255, 255, 255, 0.16))',
              marginBottom: '1.8rem',
              fontSize: '0.9rem',
              color: 'var(--mf-text-muted, #d1dcd2)',
            }}
          >
            <strong>Reported by:</strong> Mwalimu Family News Desk &bull; Verified MoE/KNEC Sources
          </div>

          {/* Key Facts Callout Box */}
          {article.k && article.k.length > 0 && (
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderLeft: '4px solid var(--ac, #f59e0b)',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                borderRight: '1px solid rgba(255, 255, 255, 0.12)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '1.2rem 1.4rem',
                borderRadius: '0 10px 10px 0',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.6rem', color: 'var(--ac, #f59e0b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Key Facts at a Glance
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {article.k.map((fact, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.96rem', color: '#ffffff', lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} style={{ color: '#4ade80', flexShrink: 0, marginTop: '3px' }} />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Body Paragraphs */}
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--mf-text-main, #f3f5f3)', display: 'flex', flexDirection: 'column', gap: '1.3rem', marginBottom: '2.5rem' }}>
            {article.c.map((paragraph, idx) => (
              <p key={idx} style={{ margin: 0, color: 'var(--mf-text-main, #f3f5f3)' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* "What it means for your family" Section */}
          {article.m && article.m.length > 0 && (
            <div
              style={{
                background: 'var(--mf-card-bg, #224b23)',
                border: '1px solid var(--mf-border-main, rgba(255, 255, 255, 0.18))',
                borderRadius: '12px',
                padding: '1.4rem 1.6rem',
                marginBottom: '2.5rem',
                boxShadow: 'var(--mf-shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.8rem', color: '#ffffff' }}>
                What this means for your family:
              </h3>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.3rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {article.m.map((mean, idx) => (
                  <li key={idx} style={{ fontSize: '1rem', color: 'var(--mf-text-muted, #d1dcd2)', lineHeight: 1.6 }}>
                    {mean}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs Accordion / List */}
          {article.q && article.q.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                Frequently Asked Questions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {article.q.map(([question, answer], idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--mf-card-bg, #224b23)',
                      border: '1px solid var(--mf-border-main, rgba(255, 255, 255, 0.18))',
                      borderRadius: '10px',
                      padding: '1.1rem 1.3rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                      <HelpCircle size={16} style={{ color: 'var(--ac, #f59e0b)', flexShrink: 0 }} />
                      <span>{question}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.94rem', color: 'var(--mf-text-muted, #d1dcd2)', lineHeight: 1.6, paddingLeft: '1.5rem' }}>
                      {answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Button */}
          {article.x && (
            <div style={{ margin: '2rem 0 3rem' }}>
              <Link
                href={article.x[0]}
                className="btn b1"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.8rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  background: 'var(--ac, #f59e0b)',
                  color: '#112812',
                }}
              >
                <span>{article.x[1]}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {/* Related Articles Strip */}
          {relatedArticles.length > 0 && (
            <div style={{ paddingTop: '2rem', borderTop: '2px solid var(--mf-border-main, rgba(255, 255, 255, 0.18))' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
                Related Educational Stories
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.id}`}
                    className="portal-card"
                    style={{ padding: '1.1rem', textDecoration: 'none' }}
                  >
                    <span className="tag" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>
                      {rel.l}
                    </span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#ffffff' }}>
                      {rel.t}
                    </h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--mf-text-muted, #d1dcd2)' }}>
                      {rel.d}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
      <FloatingWidgets />
    </>
  );
}
