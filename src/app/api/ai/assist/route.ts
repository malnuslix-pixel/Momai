import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, extractJSONFromText } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const clean = (s: unknown, max = 3000) =>
  String(s ?? '').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, ' ').trim().slice(0, max);

const SITE_CONTEXT = `
Mwalimu Family (mwalimufamily.com) is a Kenyan education platform for CBC & 8-4-4 teachers, parents, and learners.
Key facts:
- KJSEA (Grade 9 CBE) results targeted Dec 2026 (72 pts max, 8 performance levels EE1-BE2 across 9 learning areas).
- KCSE results targeted Jan 2027 (12 grade points A=12 to E=1, best 7 subjects max 84).
- KPSEA (Grade 6) targeted Jan 2027.
- KUCCPS cluster formula: sqrt((r/48) * (t/84)) * 48.
- Senior School Grade 10 Pathways: STEM, Social Sciences, Arts & Sports Science.
- Scam warning: Official KNEC/MoE results checking is 100% free. Job postings have 0% placement fee.
Available routes on site: /learn (Curriculum Library), /tools (Calculators & Remarks), /exams (Exams Hub), /teach (Teacher Desk), /tutor (AI Tutor), /notices (MoE Notices), /jobs (Teaching Jobs), /parents (Parents Hub), /courses (Courses), /games (Quizzes & Games).
`.trim();

