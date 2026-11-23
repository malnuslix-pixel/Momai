// ==============================================================================
// MWALIMU FAMILY - CORE DATA, SYLLABUS & UTILITIES
// 100% Typed Kenyan CBC & 8-4-4 Education Platform Data
// ==============================================================================

export interface Article {
  id: string;
  t: string;      // Title
  l: string;      // Label/Category
  d: string;      // Date
  c: string[];    // Paragraphs
  k?: string[];   // Key facts
  m?: string[];   // What it means for you
  q?: [string, string][]; // FAQs [Question, Answer]
  r: string[];    // Related story IDs
  x?: [string, string];   // Action link [href, label]
}

export const ARTICLES: Record<string, Article> = {
  s1: {
    id: 's1',
    t: '2026 KJSEA results expected in December as KCSE results targeted for January 2027',
    l: 'Education',
    d: '20 November 2026',
    c: [
      'Education CS Julius Ogamba has announced the expected release timelines for the 2026 national examinations. KJSEA results are expected in December, while KCSE and KPSEA results are targeted for January 2027.',
      'The KCSE had 1,048,355 candidates across 10,693 examination centres. KJSEA marking involves 13,484 examiners working at 24 marking centres.',
      'Parents are advised to wait for official announcements before acting on social media rumours about release dates.'
    ],
    k: [
      'Announced by Education CS Julius Ogamba on 20 November 2026',
      'KJSEA results expected in December 2026',
      'KCSE and KPSEA results targeted for January 2027',
      '1,048,355 KCSE candidates at 10,693 examination centres',
      '13,484 KJSEA examiners at 24 marking centres'
    ],
    m: [
      'Plan around the December window for KJSEA and the January window for KCSE and KPSEA, and treat all dates as targets.',
      'Wait for official announcements before acting on social media rumours.'
    ],
    q: [
      ['Will results be released on a fixed day?', 'The dates announced are targets, not guarantees. Watch official channels for confirmation.'],
      ['Where should I check results?', 'Only through official Ministry of Education and KNEC channels. Never pay to see results early.'],
      ['Why do the three exams have different dates?', 'They are separate assessments at different levels, each marked and processed on its own timeline.']
    ],
    r: ['s2', 's4', 's5'],
    x: ['#notices', 'KJSEA countdown and Grade 10 checklist']
  },
  s2: {
    id: 's2',
    t: 'What parents and learners should know about the KJSEA and KCSE timelines',
    l: 'Analysis',
    d: '20 November 2026',
    c: [
      'Release dates are targets, not guarantees. Families should plan around a window, not a single day.',
      'While you wait: keep revision light and steady, agree who in the family will check official channels, and gather any documents the school may ask for.',
      'Check results only through official Ministry of Education and KNEC channels, and be wary of messages asking you to pay to see results.'
    ],
    k: [
      'Release dates are targets, not guarantees',
      'Plan around a window, not a single day',
      'Use official channels only'
    ],
    q: [
      ['What should we do while waiting?', 'Keep revision light and steady, agree who checks official channels, and gather documents the school may ask for.']
    ],
    r: ['s1', 's4', 's5'],
    x: ['#notices', 'KJSEA countdown and Grade 10 checklist']
  },
  s4: {
    id: 's4',
    t: 'How to spot fake KJSEA and KCSE results messages',
    l: 'Explainer',
    d: '21 November 2026',
    c: [
      'Every results season, fake messages circulate on social media and WhatsApp offering early results for a fee.',
      'Red flags: a request for money, an unofficial number or link, pressure to act fast, or a request for your child’s index number and personal details.',
      'Use only official Ministry of Education and KNEC channels, and report suspicious messages to the authorities.'
    ],
    k: [
      'Red flag: any request for money',
      'Red flag: unofficial number or link',
      'Red flag: pressure to act fast',
      'Red flag: asks for your child’s index number or personal details'
    ],
    m: [
      'If a message offers early results, do not reply or pay. Report it to the authorities and warn other families.'
    ],
    q: [
      ['Can anyone release results early for a fee?', 'No. Only official Ministry of Education and KNEC channels release results.'],
      ['What should I do if I already shared details?', 'Contact your school and the authorities promptly, and avoid replying further.']
    ],
    r: ['s1', 's2', 's5'],
    x: ['#parents', 'Open the Parents’ hub']
  },
  s5: {
    id: 's5',
    t: 'KPSEA, KJSEA and KCSE explained: how Kenya’s national assessments fit together',
    l: 'Explainer',
    d: '21 November 2026',
    c: [
      'Kenya has three national assessments that families hear about most. KPSEA comes at the end of Grade 6, KJSEA at the end of Grade 9 in Junior School, and KCSE at the end of secondary school.',
      'Each one answers a different question. KPSEA marks the move from primary to Junior School, KJSEA informs placement into Grade 10 and the senior school pathways, and KCSE feeds university, college and TVET placement through KUCCPS.'
    ],
    k: [
      'KPSEA: end of Grade 6',
      'KJSEA: end of Grade 9, Junior School',
      'KCSE: end of secondary school',
      'Results for 2026: KJSEA expected December, KPSEA and KCSE targeted January 2027'
    ],
    m: [
      'Know which assessment your child is preparing for, and ask the school how it will be used for placement.',
      'Follow the Ministry of Education and KNEC for official dates and procedures.'
    ],
    q: [
      ['Which exam does my Grade 9 learner sit?', 'KJSEA, at the end of Junior School.'],
      ['Where are results released?', 'Through official Ministry of Education and KNEC channels only. See the exams hub for safety tips.']
    ],
    r: ['s1', 's4'],
    x: ['#exams', 'Open the Exams hub']
  }
};

