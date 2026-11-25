import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getAdminClient } from '@/lib/supabase';
import { buildTutorSystemPrompt, getFallbackResponse, generatePracticeQuestion } from '@/lib/tutor-engine';
import { generateAIResponse } from '@/lib/ai';

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

    // Determine AI response via unified AI engine
    const systemPrompt = buildTutorSystemPrompt(ctx);
    const ai = await generateAIResponse({
      system: systemPrompt,
      prompt: message,
      temperature: 0.65,
      maxTokens: 800,
    });

    const reply = ai.text || getFallbackResponse(message, ctx);

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
