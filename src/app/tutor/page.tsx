'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUBJECTS = [
  'Mathematics', 'Integrated Science', 'English', 'Kiswahili',
  'Social Studies', 'Business Studies', 'Computer Science',
  'Agriculture', 'Home Science',
];

const GRADES = [
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
  'Form 1', 'Form 2', 'Form 3', 'Form 4',
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "👋 Habari! I am **Mwalimu AI**, your dedicated Kenyan CBC & 8-4-4 revision guide.\n\n" +
        "• **Explain**: Ask me to break down any concept step-by-step.\n" +
        "• **Practice**: Request multiple-choice quiz questions with instant solutions.\n" +
        "• **Formulas**: Get clear guides for Math and Science calculations.\n\n" +
        "Choose your subject and grade above, then ask me your question!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 7');
  const [mode, setMode] = useState<'chat' | 'practice' | 'explain'>('chat');
  const [sessionId] = useState(() => `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    if (!overrideText) setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userText, timestamp: new Date() }]);
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId,
          subject,
          grade,
          mode,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, timestamp: new Date() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I ran into a temporary issue. Please rephrase or try another topic!",
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Network glitch. Please check your data connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#faf8f5',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: '#1a1a1a',
    }}>
      {/* Top Header */}
      <header style={{
        position: 'relative',
        background: '#2c5f2d',
        color: '#fff',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : window.location.assign('/')}
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '999px',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              cursor: 'pointer'
            }}
            aria-label="Go back"
          >
            ← Back
          </button>
          <Link
            href="/"
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '999px',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              textDecoration: 'none'
            }}
          >
            🏠 Home
          </Link>
          <div>
            <h1 style={{
              margin: 0,
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '1.2rem',
              fontWeight: 700,
            }}>
              🤖 Mwalimu AI Tutor
            </h1>
            <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>
              CBC & 8-4-4 Kenyan Curriculum
            </span>
          </div>
        </div>

        {/* Subject & Grade Selectors */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.18)',
              color: '#fff',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
            }}
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s} style={{ color: '#1a1a1a' }}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            style={{
              padding: '0.35rem 0.6rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.18)',
              color: '#fff',
              fontSize: '0.82rem',
              fontFamily: 'inherit',
            }}
          >
            {GRADES.map((g) => (
              <option key={g} value={g} style={{ color: '#1a1a1a' }}>
                {g}
              </option>
            ))}
          </select>
          <Link
            href="/leaderboard"
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              background: '#f4a261',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            🏆 Leaderboard
          </Link>
        </div>
      </header>

      {/* Mode Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        padding: '0.6rem 1rem',
        background: '#fff',
        borderBottom: '1px solid #e2ded5',
      }}>
        {[
          { id: 'chat' as const, label: '💬 Free Chat', desc: 'Ask any syllabus question' },
          { id: 'practice' as const, label: '📝 Practice Quiz', desc: 'Questions with instant answers' },
          { id: 'explain' as const, label: '📖 Topic Breakdown', desc: 'Step-by-step concepts' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            style={{
              flex: 1,
              padding: '0.5rem 0.4rem',
              borderRadius: '10px',
              border: mode === m.id ? '2px solid #2c5f2d' : '1px solid #e2ded5',
              background: mode === m.id ? '#eaf5ea' : '#fff',
              cursor: 'pointer',
              textAlign: 'center',
              fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2c5f2d' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#777' }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '0.85rem 1.1rem',
                borderRadius:
                  msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#2c5f2d' : '#fff',
                color: msg.role === 'user' ? '#fff' : '#1a1a1a',
                border: msg.role === 'assistant' ? '1px solid #e2ded5' : 'none',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                lineHeight: 1.6,
                fontSize: '0.92rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{ fontSize: '0.75rem', color: '#2c5f2d', fontWeight: 700, marginBottom: '0.35rem' }}>
                  🤖 Mwalimu AI
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '16px 16px 16px 4px',
              background: '#fff',
              border: '1px solid #e2ded5',
              color: '#777',
              fontSize: '0.9rem',
            }}>
              Thinking... ✍️
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      <div style={{
        display: 'flex',
        gap: '0.45rem',
        padding: '0.45rem 1rem 0',
        overflowX: 'auto',
      }}>
        {[
          '📝 Give me a practice question',
          '📖 Explain key formulas',
          '🧮 Help me solve a problem',
          '🔍 What should I revise next?',
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => sendMessage(prompt)}
            style={{
              whiteSpace: 'nowrap',
              padding: '0.4rem 0.8rem',
              borderRadius: '50px',
              border: '1px solid #e2ded5',
              background: '#fff',
              fontSize: '0.8rem',
              cursor: 'pointer',
              color: '#2c5f2d',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        background: '#fff',
        borderTop: '1px solid #e2ded5',
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={`Ask anything about ${subject} (${grade})...`}
          style={{
            flex: 1,
            padding: '0.75rem 1.1rem',
            borderRadius: '50px',
            border: '2px solid #e2ded5',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            padding: '0.75rem 1.4rem',
            borderRadius: '50px',
            border: 'none',
            background: loading || !input.trim() ? '#b3bdb4' : '#2c5f2d',
            color: '#fff',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.95rem',
            fontFamily: 'inherit',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