// ---- Curriculum Levels & Subjects ----
export const GRADES = [
  'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
  'Form 1', 'Form 2', 'Form 3', 'Form 4'
];

export const SUBJECT_GROUPS: string[][] = [
  // PP1 - Grade 3 (Lower Primary)
  ['Literacy', 'Mathematics', 'Kiswahili', 'English', 'Environmental Activities', 'Religious Education', 'Creative Activities'],
  // Grade 4 - 6 (Upper Primary)
  ['Mathematics', 'English', 'Kiswahili', 'Science and Technology', 'Social Studies', 'Agriculture and Nutrition', 'Religious Education', 'Creative Arts'],
  // Grade 7 - 9 (Junior Secondary)
  ['Mathematics', 'English', 'Kiswahili', 'Integrated Science', 'Social Studies', 'Agriculture and Nutrition', 'Pre-Technical Studies', 'Creative Arts and Sports', 'Religious Education'],
  // Grade 10 - 12 (Senior School)
  ['English', 'Kiswahili', 'Core Mathematics', 'Community Service Learning', 'Physical Education', 'Biology', 'Chemistry', 'Physics', 'General Science', 'Essential Mathematics', 'Computer Studies', 'Agriculture', 'Home Science', 'Business Studies', 'Geography', 'History and Citizenship', 'Literature in English', 'Fasihi ya Kiswahili', 'Christian Religious Education', 'Islamic Religious Education', 'Fine Arts', 'Music and Dance', 'Theatre and Film', 'Sports and Recreation'],
  // Form 1 - 4 (Legacy 8-4-4)
  ['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics', 'History', 'Geography', 'CRE', 'IRE', 'Business Studies', 'Computer Studies', 'Agriculture', 'Home Science', 'Literature in English']
];

export function getSubjectsForGrade(grade: string): string[] {
  const i = GRADES.indexOf(grade);
  if (i < 0) return SUBJECT_GROUPS[2];
  return SUBJECT_GROUPS[i < 5 ? 0 : i < 8 ? 1 : i < 11 ? 2 : i < 14 ? 3 : 4];
}

export const RESOURCE_TYPES: [string, string][] = [
  ['Scheme', 'scheme'],
  ['Lesson plan', 'lesson'],
  ['Notes', 'notes'],
  ['Exam', 'exam'],
  ['Record', 'record']
];

export const TERMS = ['Term 1', 'Term 2', 'Term 3'];

export function getSubjectEmoji(subject: string): string {
  if (/math|numer/i.test(subject)) return '🔢';
  if (/english|literacy/i.test(subject)) return '📖';
  if (/kiswahili/i.test(subject)) return '🗣️';
  if (/science|biology|physics|chem/i.test(subject)) return '🔬';
  if (/social|history|geograph|citizen/i.test(subject)) return '🌍';
  if (/agri|nutrition/i.test(subject)) return '🌱';
  if (/relig|cre|ire/i.test(subject)) return '🕊️';
  if (/art|creative|music/i.test(subject)) return '🎨';
  if (/tech|computer/i.test(subject)) return '🛠️';
  if (/business/i.test(subject)) return '💼';
  if (/physical|sport/i.test(subject)) return '⚽';
  return '📚';
}

export function getSubjectHue(subject: string): number {
  let h = 0;
  for (let i = 0; i < subject.length; i++) {
    h = (h * 31 + subject.charCodeAt(i)) % 360;
  }
  return h;
}

