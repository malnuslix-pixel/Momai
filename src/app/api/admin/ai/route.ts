import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestAdmin } from '@/lib/auth';
import { generateAIResponse, extractJSONFromText } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const clean = (s: unknown, max = 6000) =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').trim().slice(0, max);

export async function POST(req: NextRequest) {
  try {
    if (!(await verifyRequestAdmin(req))) {
      return NextResponse.json({ ok: false, error: 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await req.json();
    const action = clean(body.action, 40);

    if (action === 'extract_upload') {
      const rawText = clean(body.text, 6000);
      const fileName = clean(body.fileName || '', 120);
      if (!rawText) {
        return NextResponse.json({ ok: false, error: 'Document text is required' }, { status: 400 });
      }

      const ai = await generateAIResponse({
        system: `You are an editorial assistant for Mwalimu Family (Kenya education portal). Extract structured FeedItem fields from the uploaded circular, memo, or job advert. Return STRICT JSON only:
{
  "k": "job" or "notice",
  "t": "concise clear title (max 90 chars)",
  "who": "school, ministry, or organization name",
  "loc": "town or county in Kenya (or Nationwide)",
  "cat": "Teaching | Exams | Tutoring | Safety | Policy | Administration",
  "body": "clean, well-structured 2-4 sentence summary with application/action instructions and zero-fee note if job",
  "exp": "YYYY-MM-DD expiry date (default 60 days from today if not stated)"
}`,
        prompt: `Filename: ${fileName || 'pasted-document'}\n\nContent:\n${rawText}`,
        temperature: 0.25,
        maxTokens: 500,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<Record<string, string>>(ai.text);
      if (parsed && parsed.t) {
        return NextResponse.json({
          ok: true,
          provider: ai.provider,
          item: {
            k: parsed.k === 'job' ? 'job' : 'notice',
            t: clean(parsed.t, 100),
            who: clean(parsed.who || 'Mwalimu Family Desk', 80),
            loc: clean(parsed.loc || 'Kenya', 80),
            cat: clean(parsed.cat || 'General', 40),
            body: clean(parsed.body || rawText, 1200),
            exp: /^\d{4}-\d{2}-\d{2}$/.test(parsed.exp || '')
              ? parsed.exp
              : new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10),
          },
        });
      }

      // Deterministic extraction fallback
      const isJob = /\b(vacan|teacher|tutor|apply|cv|tsc|interview|salary|position)\b/i.test(rawText);
      const firstLine = rawText.split(/\r?\n/).find((l) => l.trim().length > 4)?.trim().slice(0, 90) || 'Uploaded Education Notice';
      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        item: {
          k: isJob ? 'job' : 'notice',
          t: firstLine,
          who: fileName ? fileName.replace(/\.[^.]+$/, '') : 'Uploaded Document',
          loc: /nairobi/i.test(rawText) ? 'Nairobi' : /mombasa/i.test(rawText) ? 'Mombasa' : /kisumu/i.test(rawText) ? 'Kisumu' : 'Kenya',
          cat: isJob ? 'Teaching' : 'Exams',
          body: rawText.slice(0, 800),
          exp: new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10),
        },
      });
    }

    if (action === 'draft_item') {
      const kind = body.k === 'job' ? 'job' : 'notice';
      const title = clean(body.t, 120);
      const who = clean(body.who, 80);
      const loc = clean(body.loc, 80);
      const notes = clean(body.body || body.notes, 1200);
      const lang = body.lang === 'sw' ? 'sw' : 'en';

      const ai = await generateAIResponse({
        system:
          lang === 'sw'
            ? 'Wewe ni mhariri wa Mwalimu Family. Andika tangazo au nafasi ya kazi kwa Kiswahili safi, kifupi na cha kitaalamu. Usiongeze uongo.'
            : 'You are an editor for Mwalimu Family (Kenya). Draft or polish a clear, trustworthy listing in 2-4 sentences. For jobs, include a zero-fee reminder.',
        prompt: `Type: ${kind}\nTitle: ${title}\nOrg: ${who}\nLocation: ${loc}\nNotes/Draft: ${notes}`,
        temperature: 0.45,
        maxTokens: 350,
      });

      const draft =
        ai.text ||
        (kind === 'job'
          ? `${who || 'A Kenyan school'} invites qualified applicants for ${title || 'this teaching role'} in ${loc || 'Kenya'}. ${notes || 'Submit your CV and TSC/academic credentials directly to the school.'} Note: Mwalimu Family listings carry 0% placement or application fees.`
          : `${title || 'Official Education Update'} (${who || 'MoE / Mwalimu Family'}): ${notes || 'Please review the updated dates and official guidance carefully.'}`);

      return NextResponse.json({ ok: true, provider: ai.provider, text: draft });
    }

    if (action === 'screen_submission') {
      const sub = body.submission || {};
      const serialized = JSON.stringify(sub).slice(0, 3000);

      const ai = await generateAIResponse({
        system: `You are an editorial safety screener for Mwalimu Family. Evaluate this community submission against 3 strict rules:
Rule 0: Verified phone (+254 / 07xx / 01xx) or organization email present.
Rule 1: Zero fee requested from applicants or learners (flag any M-Pesa/registration/placement fee or exam-leak promise as High Risk).
Rule 2: Dates and location look plausible and consistent.
Return STRICT JSON:
{
  "riskLevel": "Low Risk" | "Needs Review" | "High Risk",
  "summary": "1-2 sentence assessment",
  "suggestedChecks": [boolean, boolean, boolean],
  "recommendation": "Approve" | "Verify Contact" | "Reject"
}`,
        prompt: `Submission:\n${serialized}`,
        temperature: 0.2,
        maxTokens: 300,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<{
        riskLevel: string;
        summary: string;
        suggestedChecks: [boolean, boolean, boolean];
        recommendation: string;
      }>(ai.text);

      if (parsed?.summary) {
        return NextResponse.json({ ok: true, provider: ai.provider, screening: parsed });
      }

      // Deterministic screening fallback
      const hasContact = /(\+?254|07\d{8}|01\d{8}|@)/i.test(serialized);
      const hasFeeScam = /(registration fee|placement fee|pay ksh|send money|early results|leak)/i.test(serialized);
      const hasLocationOrDate = /(nairobi|kiambu|mombasa|kisumu|nakuru|eldoret|county|202\d)/i.test(serialized);

      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        screening: {
          riskLevel: hasFeeScam ? 'High Risk' : hasContact && hasLocationOrDate ? 'Low Risk' : 'Needs Review',
          summary: hasFeeScam
            ? 'Detected potential fee or exam-scam language. Reject unless verified.'
            : hasContact
            ? 'Valid contact details detected and no fee-scam keywords found.'
            : 'Missing clear phone/email contact details; verify before approving.',
          suggestedChecks: [hasContact, !hasFeeScam, hasLocationOrDate],
          recommendation: hasFeeScam ? 'Reject' : hasContact && hasLocationOrDate ? 'Approve' : 'Verify Contact',
        },
      });
    }

    if (action === 'ops_brief') {
      const stats = body.stats || {};
      const ai = await generateAIResponse({
        system: `You are the AI Chief of Staff for Mwalimu Family Admin Control Room. Summarize the current dashboard metrics into 3 concise, actionable bullet points for the editorial team.`,
        prompt: `Dashboard snapshot: ${JSON.stringify(stats).slice(0, 2000)}`,
        temperature: 0.4,
        maxTokens: 280,
      });

      const waiting = Number(stats.waitingCount || 0);
      const expired = Number(stats.expiredCount || 0);
      const text =
        ai.text ||
        `• Inbox Priority: ${waiting > 0 ? `${waiting} submission(s) awaiting 3-point verification.` : 'Inbox is clear and within 48h SLA.'}\n• Content Hygiene: ${expired > 0 ? `${expired} published item(s) have passed their expiry date and should be archived or renewed.` : 'All published jobs and notices are current.'}\n• AI Readiness: Unified Ask Mwalimu assistant and moderation rules are active across public hubs.`;

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported admin AI action' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin AI error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
