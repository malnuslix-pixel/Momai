import React from 'react';

interface TutorMarkdownProps {
  content: string;
  isUser?: boolean;
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`
 */
function renderInline(text: string, isUser = false): React.ReactNode[] {
  // Regex to match **bold**, *italic*, and `code`
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const inner = part.slice(2, -2);
      return (
        <strong
          key={index}
          style={{
            fontWeight: 700,
            color: isUser ? '#ffffff' : '#f4a261',
            letterSpacing: '0.01em',
          }}
        >
          {inner}
        </strong>
      );
    }

    // Inline code `code`
    if (part.startsWith('`') && part.endsWith('`')) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          style={{
            background: isUser ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0.15rem 0.4rem',
            borderRadius: '5px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace',
            fontSize: '0.88em',
            color: isUser ? '#ffffff' : '#ffd166',
          }}
        >
          {inner}
        </code>
      );
    }

    // Italic *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} style={{ fontStyle: 'italic', opacity: 0.95 }}>
          {inner}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Full Markdown renderer for Mwalimu AI Tutor messages.
 * Handles headings, code blocks, lists, multiple choice choices, blockquotes, and bold.
 */
export default function TutorMarkdown({ content, isUser = false }: TutorMarkdownProps) {
  if (!content) return null;

  // Split content into lines for block processing
  const rawLines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockBuffer: string[] = [];
  let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;

  const flushList = (key: string) => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul
            key={key}
            style={{
              margin: '0.4rem 0 0.6rem 1.2rem',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {currentList.items.map((item, i) => (
              <li key={i} style={{ lineHeight: 1.6 }}>{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={key}
            style={{
              margin: '0.4rem 0 0.6rem 1.2rem',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
            }}
          >
            {currentList.items.map((item, i) => (
              <li key={i} style={{ lineHeight: 1.6 }}>{item}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  rawLines.forEach((line, lineIndex) => {
    const trimmed = line.trim();

    // Check for code block fences ```
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Closing code block
        elements.push(
          <pre
            key={`code-${lineIndex}`}
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              overflowX: 'auto',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '0.88rem',
              margin: '0.6rem 0',
              color: '#85e085',
            }}
          >
            <code>{codeBlockBuffer.join('\n')}</code>
          </pre>
        );
        codeBlockBuffer = [];
        inCodeBlock = false;
      } else {
        // Opening code block
        flushList(`list-before-code-${lineIndex}`);
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockBuffer.push(line);
      return;
    }

    // Blank line
    if (!trimmed) {
      flushList(`list-flush-${lineIndex}`);
      return;
    }

    // Headings (###, ##, #)
    if (trimmed.startsWith('### ')) {
      flushList(`list-h3-${lineIndex}`);
      elements.push(
        <h4
          key={`h4-${lineIndex}`}
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '1.05rem',
            fontWeight: 700,
            margin: '0.7rem 0 0.3rem',
            color: isUser ? '#ffffff' : '#f4a261',
          }}
        >
          {renderInline(trimmed.slice(4), isUser)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`list-h2-${lineIndex}`);
      elements.push(
        <h3
          key={`h3-${lineIndex}`}
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            margin: '0.8rem 0 0.35rem',
            color: isUser ? '#ffffff' : '#ffffff',
          }}
        >
          {renderInline(trimmed.slice(3), isUser)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(`list-h1-${lineIndex}`);
      elements.push(
        <h2
          key={`h2-${lineIndex}`}
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            margin: '0.9rem 0 0.4rem',
            color: '#ffffff',
          }}
        >
          {renderInline(trimmed.slice(2), isUser)}
        </h2>
      );
      return;
    }

    // Blockquote (> )
    if (trimmed.startsWith('> ')) {
      flushList(`list-quote-${lineIndex}`);
      elements.push(
        <blockquote
          key={`quote-${lineIndex}`}
          style={{
            borderLeft: '3px solid #f4a261',
            margin: '0.5rem 0',
            padding: '0.4rem 0.8rem',
            background: 'rgba(244, 162, 97, 0.1)',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.92rem',
            color: '#d1dcd2',
            fontStyle: 'italic',
          }}
        >
          {renderInline(trimmed.slice(2), isUser)}
        </blockquote>
      );
      return;
    }

    // Unordered List (- , * , • )
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.endsWith('*'))) {
      const itemText = trimmed.startsWith('• ')
        ? trimmed.slice(2)
        : trimmed.startsWith('- ')
        ? trimmed.slice(2)
        : trimmed.slice(2);

      if (!currentList || currentList.type !== 'ul') {
        flushList(`list-before-ul-${lineIndex}`);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(renderInline(itemText, isUser));
      return;
    }

    // Ordered List (1. , 2. etc.)
    const olMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(`list-before-ol-${lineIndex}`);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(renderInline(olMatch[2], isUser));
      return;
    }

    // Multiple Choice Option highlight (A) ..., B) ..., C) ..., D) ...)
    const mcMatch = trimmed.match(/^([A-D]\))\s+(.+)$/);
    if (mcMatch) {
      flushList(`list-mc-${lineIndex}`);
      elements.push(
        <div
          key={`mc-${lineIndex}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.55rem',
            margin: '0.3rem 0',
            padding: '0.4rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '0.93rem',
          }}
        >
          <span style={{ fontWeight: 800, color: '#f4a261', minWidth: '24px' }}>
            {mcMatch[1]}
          </span>
          <span style={{ color: '#ffffff' }}>
            {renderInline(mcMatch[2], isUser)}
          </span>
        </div>
      );
      return;
    }

    // Normal paragraph line
    flushList(`list-para-${lineIndex}`);
    elements.push(
      <p
        key={`p-${lineIndex}`}
        style={{
          margin: '0 0 0.5rem',
          lineHeight: 1.65,
          color: isUser ? '#ffffff' : '#e6ede6',
        }}
      >
        {renderInline(trimmed, isUser)}
      </p>
    );
  });

  flushList('list-final');

  return <div style={{ display: 'flex', flexDirection: 'column' }}>{elements}</div>;
}