// ---- Document Generator (.doc Word file) ----
export function downloadWordDocument(filename: string, title: string, grade: string, subject: string, term: string, type: string) {
  const tableHeader = ['Week', 'Lesson', 'Strand', 'Sub-strand', 'Specific learning outcomes', 'Learning experiences', 'Key inquiry question(s)', 'Learning resources', 'Assessment', 'Reflection'];
  
  let rowsHtml = '';
  for (let i = 1; i <= 13; i++) {
    rowsHtml += `<tr>
      <td style="padding:6px;border:1px solid #333;text-align:center;">${i}</td>
      <td style="padding:6px;border:1px solid #333;text-align:center;">1-5</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
      <td style="padding:6px;border:1px solid #333;">&nbsp;</td>
    </tr>`;
  }

  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${title}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; }
      h2 { color: #1a3d1b; }
      table { border-collapse: collapse; width: 100%; font-size: 11pt; }
      th { background-color: #eaf0ea; color: #1a3d1b; padding: 6px; border: 1px solid #333; font-weight: bold; }
    </style>
    </head>
    <body>
      <h2>MWALIMU FAMILY — ${title.toUpperCase()}</h2>
      <p><b>School:</b> _________________________ &nbsp;&nbsp; <b>Teacher:</b> _________________________</p>
      <p><b>Grade:</b> ${grade} &nbsp;&nbsp; <b>Subject:</b> ${subject} &nbsp;&nbsp; <b>Term:</b> ${term} &nbsp;&nbsp; <b>Year:</b> 2026</p>
      <p><i>KICD Curriculum Design Aligned · Free and Editable</i></p>
      <br/>
      <table>
        <thead>
          <tr>${tableHeader.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---- iCalendar (.ics) Generator ----
export function downloadSchoolCalendar(terms: { open: string; close: string }[]) {
  const events = terms.map((t, idx) => {
    if (!t.open || !t.close) return '';
    const openFormatted = t.open.replace(/-/g, '');
    const closeDate = new Date(t.close);
    closeDate.setDate(closeDate.getDate() + 1);
    const closeFormatted = closeDate.toISOString().slice(0, 10).replace(/-/g, '');
    return `BEGIN:VEVENT\r\nUID:term-${idx + 1}-2026@mwalimufamily\r\nDTSTAMP:20260101T000000Z\r\nSUMMARY:Term ${idx + 1} (Kenya School Term)\r\nDTSTART;VALUE=DATE:${openFormatted}\r\nDTEND;VALUE=DATE:${closeFormatted}\r\nEND:VEVENT`;
  }).filter(Boolean).join('\r\n');

  if (!events) return;

  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Mwalimu Family//EN\r\n${events}\r\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kenya-school-calendar-2026.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ---- Ask Mwalimu Knowledge Base Rules ----
export const ASK_MWALIMU_KB = [
  {
    keys: ['result', 'kjsea', 'kcse', 'kpsea', 'release', 'timeline', 'date'],
    reply: 'KJSEA results are expected in December 2026. KCSE and KPSEA are targeted for January 2027. These are targets, so watch official Ministry of Education and KNEC channels.',
    link: ['#exams', 'Open the Exams hub']
  },
  {
    keys: ['fake', 'scam', 'pay', 'early', 'suspicious', 'money'],
    reply: 'Never pay to see results early. Only official Ministry of Education and KNEC channels release results.',
    link: ['#/s4', 'Read how to spot fake messages']
  },
  {
    keys: ['scheme', 'template', 'lesson plan', 'record', 'download', 'word', 'doc'],
    reply: 'Our library has free, editable Word templates for every grade, subject and term from PP1 to Grade 12.',
    link: ['#library', 'Open the library']
  },
  {
    keys: ['grade 10', 'pathway', 'stem', 'placement', 'senior', 'social sciences'],
    reply: 'Grade 10 senior school pathways are STEM, Social Sciences, and Arts and Sports. Confirm placement details with the Ministry or your school.',
    link: ['#parents', 'Open the Parents’ hub']
  },
  {
    keys: ['kuccps', 'cluster', 'university', 'college', 'points'],
    reply: 'You can estimate cluster points in Tools. KUCCPS sets the exact cut-offs, so confirm on the official KUCCPS site.',
    link: ['#tools', 'Open Tools']
  },
  {
    keys: ['tutor', 'maths', 'practice', 'quiz', 'learn', 'ai'],
    reply: 'Practise maths and take quizzes in Tutoring and Games, or use our dedicated AI Tutor for CBC & 8-4-4 syllabus questions.',
    link: ['/tutor', 'Open AI Tutor']
  },
  {
    keys: ['job', 'teach', 'vacancy', 'post', 'apply'],
    reply: 'Education vacancies are listed in Education Jobs. Genuine employers never charge application fees.',
    link: ['#jobs', 'Open Education Jobs']
  }
];

export function getAskMwalimuReply(query: string) {
  const q = query.toLowerCase();
  let best = null;
  let maxMatches = 0;

  for (const entry of ASK_MWALIMU_KB) {
    const matches = entry.keys.filter(k => q.includes(k)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      best = entry;
    }
  }

  if (best) return best;

  return {
    reply: 'Mwalimu Family offers free Kenyan curriculum schemes, exam timelines, and revision tools. What specific grade or subject can I help you with?',
    link: ['#library', 'Explore the Library']
  };
}
