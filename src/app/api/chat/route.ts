import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';
import { generateAIResponse } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const clean = (s: any, max = 500) =>
  String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);

const SITE_FACTS = [
  'KJSEA (Grade 9) results are targeted for December 2026. 13,484 examiners at 24 centres are marking.',
  'KCSE results are targeted for January 2027. 34,170 examiners at 41 centres mark 1,048,355 candidate papers.',
  'KPSEA results are targeted for January 2027.',
  'KJSEA scoring uses 8 performance levels (EE1=8 down to BE2=1) across 9 subjects, maximum 72 points.',
  'KCSE uses 12 grade points (A=12 down to E=1). Mean grade is calculated from the best 7 subjects (maximum 84).',
  'KUCCPS cluster points formula is sqrt((r/48) * (t/84)) * 48, where r = 4 cluster subjects and t = total best 7.',
  'Official portals: knec.ac.ke, education.go.ke, kuccps.net, helb.co.ke, tsc.go.ke.',
  'SCAM WARNING: Results checking is 100% free on official KNEC SMS and portals. Never pay anyone to see results early.',
];

function getKnowledgeReply(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('scam') || q.includes('pay') || q.includes('fake') || q.includes('money')) {
    return 'Results scam warning: Never pay anyone claiming to release or alter exam results early. KNEC releases results strictly through official MoE and KNEC portals and official SMS codes. Report extortion to the nearest police post or MoE office.';
  }

  if (q.includes('kjsea') || (q.includes('grade 9') && q.includes('result'))) {
    return 'KJSEA (Grade 9 CBE) results are targeted for release in December 2026. Marking is underway with 13,484 examiners across 24 centres. Scoring is out of 72 points (8 performance levels across 9 learning areas).';
  }

  if (q.includes('kcse') && (q.includes('result') || q.includes('release') || q.includes('date'))) {
    return 'KCSE 2026 results are targeted for release in January 2027 by Education CS Julius Ogamba. 34,170 examiners across 41 marking centres are grading scripts for 1,048,355 candidates. Keep checking official MoE announcements.';
  }

  if (q.includes('kpsea')) {
    return 'KPSEA (Grade 6) results are targeted for release in January 2027 alongside KCSE announcements, providing assessment feedback for Junior Secondary school placement.';
  }

  if (q.includes('cluster') || q.includes('kuccps')) {
    return 'KUCCPS weighted cluster points formula: sqrt((r/48) * (t/84)) * 48, where "r" is your aggregate points in the 4 prerequisite cluster subjects and "t" is your KCSE 7-subject total (max 84). Check out our Tools calculator on the site!';
  }

  if (q.includes('grade 10') || q.includes('pathway') || q.includes('senior')) {
    return 'In Senior School (Grade 10), learners choose from 3 main pathways: STEM (Pure Sciences, Applied Sciences, Technical & Engineering), Social Sciences (Humanities, Business, Languages), and Arts & Sports Science.';
  }

  if (q.includes('tsc') || q.includes('register') || q.includes('teacher')) {
    return 'To register with TSC, apply online via teachersonline.tsc.go.ke with certified copies of your academic certificates, teaching practice transcript, GP69 medical report, and Certificate of Good Conduct.';
  }

  if (q.includes('fee') || q.includes('secondary fee')) {
    return 'MoE secondary school fee guidelines cap tuition for public schools. Parents should refer to our Secondary School Fees Planner tool in the Tools section to estimate termly allocations and county bursary planning.';
  }

  return 'Mwalimu Family is here to help with Kenyan education news, KJSEA/KCSE exam results schedules, Grade 10 pathways, KUCCPS university placements, and classroom tools. Explore our Tools, Library, and Exams Hub sections on this page!';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = clean(body.message, 500);

    if (!message) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const ai = await generateAIResponse({
      system: `You are "Ask Mwalimu", the AI educational assistant on Mwalimu Family (mwalimufamily.com), Kenya's trusted education and curriculum platform. Answer in under 120 words in warm, factual Kenyan educational English or Kiswahili if asked. Reference: ${SITE_FACTS.join(' ')}`,
      prompt: message,
      temperature: 0.45,
      maxTokens: 300,
    });

    const reply = ai.text || getKnowledgeReply(message);
    const usedModel = ai.model || (ai.provider === 'anthropic' ? 'claude-3-haiku' : 'knowledge-engine');

    // Log to Supabase assistant_logs
    try {
      const admin = getAdminClient();
      await admin.from('assistant_logs').insert([
        {
          question: message,
          reply,
          model: usedModel,
          status: 'ok',
        },
      ]);
    } catch {}

    return NextResponse.json({ reply, provider: ai.provider, model: usedModel }, { status: 200 });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
