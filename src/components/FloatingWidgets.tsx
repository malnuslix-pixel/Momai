'use client';

import React, { useState } from 'react';
import { getAskMwalimuReply } from '@/lib/mwalimu-data';

interface FloatingWidgetsProps {
  onNavClick?: (hash: string) => void;
}

const QUICK_STARTERS = [
  { label: 'KJSEA & KCSE dates', q: 'When are KJSEA and KCSE results released?' },
  { label: 'KUCCPS formula', q: 'How do I calculate KUCCPS cluster points?' },
  { label: 'Grade 10 pathways', q: 'Explain Grade 10 Senior School pathways' },
  { label: 'Scam safety', q: 'How do I spot fake results messages?' },
];

export default function FloatingWidgets({ onNavClick }: FloatingWidgetsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'b' | 'u'; text: string; link?: [string, string] }>>([
    {
      role: 'b',
      text: 'Habari! I am your Ask Mwalimu AI assistant. Ask me about Kenyan exams, syllabus schemes, Grade 10 placement, or revision!'
    }
  ]);

  const sendQuestion = async (rawText: string) => {
    const userText = rawText.trim();
    if (!userText || sending) return;

    setInputVal('');
    const nextMsgs = [...messages, { role: 'u' as const, text: userText }];
    setMessages(nextMsgs);
    setSending(true);

    const localMatch = getAskMwalimuReply(userText);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      const replyText = data?.reply || localMatch.reply;
      setMessages([...nextMsgs, { role: 'b' as const, text: replyText, link: localMatch.link as any }]);
    } catch {
      setMessages([...nextMsgs, { role: 'b' as const, text: localMatch.reply, link: localMatch.link as any }]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(inputVal);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Back to Top Button */}
      <button
        className="bt"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>

      {/* Floating Action Dock */}
      <div className="mfw" id="mfw">
        {/* Assistant Drawer Modal */}
        {isOpen && (
          <div className="mfp" id="mfp" role="dialog" aria-label="Ask Mwalimu Assistant">
            <header>
              <span>Ask Mwalimu Assistant</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close assistant">
                ×
              </button>
            </header>

            <div className="mfl">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role}>
                  {m.text}
                  {m.link && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <a
                        href={m.link[0]}
                        onClick={(e) => {
                          setIsOpen(false);
                          if (onNavClick) {
                            e.preventDefault();
                            onNavClick(m.link![0]);
                          }
                        }}
                      >
                        {m.link[1]} →
                      </a>
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="b" style={{ opacity: 0.8 }}>
                  Thinking...
                </div>
              )}
            </div>

            <div className="mfq">
              {QUICK_STARTERS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => sendQuestion(s.q)}
                  disabled={sending}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <form className="mff" onSubmit={handleSend}>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about exams, schemes, CBC..."
                aria-label="Your question"
                autoComplete="off"
                disabled={sending}
              />
              <button type="submit" disabled={sending || !inputVal.trim()}>
                {sending ? '…' : 'Send'}
              </button>
            </form>
          </div>
        )}

        {/* WhatsApp Pill */}
        <a
          className="fb wa"
          href="https://wa.me/254715363944?text=Hello%20Mwalimu%20Family"
          target="_blank"
          rel="noopener"
          aria-label="Chat on WhatsApp"
        >
          <svg width="20" height="20" viewBox="0 0 44 44" aria-hidden="true">
            <path d="M22 6a16 16 0 0 0-13.7 24.3L6 38l7.9-2.2A16 16 0 1 0 22 6z" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M17.5 15c.7 5.5 5.7 10.4 11.5 12.2l2.3-2.4-3.7-2.2-1.7 1.3c-1.9-.7-3.9-2.7-4.6-4.6l1.3-1.7-2.2-3.7z" fill="#ffffff"/>
          </svg>
          WhatsApp
        </a>

        {/* Ask Mwalimu Button */}
        <button
          className="fb ai"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mfp"
        >
          💬 Ask Mwalimu
        </button>
      </div>
    </>
  );
}
