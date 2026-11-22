import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { buildTutorSystemPrompt, getFallbackResponse, generatePracticeQuestion } from '@/lib/tutor-engine';

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, subject, grade, mode = 'chat' } = await req.json();

    if (!message || !session_id) {
      return NextResponse.json({ ok: false, error: 'Message and session_id are required' }, { status: 400 });
    }

    const ctx = {
      subject: subject || 'Mathematics',
      grade: grade || 'Grade 7',
      mode: mode as 'chat' | 'practice' | 'explain',
      history: [],
    };

    const db = getAdminClient();

    // Log user turn to tutor_sessions (fail-safe)
    try {
      await db.from('tutor_sessions').insert({
        session_id,
        role: 'user',
        content: message,
        subject: ctx.subject,
        grade: ctx.grade,
        mode,
      });
    } catch {}

    // Determine AI response
    let reply: string = '';
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = buildTutorSystemPrompt(ctx);
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: [{ parts: [{ text: message }] }],
              generationConfig: {
                temperature: 0.65,
                maxOutputTokens: 800,
              },
            }),
          }
        );
        const data = await res.json();
        reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (apiErr) {
        console.warn('Gemini tutor API fallback:', apiErr);
      }
    } else if (anthropicKey) {
      try {
        const systemPrompt = buildTutorSystemPrompt(ctx);
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-haiku-20240307',
            max_tokens: 800,
            system: systemPrompt,
            messages: [{ role: 'user', content: message }],
          }),
        });
        const data = await res.json();
        reply = data?.content?.[0]?.text || '';
      } catch (apiErr) {
        console.warn('Anthropic tutor API fallback:', apiErr);
      }
    }

    if (!reply) {
      reply = getFallbackResponse(message, ctx);
    }

    // Log assistant turn
    try {
      await db.from('tutor_sessions').insert({
        session_id,
        role: 'assistant',
        content: reply,
        subject: ctx.subject,
        grade: ctx.grade,
        mode,
      });
    } catch {}

    return NextResponse.json({ ok: true, reply, mode });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

// GET - Returns sample CBC practice questions
export async function GET(req: NextRequest) {
  const subject = req.nextUrl.searchParams.get('subject') || 'Mathematics';
  const grade = req.nextUrl.searchParams.get('grade') || 'Grade 7';
  const count = Math.min(parseInt(req.nextUrl.searchParams.get('count') || '5', 10), 10);

  const questions = Array.from({ length: count }, () =>
    generatePracticeQuestion(subject, grade)
  );

  return NextResponse.json({ ok: true, questions });
}
