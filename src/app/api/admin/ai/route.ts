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

    if (action === 'write_news') {
      const topic = clean(body.topic, 300);
      const notes = clean(body.notes, 3500);
      const category = clean(body.category || 'Education', 40);
      if (!topic && !notes) {
        return NextResponse.json({ ok: false, error: 'Topic or notes required' }, { status: 400 });
      }

      const todayDisplay = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const ai = await generateAIResponse({
        system: `You are the senior Education Desk editor at Mwalimu Family (Kenya). Write a clear, accurate, parent- and teacher-friendly news article about Kenyan education (CBC, KICD, KNEC, MoE, TSC, KUCCPS). Never invent fake exam dates; mark dates as announced targets. Return STRICT JSON only:
{
  "t": "Clear factual headline (max 95 chars)",
  "l": "Education | Explainer | Analysis | Policy",
  "d": "${todayDisplay}",
  "c": ["Lead paragraph summarizing who/what/when/where.", "Second paragraph with curriculum or school context.", "Third paragraph with practical advice and scam safety reminder."],
  "k": ["Key fact 1", "Key fact 2", "Key fact 3"],
  "m": ["Practical takeaway 1 for parents/teachers", "Practical takeaway 2"],
  "q": [["Common parent question 1?", "Clear factual answer 1."], ["Common question 2?", "Clear answer 2."]],
  "x": ["/exams", "Open the Exams hub"]
}`,
        prompt: `Category: ${category}\nTopic / Headline idea: ${topic}\nSource notes / circular details:\n${notes || topic}`,
        temperature: 0.4,
        maxTokens: 950,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<any>(ai.text);
      if (parsed?.t && Array.isArray(parsed.c) && parsed.c.length > 0) {
        return NextResponse.json({
          ok: true,
          provider: ai.provider,
          article: {
            id: `n-${Date.now().toString(36)}`,
            t: clean(parsed.t, 120),
            l: clean(parsed.l || category, 40),
            d: clean(parsed.d || todayDisplay, 40),
            c: parsed.c.map((p: any) => clean(p, 1200)).filter(Boolean).slice(0, 6),
            k: Array.isArray(parsed.k) ? parsed.k.map((x: any) => clean(x, 240)).filter(Boolean) : [],
            m: Array.isArray(parsed.m) ? parsed.m.map((x: any) => clean(x, 300)).filter(Boolean) : [],
            q: Array.isArray(parsed.q)
              ? parsed.q
                  .filter((pair: any) => Array.isArray(pair) && pair.length >= 2)
                  .map((pair: any) => [clean(pair[0], 200), clean(pair[1], 500)] as [string, string])
              : [],
            r: ['s1', 's4'],
            x:
              Array.isArray(parsed.x) && parsed.x.length >= 2
                ? [clean(parsed.x[0], 80), clean(parsed.x[1], 80)]
                : ['/notices', 'View Official Notices'],
          },
        });
      }

      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        article: {
          id: `n-${Date.now().toString(36)}`,
          t: topic || 'Kenya Education Update',
          l: category || 'Education',
          d: todayDisplay,
          c: [
            `${topic || 'This update'} outlines key guidance for Kenyan schools, teachers, and families.`,
            notes || 'Parents and teachers are advised to follow official Ministry of Education, KNEC, and KICD communication channels.',
            'Always remember: official national exam results checking is free and verified vacancies carry zero placement fees.',
          ],
          k: [
            `Published ${todayDisplay}`,
            'Verified by Mwalimu Family Education Desk',
            'Use official MoE / KNEC / TSC portals only',
          ],
          m: ['Check relevant dates against your school term calendar and verify circulars directly with school heads.'],
          q: [['Where can families confirm official announcements?', 'On education.go.ke, knec.ac.ke, or via Mwalimu Family official notices.']],
          r: ['s1', 's4'],
          x: ['/notices', 'Open Official Notices'],
        },
      });
    }

    if (action === 'generate_course') {
      const topic = clean(body.topic, 160);
      const category = clean(body.category || 'Study', 40);
      const level = clean(body.level || 'Beginner', 30);
      if (!topic) {
        return NextResponse.json({ ok: false, error: 'Course topic required' }, { status: 400 });
      }

      const ai = await generateAIResponse({
        system: `You are a Kenyan curriculum designer creating practical self-paced mini-courses for teachers, learners, and parents on Mwalimu Family. Return STRICT JSON only:
{
  "title": "Course title",
  "category": "Digital | Study | Life | Career | Language | Teaching",
  "level": "Beginner | Intermediate | Advanced",
  "duration": "About 2 hours",
  "description": "1-2 sentence course summary",
  "kenyaContext": "1 sentence connecting to Kenyan schools, CBC, KNEC, or daily life",
  "lessons": [
    { "title": "Lesson 1 title", "content": "Practical 2-4 sentence lesson explanation with concrete Kenyan example." },
    { "title": "Lesson 2 title", "content": "..." },
    { "title": "Lesson 3 title", "content": "..." },
    { "title": "Lesson 4 title", "content": "..." }
  ]
}`,
        prompt: `Create a mini-course on: "${topic}" (Category: ${category}, Level: ${level}).`,
        temperature: 0.45,
        maxTokens: 1000,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<any>(ai.text);
      if (parsed?.title && Array.isArray(parsed.lessons) && parsed.lessons.length > 0) {
        return NextResponse.json({
          ok: true,
          provider: ai.provider,
          course: {
            id: clean(parsed.title, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `course-${Date.now()}`,
            title: clean(parsed.title, 90),
            category: ['Digital', 'Study', 'Life', 'Career', 'Language', 'Teaching'].includes(parsed.category) ? parsed.category : category,
            level: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.level) ? parsed.level : level,
            duration: clean(parsed.duration || 'About 2 hours', 40),
            description: clean(parsed.description, 260),
            kenyaContext: clean(parsed.kenyaContext, 260),
            lessons: parsed.lessons.slice(0, 6).map((l: any) => ({
              title: clean(l.title, 100),
              content: clean(l.content, 600),
            })),
          },
        });
      }

      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        course: {
          id: `course-${Date.now().toString(36)}`,
          title: topic,
          category,
          level,
          duration: 'About 2 hours',
          description: `Practical Kenyan guide to mastering ${topic} step by step.`,
          kenyaContext: `Tailored for Kenyan CBE classrooms, families, and everyday digital/career readiness.`,
          lessons: [
            { title: `Foundations of ${topic}`, content: `Start by understanding core terms and everyday applications of ${topic} in Kenyan schools and homes.` },
            { title: 'Step-by-step practice routine', content: 'Break big goals into 20-minute daily sessions using past papers, checklists, and peer review.' },
            { title: 'Applying skills in class and exams', content: 'Connect concepts directly to KICD competency tasks and timed assessment rubrics.' },
          ],
        },
      });
    }

    if (action === 'generate_learning_pack') {
      const grade = clean(body.grade || 'Grade 8', 40);
      const subject = clean(body.subject || 'Mathematics', 60);
      const term = clean(body.term || 'Term 1', 30);
      const type = clean(body.type || 'Lesson Notes', 40);
      const topic = clean(body.topic || '', 150);

      const ai = await generateAIResponse({
        system: `You are a KICD CBC curriculum specialist. Generate a concise, classroom-ready ${type} pack for ${grade} ${subject} (${term}). Return STRICT JSON:
{
  "title": "Pack title",
  "summary": "1-2 sentence summary for the library card",
  "content": "Structured text with Specific Learning Outcomes, Key Inquiry Questions, Core Content/Steps, Competencies & Assessment Rubric (EE/ME/AE/BE)."
}`,
        prompt: `Grade: ${grade}\nSubject: ${subject}\nTerm: ${term}\nMaterial Type: ${type}\nFocus Strand/Topic: ${topic || 'Core Term Strand'}`,
        temperature: 0.45,
        maxTokens: 750,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<any>(ai.text);
      if (parsed?.title && parsed?.content) {
        return NextResponse.json({
          ok: true,
          provider: ai.provider,
          material: {
            id: `lm-${Date.now().toString(36)}`,
            title: clean(parsed.title, 120),
            grade,
            subject,
            term,
            type,
            summary: clean(parsed.summary || `${grade} ${subject} ${type}`, 260),
            content: clean(parsed.content, 2400),
            featured: true,
            createdAt: new Date().toISOString().slice(0, 10),
          },
        });
      }

      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        material: {
          id: `lm-${Date.now().toString(36)}`,
          title: `${grade} ${subject} — ${topic || term} (${type})`,
          grade,
          subject,
          term,
          type,
          summary: `Ready-to-use KICD CBE ${type.toLowerCase()} for ${grade} ${subject} (${term}).`,
          content: `Specific Learning Outcomes:\n1. Explain foundational principles of ${topic || subject} for ${grade}.\n2. Apply concepts to practical Kenyan everyday problem-solving tasks.\n\nKey Inquiry Questions:\n- How does ${topic || subject} help learners solve real community challenges?\n\nLearning Activities & Assessment:\n- Group investigation, worked examples, and EE / ME / AE / BE observation checklist.`,
          featured: true,
          createdAt: new Date().toISOString().slice(0, 10),
        },
      });
    }

    if (action === 'generate_quiz_pack') {
      const mode = clean(body.mode || 'quiz', 20);
      const subjectKey = body.subjectKey === 's' || body.subjectKey === 'k' ? body.subjectKey : 'm';
      const topic = clean(body.topic || '', 120);
      const subjectName = subjectKey === 'm' ? 'Mathematics' : subjectKey === 's' ? 'Integrated Science' : 'Kiswahili';

      if (mode === 'memory') {
        const ai = await generateAIResponse({
          system: `Return STRICT JSON array of 6 Kiswahili-English vocabulary pairs for Kenyan learners: [["KiswahiliWord","EnglishWord"], ...]`,
          prompt: `Topic/Theme: ${topic || 'Shule, Elimu na Jamii'}`,
          temperature: 0.5,
          maxTokens: 300,
          jsonMode: true,
        });
        const parsed = extractJSONFromText<any[]>(ai.text);
        const pairs = Array.isArray(parsed)
          ? parsed.filter((p) => Array.isArray(p) && p.length >= 2).map((p) => [clean(p[0], 30), clean(p[1], 30)] as [string, string])
          : [];
        return NextResponse.json({
          ok: true,
          provider: pairs.length >= 4 ? ai.provider : 'fallback',
          pairs: pairs.length >= 4 ? pairs : [['Darasa', 'Classroom'], ['Sayansi', 'Science'], ['Hisabati', 'Mathematics'], ['Mtihani', 'Examination'], ['Kazi', 'Work'], ['Elimu', 'Education']],
        });
      }

      if (mode === 'scramble') {
        const ai = await generateAIResponse({
          system: `Return STRICT JSON array of 5 uppercase English/Kiswahili educational vocabulary words for a Kenyan school word scramble game: [{"word":"GEOMETRY","hint":"Branch of maths studying shapes and angles"}, ...]`,
          prompt: `Theme: ${topic || 'CBC STEM & Languages'}`,
          temperature: 0.5,
          maxTokens: 350,
          jsonMode: true,
        });
        const parsed = extractJSONFromText<any[]>(ai.text);
        const words = Array.isArray(parsed)
          ? parsed
              .filter((w) => w?.word && w?.hint)
              .map((w) => ({ word: clean(w.word, 24).toUpperCase().replace(/[^A-Z]/g, ''), hint: clean(w.hint, 120) }))
              .filter((w) => w.word.length >= 4)
          : [];
        return NextResponse.json({
          ok: true,
          provider: words.length >= 2 ? ai.provider : 'fallback',
          words: words.length >= 2 ? words : [{ word: 'PHOTOSYNTHESIS', hint: 'How green plants make food using sunlight' }, { word: 'EQUATION', hint: 'Mathematical statement showing two expressions are equal' }, { word: 'KUCCPS', hint: 'Kenyan university and college placement body' }],
        });
      }

      const ai = await generateAIResponse({
        system: `Create 4 concise Kenyan CBE multiple-choice revision questions for ${subjectName}. Return STRICT JSON array:
[{"q":"question text","opts":["opt A","opt B","opt C"],"ans":0}] where ans is 0, 1, or 2.`,
        prompt: `Subject: ${subjectName}\nTopic: ${topic || 'Junior & Senior School core revision'}`,
        temperature: 0.5,
        maxTokens: 550,
        jsonMode: true,
      });
      const parsed = extractJSONFromText<any[]>(ai.text);
      const questions = Array.isArray(parsed)
        ? parsed
            .filter((x) => x?.q && Array.isArray(x.opts) && x.opts.length >= 3)
            .map((x) => ({
              q: clean(x.q, 240),
              opts: x.opts.slice(0, 3).map((o: any) => clean(o, 100)),
              ans: Math.min(2, Math.max(0, Number(x.ans) || 0)),
            }))
        : [];
      return NextResponse.json({
        ok: true,
        provider: questions.length > 0 ? ai.provider : 'fallback',
        questions: questions.length > 0 ? questions : [
          { q: `Which skill helps most when revising ${topic || subjectName}?`, opts: ['Solving timed practice questions', 'Guessing without checking', 'Memorising without understanding'], ans: 0 },
        ],
      });
    }

    if (action === 'rewrite_titles') {
      const enTitle = clean(body.title, 180);
      const enSubtitle = clean(body.subtitle, 320);
      const context = clean(body.context || 'Kenyan education homepage section', 120);

      const ai = await generateAIResponse({
        system: `You are a bilingual Kenyan UX copywriter for Mwalimu Family. Polish the English heading/subtitle to be crisp, warm, and clear, and provide accurate natural Kiswahili equivalents. Return STRICT JSON:
{"title":"...","titleSw":"...","subtitle":"...","subtitleSw":"..."}`,
        prompt: `Context: ${context}\nCurrent Title: ${enTitle}\nCurrent Subtitle: ${enSubtitle}`,
        temperature: 0.45,
        maxTokens: 320,
        jsonMode: true,
      });
      const parsed = extractJSONFromText<any>(ai.text);
      if (parsed?.title) {
        return NextResponse.json({ ok: true, provider: ai.provider, copy: parsed });
      }
      return NextResponse.json({
        ok: true,
        provider: 'fallback',
        copy: {
          title: enTitle,
          titleSw: enTitle,
          subtitle: enSubtitle,
          subtitleSw: enSubtitle,
        },
      });
    }

    if (action === 'draft_reply') {
      const sub = body.submission || {};
      const ai = await generateAIResponse({
        system: `Draft a polite, clear, helpful reply from Mwalimu Family Editorial Desk (Kenya) to the sender of this submission. Remind them of our 0% fee and 48h verification review policy. Keep it 3-4 sentences suitable for WhatsApp or email.`,
        prompt: `Submission: ${JSON.stringify(sub).slice(0, 2000)}`,
        temperature: 0.45,
        maxTokens: 240,
      });
      return NextResponse.json({
        ok: true,
        provider: ai.provider,
        text:
          ai.text ||
          `Jambo ${clean(sub.from_name || 'Friend', 50)}, thank you for contacting Mwalimu Family (Ref: ${clean(sub.ref || '', 30)}). Our editorial desk has received "${clean(sub.title || 'your submission', 90)}" and is completing contact & zero-fee verification within 48 hours. Reply with any extra documentation if needed.`,
      });
    }

    if (action === 'analyze_assistant') {
      const logs = Array.isArray(body.logs) ? body.logs.slice(0, 20) : [];
      const ai = await generateAIResponse({
        system: `Analyze recent student/parent questions from Ask Mwalimu AI and give 3 actionable editorial recommendations (topics to write news or courses about, plus common confusion points).`,
        prompt: `Recent questions: ${JSON.stringify(logs).slice(0, 2500)}`,
        temperature: 0.4,
        maxTokens: 320,
      });
      return NextResponse.json({
        ok: true,
        provider: ai.provider,
        text:
          ai.text ||
          '• Top learner focus continues to center on KJSEA performance bands, Grade 10 STEM/Social pathway choices, and KCSE cluster math.\n• Recommendation: Publish a clear Term 1 Grade 10 checklist explainer in News & pin the scam advisory banner.\n• Keep built-in CBE fallback active for low-bandwidth mobile learners.',
      });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported admin AI action' }, { status: 400 });
  } catch (err: any) {
    console.error('Admin AI error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
