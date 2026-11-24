'use client';

import React, { useState } from 'react';
import { getAskMwalimuReply } from '@/lib/mwalimu-data';

interface FloatingWidgetsProps {
  onNavClick?: (hash: string) => void;
}

export default function FloatingWidgets({ onNavClick }: FloatingWidgetsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'b' | 'u'; text: string; link?: [string, string] }>>([
    {
      role: 'b',
      text: 'Habari! I am your Ask Mwalimu assistant. Ask me about exams, syllabus schemes, CBC Grade 10 placement, or revision materials!'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setInputVal('');

    const newMsgs = [...messages, { role: 'u' as const, text: userText }];
    setMessages(newMsgs);

    const match = getAskMwalimuReply(userText);
    setTimeout(() => {
      setMessages([...newMsgs, { role: 'b' as const, text: match.reply, link: match.link as any }]);
    }, 400);
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
            </div>

            <form className="mff" onSubmit={handleSend}>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask about exams, schemes, CBC..."
                aria-label="Your question"
                autoComplete="off"
              />
              <button type="submit">Send</button>
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
            <path d="M22 6a16 16 0 0 0-13.7 24.3L6 38l7.9-2.2A16 16 0 1 0 22 6z" fill="none" stroke="#0b2b14" strokeWidth="3" strokeLinejoin="round"/>
            <path d="M17.5 15c.7 5.5 5.7 10.4 11.5 12.2l2.3-2.4-3.7-2.2-1.7 1.3c-1.9-.7-3.9-2.7-4.6-4.6l1.3-1.7-2.2-3.7z" fill="#0b2b14"/>
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
