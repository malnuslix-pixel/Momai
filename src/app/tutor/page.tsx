'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Send,
  CheckCircle2,
  BookOpen,
  Bot,
  Award,
  ArrowLeft,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Lightbulb,
  HelpCircle,
  Flame
} from 'lucide-react';
import TutorMarkdown from '@/components/TutorMarkdown';
import { awardLearnerXP, getLearnerProfile } from '@/lib/learner-profile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUBJECT_DETAILS: Record<string, { icon: string; name: string }> = {
  Mathematics: { icon: '📐', name: 'Mathematics' },
  'Integrated Science': { icon: '🧪', name: 'Integrated Science' },
  English: { icon: '📚', name: 'English Language & Lit' },
  Kiswahili: { icon: '🇰🇪', name: 'Kiswahili & Fasihi' },
  'Social Studies': { icon: '🌍', name: 'Social Studies & CRE' },
  'Business Studies': { icon: '💼', name: 'Business Studies' },
  'Computer Science': { icon: '💻', name: 'Computer Science' },
  Agriculture: { icon: '🌾', name: 'Agriculture' },
  'Home Science': { icon: '🏡', name: 'Home Science' },
};

const SUBJECTS = Object.keys(SUBJECT_DETAILS);

const GRADES = [
  'Grade 7 (Junior School)',
  'Grade 8 (Junior School)',
  'Grade 9 (Junior School)',
  'Grade 10 (Senior School)',
  'Form 1 (KCSE)',
  'Form 2 (KCSE)',
  'Form 3 (KCSE)',
  'Form 4 (KCSE Candidate)',
];

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    "👋 **Habari!** I am **Mwalimu AI**, your dedicated 24/7 Kenyan CBC & KCSE revision guide.\n\n" +
    "• **Step-by-step Explanations**: Ask me to break down any tricky concept, formula, or setbook topic.\n" +
    "• **Practice Quizzes**: Request multiple-choice questions with instant solutions and grading.\n" +
    "• **Grade 10 & KUCCPS Guidance**: Get advice on Senior School pathway selection and university cluster requirements.\n\n" +
    "**Choose your subject and grade level above**, or tap one of the quick starter prompts below to begin!",
  timestamp: new Date(),
};

function TutorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams?.get('q');
  const urlSub = searchParams?.get('subject');
  const urlGrade = searchParams?.get('grade');
  const urlMode = searchParams?.get('mode');

  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState(urlSub && SUBJECTS.includes(urlSub) ? urlSub : 'Mathematics');
  const [grade, setGrade] = useState(() => {
    if (urlGrade) {
      const match = GRADES.find((g) => g.toLowerCase().includes(urlGrade.toLowerCase()));
      if (match) return match;
    }
    return 'Grade 8 (Junior School)';
  });
  const [mode, setMode] = useState<'chat' | 'practice' | 'explain'>('chat');
  const [sessionId, setSessionId] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [questionsCount, setQuestionsCount] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const initialHandled = useRef(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('mf_tutor_session_id');
      const profile = getLearnerProfile();
      const sid = savedSession || profile.id || `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setSessionId(sid);
      if (!savedSession) {
        localStorage.setItem('mf_tutor_session_id', sid);
      }

      const savedCount = localStorage.getItem('mf_tutor_q_count');
      if (savedCount) {
        setQuestionsCount(parseInt(savedCount, 10) || 0);
      }

      const savedHistory = localStorage.getItem('mf_tutor_history');
      if (savedHistory && !urlQ) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
        }
      }
    } catch {}
  }, [urlQ]);

  // Handle URL deep-link parameters
  useEffect(() => {
    if (urlSub && SUBJECTS.includes(urlSub)) setSubject(urlSub);
    if (urlGrade) {
      const match = GRADES.find((g) => g.toLowerCase().includes(urlGrade.toLowerCase()));
      if (match) setGrade(match);
    }
    if (urlMode && ['chat', 'practice', 'explain'].includes(urlMode)) setMode(urlMode as any);

    if (urlQ && !initialHandled.current) {
      initialHandled.current = true;
      sendMessage(urlQ);
    }
  }, [urlQ, urlSub, urlGrade, urlMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleClearChat = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const newSid = `tutor-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setSessionId(newSid);
    setMessages([INITIAL_MESSAGE]);
    setSpeakingIndex(null);
    try {
      localStorage.setItem('mf_tutor_session_id', newSid);
      localStorage.removeItem('mf_tutor_history');
    } catch {}
  };

  const handleCopyMessage = (text: string, index: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleSpeakMessage = (text: string, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting characters for clean speech
    const cleanText = text
      .replace(/[*_#`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || loading) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }

    const userText = textToSend.trim();
    if (!overrideText) setInput('');

    const newHistory = [...messages, { role: 'user' as const, content: userText, timestamp: new Date() }];
    setMessages(newHistory);
    try {
      localStorage.setItem('mf_tutor_history', JSON.stringify(newHistory));
    } catch {}

    const newCount = questionsCount + 1;
    setQuestionsCount(newCount);
    try {
      localStorage.setItem('mf_tutor_q_count', newCount.toString());
    } catch {}
    awardLearnerXP('question_answered', 'tutor');

    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: sessionId || 'default-session',
          subject,
          grade: grade.split(' ')[0], // Pass clean 'Grade 8' or 'Form 3'
          mode,
        }),
      });

      const data = await res.json();
      const replyText = data.ok
        ? data.reply
        : "I ran into a temporary issue. Please rephrase or try another topic!";

      const updatedHistory = [
        ...newHistory,
        { role: 'assistant' as const, content: replyText, timestamp: new Date() },
      ];
      setMessages(updatedHistory);
      try {
        localStorage.setItem('mf_tutor_history', JSON.stringify(updatedHistory));
      } catch {}
    } catch {
      const errorHistory = [
        ...newHistory,
        {
          role: 'assistant' as const,
          content: "Network glitch. Please check your data connection and try again.",
          timestamp: new Date(),
        },
      ];
      setMessages(errorHistory);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract multiple-choice options from message to render quick-tap buttons
  const extractChoiceOptions = (content: string) => {
    const options: string[] = [];
    const lines = content.split('\n');
    lines.forEach((l) => {
      const match = l.trim().match(/^([A-D])\)\s+(.+)$/);
      if (match) {
        options.push(match[1]);
      }
    });
    return options;
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg, #1a3d1b)',
      color: '#ffffff',
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      {/* Top Header Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 36, 16, 0.98)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
        padding: 'calc(0.75rem + env(safe-area-inset-top, 0px)) 1rem 0.75rem',
      }}>
        <div style={{
          maxWidth: '1080px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          {/* Back & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : router.push('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '999px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.4rem 0.9rem',
                minHeight: '40px',
                cursor: 'pointer'
              }}
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '999px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '0.4rem 0.9rem',
                minHeight: '40px',
                cursor: 'pointer'
              }}
              title="Reset conversation and start fresh session"
            >
              <RotateCcw size={15} /> New Chat
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#f4a261',
                color: '#1a1a1a',
                display: 'grid',
                placeItems: 'center',
                fontSize: '1.2rem',
                fontWeight: 700
              }}>
                🤖
              </div>
              <div>
                <h1 style={{
                  margin: 0,
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '1.18rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.2
                }}>
                  Mwalimu AI Tutor Workspace
                </h1>
                <span style={{ fontSize: '0.78rem', color: '#85e085', fontWeight: 600 }}>
                  Kenya KICD & KNEC Syllabus Guide
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Badges: XP Streak & Leaderboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {questionsCount > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                minHeight: '38px',
                borderRadius: '50px',
                background: 'rgba(244, 162, 97, 0.2)',
                border: '1px solid #f4a261',
                color: '#ffd166',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                <Flame size={15} color="#f4a261" /> {questionsCount} asked (+{questionsCount * 10} XP)
              </div>
            )}

            <Link
              href="/leaderboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.85rem',
                minHeight: '40px',
                borderRadius: '8px',
                background: '#f4a261',
                color: '#1a1a1a',
                textDecoration: 'none',
                fontSize: '0.84rem',
                fontWeight: 700,
                transition: 'opacity 0.2s'
              }}
            >
              <Award size={15} /> Leaderboard
            </Link>
          </div>
        </div>

        {/* Level & Subject Selector Bar */}
        <div style={{
          maxWidth: '1080px',
          margin: '0.6rem auto 0',
          paddingTop: '0.6rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#d1dcd2', fontSize: '0.84rem', fontWeight: 600 }}>
            <span style={{ color: '#f4a261' }}>{SUBJECT_DETAILS[subject]?.icon || '📖'}</span> Subject:
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem',
                minHeight: '40px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s} style={{ background: '#1a3d1b', color: '#ffffff' }}>
                  {SUBJECT_DETAILS[s]?.icon} {s}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#d1dcd2', fontSize: '0.84rem', fontWeight: 600 }}>
            <span style={{ color: '#f4a261' }}>🎓</span> Level:
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{
                padding: '0.45rem 0.8rem',
                minHeight: '40px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.14)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {GRADES.map((g) => (
                <option key={g} value={g} style={{ background: '#1a3d1b', color: '#ffffff' }}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          {/* Mode Tabs */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {[
              { id: 'chat' as const, label: '💬 Chat' },
              { id: 'practice' as const, label: '📝 Practice Quiz' },
              { id: 'explain' as const, label: '📖 Topic Breakdown' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  minHeight: '38px',
                  borderRadius: '8px',
                  border: mode === m.id ? '2px solid #f4a261' : '1px solid rgba(255, 255, 255, 0.2)',
                  background: mode === m.id ? '#f4a261' : 'rgba(255, 255, 255, 0.08)',
                  color: mode === m.id ? '#1a1a1a' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Conversation Stream */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem 1rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
      }}>
        {messages.map((msg, i) => {
          const isAssistant = msg.role === 'assistant';
          const mcOptions = isAssistant ? extractChoiceOptions(msg.content) : [];

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              <div
                style={{
                  maxWidth: '92%',
                  minWidth: '260px',
                  borderRadius:
                    msg.role === 'user'
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, #2c5f2d 0%, #1e4620 100%)'
                      : 'rgba(255, 255, 255, 0.09)',
                  color: '#ffffff',
                  border:
                    msg.role === 'user'
                      ? '1px solid rgba(255, 255, 255, 0.28)'
                      : '1px solid rgba(255, 255, 255, 0.18)',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
                  padding: '1.1rem 1.35rem',
                  position: 'relative',
                }}
              >
                {/* Assistant Message Header */}
                {isAssistant && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🤖</span>
                      <strong style={{ color: '#f4a261', fontSize: '0.88rem', letterSpacing: '0.02em' }}>
                        Mwalimu AI Tutor
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#85e085', background: 'rgba(133, 224, 133, 0.15)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                        Verified KICD Logic
                      </span>
                    </div>

                    {/* Action Tools: Copy & Read Aloud */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.content, i)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: 'rgba(255, 255, 255, 0.12)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: copiedIndex === i ? '#85e085' : '#d1dcd2',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s'
                        }}
                        title="Copy explanation text"
                      >
                        {copiedIndex === i ? <Check size={13} /> : <Copy size={13} />}
                        {copiedIndex === i ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSpeakMessage(msg.content, i)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          background: speakingIndex === i ? 'rgba(244, 162, 97, 0.3)' : 'rgba(255, 255, 255, 0.12)',
                          border: speakingIndex === i ? '1px solid #f4a261' : '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: speakingIndex === i ? '#ffd166' : '#d1dcd2',
                          fontSize: '0.75rem',
                          padding: '0.25rem 0.5rem',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s'
                        }}
                        title={speakingIndex === i ? 'Stop reading' : 'Read aloud with speech audio'}
                      >
                        {speakingIndex === i ? <VolumeX size={13} /> : <Volume2 size={13} />}
                        {speakingIndex === i ? 'Stop' : 'Listen'}
                      </button>
                    </div>
                  </div>
                )}

                {/* User Message Header */}
                {!isAssistant && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', opacity: 0.85, fontSize: '0.78rem' }}>
                    <span>👤</span> <strong>You</strong>
                  </div>
                )}

                {/* Formatted Markdown Content with Bold, Lists, Headers & Code */}
                <div style={{ fontSize: '0.96rem', lineHeight: 1.65 }}>
                  <TutorMarkdown content={msg.content} isUser={msg.role === 'user'} />
                </div>

                {/* Interactive Instant Choice Pills for Multiple Choice Quizzes */}
                {mcOptions.length > 0 && i === messages.length - 1 && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.14)',
                  }}>
                    <span style={{ fontSize: '0.78rem', color: '#ffd166', fontWeight: 600, display: 'block', marginBottom: '0.45rem' }}>
                      ⚡ Tap your answer to check instantly:
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {mcOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => sendMessage(`My answer is ${opt}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            minHeight: '44px',
                            padding: '0.5rem 1.1rem',
                            borderRadius: '50px',
                            background: '#f4a261',
                            border: 'none',
                            color: '#1a1a1a',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          Select Option {opt} <ArrowRight size={14} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{
              padding: '1rem 1.4rem',
              borderRadius: '20px 20px 20px 4px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#d1dcd2',
              fontSize: '0.94rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <span className="spin" style={{ display: 'inline-block', fontSize: '1.2rem' }}>⚙️</span>
              <span><strong>Mwalimu AI</strong> is preparing syllabus-verified explanation...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </main>

      {/* Suggested Follow-up Actions Bar */}
      <section style={{
        maxWidth: '960px',
        width: '100%',
        margin: '0 auto',
        padding: '0 1rem 0.5rem',
      }} aria-label="Suggested study follow-up questions">
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.35rem',
          scrollbarWidth: 'none'
        }}>
          {[
            { label: '📝 Practice Question', text: 'Give me a practice multiple choice question with options' },
            { label: '💡 Explain Simpler', text: 'Can you explain that concept in simpler terms with a real-life Kenyan example?' },
            { label: '🔢 Step-by-Step Problem', text: 'Show me another step-by-step example problem and solution' },
            { label: '📐 Key Formulas', text: 'What are the essential formulas and rules I need to memorize for this topic?' },
            { label: '🇰🇪 KCSE / KJSEA Format', text: 'How is this topic typically examined in national KNEC KCSE or KJSEA papers?' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(item.text)}
              style={{
                whiteSpace: 'nowrap',
                padding: '0.45rem 0.95rem',
                minHeight: '40px',
                borderRadius: '50px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                background: 'rgba(255, 255, 255, 0.1)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                color: '#ffffff',
                fontWeight: 600,
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#f4a261';
                e.currentTarget.style.background = 'rgba(244, 162, 97, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* Input Composer Footer */}
      <footer style={{
        background: 'rgba(15, 36, 16, 0.98)',
        borderTop: '1px solid rgba(255, 255, 255, 0.16)',
        padding: '0.75rem 1rem calc(0.85rem + env(safe-area-inset-bottom, 0px))',
      }}>
        <div style={{
          maxWidth: '960px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          gap: '0.6rem',
          alignItems: 'center'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Ask Mwalimu AI about ${subject} (${grade.split(' ')[0]})...`}
            aria-label={`Ask Mwalimu AI about ${subject} (${grade})`}
            style={{
              flex: 1,
              minHeight: '48px',
              padding: '0.75rem 1.25rem',
              borderRadius: '50px',
              border: '2px solid rgba(255, 255, 255, 0.28)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '0.96rem',
              fontFamily: 'inherit',
              outline: 'none',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              minHeight: '48px',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              background: loading || !input.trim() ? 'rgba(244, 162, 97, 0.4)' : '#f4a261',
              color: '#1a1a1a',
              fontWeight: 700,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontSize: '0.96rem',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)'
            }}
          >
            <Send size={16} /> Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#1a3d1b',
        color: '#ffffff',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🤖</div>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif' }}>Loading Mwalimu AI Tutor...</h2>
          <p style={{ color: '#d1dcd2', marginTop: '0.4rem' }}>Preparing Kenyan CBC & KCSE revision guides...</p>
        </div>
      </div>
    }>
      <TutorClient />
    </Suspense>
  );
}