function buildSearchFallback(query: string) {
  const q = query.toLowerCase();
  const routes: { label: string; href: string }[] = [];

  if (q.includes('kcse') || q.includes('cluster') || q.includes('kuccps') || q.includes('grade 10') || q.includes('pathway')) {
    routes.push({ label: 'Open Calculators & Pathway Tools', href: '/tools' });
  }
  if (q.includes('exam') || q.includes('kjsea') || q.includes('kpsea') || q.includes('result') || q.includes('scam')) {
    routes.push({ label: 'View National Exams Hub', href: '/exams' });
  }
  if (q.includes('scheme') || q.includes('lesson') || q.includes('note') || q.includes('cbc') || q.includes('grade')) {
    routes.push({ label: 'Browse Curriculum Library', href: '/learn' });
  }
  if (q.includes('teach') || q.includes('tpad') || q.includes('timetable')) {
    routes.push({ label: 'Open Teacher Preparation Desk', href: '/teach' });
  }
  if (q.includes('job') || q.includes('vacanc')) {
    routes.push({ label: 'Browse Teaching Jobs (0% Fee)', href: '/jobs' });
  }
  if (q.includes('parent') || q.includes('fee')) {
    routes.push({ label: 'Open Parents Guidance Hub', href: '/parents' });
  }
  if (routes.length === 0) {
    routes.push(
      { label: 'Ask Mwalimu AI Tutor', href: '/tutor' },
      { label: 'Browse Curriculum Library', href: '/learn' }
    );
  }

  let answer =
    'Mwalimu Family provides verified Kenyan CBC & 8-4-4 curriculum resources, official KNEC/MoE exam timelines, Grade 10 pathway tools, and zero-fee teaching vacancies.';
  if (q.includes('kjsea')) {
    answer = 'KJSEA (Grade 9 CBE) results are targeted for December 2026. Scoring is out of 72 points across 9 learning areas using 8 performance levels (EE1=8 down to BE2=1).';
  } else if (q.includes('kcse') || q.includes('kuccps') || q.includes('cluster')) {
    answer = 'KCSE uses best 7 subjects (max 84 points), and KUCCPS weighted cluster points use sqrt((r/48) * (t/84)) * 48. Use our Classroom & KCSE Tools to compute your exact points.';
  } else if (q.includes('grade 10') || q.includes('pathway')) {
    answer = 'Grade 10 Senior School learners select from 3 pathways: STEM, Social Sciences, or Arts & Sports Science based on KJSEA performance, interests, and career goals.';
  } else if (q.includes('scheme') || q.includes('lesson') || q.includes('tpad')) {
    answer = 'You can download editable CBC schemes of work, lesson plan templates, and TPAD records in the Curriculum Library and Teacher Preparation Desk.';
  }

  return { answer, suggestedRoutes: routes.slice(0, 3) };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = clean(body.task, 40);

    if (!task) {
      return NextResponse.json({ ok: false, error: 'task is required' }, { status: 400 });
    }

    if (task === 'search') {
      const query = clean(body.query, 400);
      if (!query) {
        return NextResponse.json({ ok: false, error: 'query is required' }, { status: 400 });
      }

      const ai = await generateAIResponse({
        system: `${SITE_CONTEXT}\nRespond strictly in JSON: {"answer":"concise 2-3 sentence answer","suggestedRoutes":[{"label":"...","href":"/route"}]}. Pick 1 to 3 matching routes from the available routes list.`,
        prompt: `User search query: "${query}"`,
        temperature: 0.4,
        maxTokens: 350,
        jsonMode: true,
      });

      const parsed = extractJSONFromText<{ answer: string; suggestedRoutes: { label: string; href: string }[] }>(ai.text);
      if (parsed?.answer) {
        return NextResponse.json({
          ok: true,
          provider: ai.provider,
          answer: parsed.answer,
          suggestedRoutes: Array.isArray(parsed.suggestedRoutes) ? parsed.suggestedRoutes.slice(0, 3) : [],
        });
      }

      const fallback = buildSearchFallback(query);
      return NextResponse.json({ ok: true, provider: 'fallback', ...fallback });
    }

    if (task === 'scheme') {
      const grade = clean(body.grade || 'Grade 7', 60);
      const subject = clean(body.subject || 'Mathematics', 80);
      const strand = clean(body.strand || 'Core Strand', 150);
      const term = clean(body.term || 'Term 1', 40);

      const ai = await generateAIResponse({
        system: `You are a senior Kenyan KICD CBC curriculum designer. Generate a practical, classroom-ready ${term} Scheme of Work & Lesson Outline for ${grade} ${subject} on the strand "${strand}". Include: 1) Specific Learning Outcomes, 2) Key Inquiry Questions, 3) Suggested Learning Experiences (3-4 steps), 4) Core Competencies & Values, and 5) Assessment Rubric indicators. Keep it clear and structured.`,
        prompt: `Create a KICD CBC outline for ${grade} ${subject}, ${term}, Strand/Topic: ${strand}.`,
        temperature: 0.55,
        maxTokens: 700,
      });

      const text =
        ai.text ||
        `KICD CBC Outline — ${grade} ${subject} (${term})\nStrand: ${strand}\n\n1. Learning Outcomes:\n- Identify key concepts in ${strand} and apply them to everyday Kenyan contexts.\n- Demonstrate collaborative problem solving during group tasks.\n\n2. Key Inquiry Questions:\n- How does ${strand} apply in real-life community situations?\n\n3. Learning Experiences:\n- Guided discovery and pair discussion.\n- Hands-on practical activity using locally available materials.\n- Short formative reflection exercise.\n\n4. Core Competencies & Values:\n- Critical thinking, communication & collaboration, responsibility.\n\n5. Assessment:\n- Observation checklist, oral questioning, and written rubric (EE / ME / AE / BE).`;

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    if (task === 'remark') {
      const subject = clean(body.subject || 'Mathematics', 80);
      const level = clean(body.level || 'ME (Meeting Expectation)', 80);
      const strengths = clean(body.strengths || '', 200);

      const ai = await generateAIResponse({
        system: `You are a Kenyan CBC teacher writing concise, encouraging, actionable end-of-term report card remarks (2-3 sentences).`,
        prompt: `Write a CBC report card remark for ${subject} at performance level ${level}.${strengths ? ` Learner notes: ${strengths}` : ''}`,
        temperature: 0.6,
        maxTokens: 180,
      });

      const text =
        ai.text ||
        `Shows ${level.toLowerCase().includes('exceed') ? 'outstanding mastery' : level.toLowerCase().includes('meet') ? 'steady competence' : 'developing progress'} in ${subject}. ${strengths ? `Notable strength: ${strengths}. ` : ''}Encouraged to practice daily and participate actively in group tasks next term.`;

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    if (task === 'pathway') {
      const summary = clean(body.summary, 400);
      const ai = await generateAIResponse({
        system: `${SITE_CONTEXT}\nGive concise, encouraging Kenyan Grade 10 Senior School or KUCCPS university pathway guidance in 3-4 bullet points.`,
        prompt: `Learner profile / scores: ${summary}`,
        temperature: 0.5,
        maxTokens: 320,
      });

      const text =
        ai.text ||
        `• Review your strongest learning areas across STEM, Social Sciences, and Arts & Sports Science.\n• Match your Grade 10 track or KUCCPS degree cluster with subjects where you consistently score EE/ME or B+ and above.\n• Confirm official KUCCPS / MoE cutoffs and prerequisite subjects before locking your final choices.`;

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    if (task === 'summarize') {
      const title = clean(body.title, 200);
      const content = clean(body.content, 3000);
      const lang = body.lang === 'sw' ? 'sw' : 'en';

      const ai = await generateAIResponse({
        system:
          lang === 'sw'
            ? 'Fupisha makala hii ya elimu ya Kenya kwa Kiswahili rahisi na wazi (vipengele 3 vifupi vya nukta).'
            : 'Summarize this Kenyan education article in plain, parent-friendly English (3 concise bullet points).',
        prompt: `Title: ${title}\n\nArticle:\n${content}`,
        temperature: 0.4,
        maxTokens: 280,
      });

      const text =
        ai.text ||
        (lang === 'sw'
          ? `• ${title}\n• Taarifa hii imethibitishwa kwa kuzingatia miongozo rasmi ya Wizara ya Elimu na KNEC.\n• Epuka walaghai wanaodai malipo ili kutoa matokeo mapema.`
          : `• ${title}\n• Key takeaways are aligned with official Ministry of Education and KNEC updates.\n• Always verify exam notices on official portals and never pay for early results.`);

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    if (task === 'explain_lesson') {
      const courseTitle = clean(body.courseTitle, 140);
      const lessonTitle = clean(body.lessonTitle, 140);
      const lessonContent = clean(body.lessonContent, 1200);
      const lang = body.lang === 'sw' ? 'sw' : 'en';

      const ai = await generateAIResponse({
        system:
          lang === 'sw'
            ? 'Wewe ni mwalimu rafiki wa Mwalimu Family. Eleza somo hili kwa Kiswahili rahisi ukitoa mfano mmoja halisi wa maisha ya Kenya na zoezi moja fupi.'
            : 'You are Mwalimu Family AI Tutor. Explain this mini-course lesson in simple practical words with 1 Kenyan real-life example and 1 quick self-check exercise (3-4 short bullets).',
        prompt: `Course: ${courseTitle}\nLesson: ${lessonTitle}\nSummary: ${lessonContent}`,
        temperature: 0.5,
        maxTokens: 320,
      });

      const text =
        ai.text ||
        (lang === 'sw'
          ? `• Somo: ${lessonTitle}\n• Mfano wa Kenya: Tumia ujuzi huu katika bajeti ya shule, miradi ya kikundi, au ujumbe salama wa simu.\n• Zoezi fupi: Eleza hatua moja unayoweza kuitumia leo.`
          : `• Key Idea (${lessonTitle}): Focus on one small daily habit you can repeat consistently.\n• Kenyan Example: Apply this directly when reviewing KNEC past papers, budgeting via M-Pesa, or organizing class notes.\n• Quick Try: Write a 2-sentence summary in your notebook before moving to the next lesson.`);

      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    if (task === 'explain_term') {
      const term = clean(body.term, 100);
      const definition = clean(body.definition, 600);
      const lang = body.lang === 'sw' ? 'sw' : 'en';

      const ai = await generateAIResponse({
        system:
          lang === 'sw'
            ? 'Eleza istilahi hii ya elimu ya Kenya (CBC / KNEC / KUCCPS / TSC) kwa lugha nyepesi kwa wazazi na wanafunzi katika sentensi 2-3.'
            : 'Explain this Kenyan education term clearly for parents and learners in 2-3 plain sentences with what action families should take if relevant.',
        prompt: `Term: ${term}\nGlossary Note: ${definition}`,
        temperature: 0.4,
        maxTokens: 220,
      });

      const text = ai.text || `${term}: ${definition} Ask your school academic desk or check official MoE/KNEC circulars if you need confirmation.`;
      return NextResponse.json({ ok: true, provider: ai.provider, text });
    }

    return NextResponse.json({ ok: false, error: 'Unsupported task' }, { status: 400 });
  } catch (err: any) {
    console.error('AI assist error:', err);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
