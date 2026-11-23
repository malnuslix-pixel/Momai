// ==============================================================================
// MWALIMU FAMILY - CORE DATA, SYLLABUS, INTERACTIVE DATA & UTILITIES
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
    x: ['/notices', 'KJSEA countdown and Grade 10 checklist']
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
    x: ['/notices', 'KJSEA countdown and Grade 10 checklist']
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
    x: ['/parents', 'Open the Parents’ hub']
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
    x: ['/exams', 'Open the Exams hub']
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
  ['Scheme of Work', 'scheme'],
  ['Lesson Plan', 'lesson'],
  ['Lesson Notes', 'notes'],
  ['Exam Paper', 'exam'],
  ['Assessment Rubric', 'rubric'],
  ['Record of Work', 'record']
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

// ==============================================================================
// 8 SELF-PACED COURSES WITH COMPLETE LESSON CONTENT
// ==============================================================================

export interface Course {
  id: string;
  title: string;
  category: 'Digital' | 'Study' | 'Life' | 'Career' | 'Language' | 'Teaching';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  kenyaContext: string;
  lessons: { title: string; content: string }[];
}

export const COURSES: Course[] = [
  {
    id: 'digital-basics',
    title: 'Digital basics',
    category: 'Digital',
    level: 'Beginner',
    duration: 'About 2 hours',
    description: 'Use computers and phones with confidence and stay safe online.',
    kenyaContext: 'Use M-Pesa and eCitizen safely, and watch for fake paybill and prize messages.',
    lessons: [
      {
        title: 'Parts of a computer and a phone',
        content: 'A computer has input (keyboard, mouse, touchscreen), a processor, memory, storage and output (screen, speakers). A phone is a small computer. Practise naming each part on a device you use.'
      },
      {
        title: 'Typing and keyboard shortcuts',
        content: 'Use all ten fingers and keep your eyes on the screen. Learn Ctrl+C (copy), Ctrl+V (paste), Ctrl+Z (undo) and Ctrl+S (save). Practise ten minutes a day.'
      },
      {
        title: 'Word processing basics',
        content: 'Type, select text, change font size, make lists and save a file. Use headings to organise longer work and save with a clear file name.'
      },
      {
        title: 'Spreadsheet basics: rows, columns and sums',
        content: 'A spreadsheet is a grid of rows and columns, and each box is a cell. Try =SUM(A1:A5) to add numbers. Use it for budgets and marks.'
      },
      {
        title: 'Passwords, scams and online safety',
        content: 'Use long, different passwords and never share codes sent to your phone. Be careful with links from unknown senders. Real organisations never ask you to pay to claim a prize.'
      }
    ]
  },
  {
    id: 'study-skills',
    title: 'Study skills',
    category: 'Study',
    level: 'Beginner',
    duration: 'About 1.5 hours',
    description: 'Build habits that make revision and exams easier.',
    kenyaContext: 'Plan around the Kenyan school calendar and your exam timetable, and practise with past papers from your teacher.',
    lessons: [
      {
        title: 'Setting goals',
        content: 'Write one specific, measurable goal for the term, such as raising a Mathematics mark by 10 points. Break it into weekly steps.'
      },
      {
        title: 'Planning revision (try our timetable maker in Tools)',
        content: 'List your subjects, give harder ones more time and plan 25 to 40 minute sessions with breaks. Include rest and meals.'
      },
      {
        title: 'Note-taking methods',
        content: 'Try headings with bullet points, mind maps or question-and-answer cards. Review notes within a day to remember more.'
      },
      {
        title: 'Memory techniques',
        content: 'Test yourself instead of only rereading. Spread revision over several days and link new facts to things you already know.'
      },
      {
        title: 'Exam-day habits',
        content: 'Sleep well, eat before the exam, read instructions carefully, plan your time per question and check your answers if time remains.'
      }
    ]
  },
  {
    id: 'money-skills',
    title: 'Money skills',
    category: 'Life',
    level: 'Beginner',
    duration: 'About 1.5 hours',
    description: 'Understand saving, budgeting and mobile money.',
    kenyaContext: 'Compare mobile money fees, plan for school fees each term and consider saving through a chama or SACCO.',
    lessons: [
      {
        title: 'Needs and wants',
        content: 'Needs are things you must have, such as food and school supplies. Wants are nice to have. List both before you spend.'
      },
      {
        title: 'Saving and budgeting',
        content: 'Write down income and spending for the month. Set aside savings first, even a small amount, then budget the rest.'
      },
      {
        title: 'Mobile money safety',
        content: 'Check the name and amount before you send money. Never share your PIN. Be careful of messages claiming a mistaken transfer.'
      },
      {
        title: 'Borrowing basics',
        content: 'Before borrowing, ask the total you will repay and the due date. Avoid borrowing for wants.'
      },
      {
        title: 'Planning for school fees',
        content: 'List fees, uniform, books and transport for each term. Divide the total by the weeks left to see how much to save each week.'
      }
    ]
  },
  {
    id: 'communication-skills',
    title: 'Communication skills',
    category: 'Life',
    level: 'Beginner',
    duration: 'About 1.5 hours',
    description: 'Speak, write and listen clearly.',
    kenyaContext: 'Practise switching between English, Kiswahili and Sheng to suit your audience.',
    lessons: [
      {
        title: 'Speaking clearly',
        content: 'Speak at a steady pace, look at your listener and use simple words. Pause between ideas so people can follow.'
      },
      {
        title: 'Writing a good message or email',
        content: 'Start with a clear greeting or subject line, state your purpose in the first sentence, keep paragraphs short and end with what you need.'
      },
      {
        title: 'Active listening',
        content: 'Give your full attention, do not interrupt, and repeat back what you heard to check you understood.'
      },
      {
        title: 'Public speaking',
        content: 'Plan three main points, practise aloud and use a short opening and closing. Breathe slowly if you feel nervous.'
      },
      {
        title: 'Working in a team',
        content: 'Agree roles, share tasks fairly, listen to every idea and give kind, specific feedback.'
      }
    ]
  },
  {
    id: 'career-readiness',
    title: 'Career readiness',
    category: 'Career',
    level: 'Intermediate',
    duration: 'About 2 hours',
    description: 'Explore careers and prepare to apply.',
    kenyaContext: 'Explore KUCCPS programmes, TVET institutions and the certificates employers ask for.',
    lessons: [
      {
        title: 'Exploring careers and pathways (see Pathway starter in Tools)',
        content: 'List what you enjoy and what you are good at, then match them to careers. Talk to people who do the jobs that interest you.'
      },
      {
        title: 'Writing a CV',
        content: 'Include contact details, education, skills, experience and referees. Keep it to one or two pages with a clear layout.'
      },
      {
        title: 'Writing a cover letter',
        content: 'Write three short paragraphs: why you are applying, what you offer and how to reach you. Address it to a named person where possible.'
      },
      {
        title: 'Interview practice',
        content: 'Research the employer, prepare examples of your strengths, practise answers aloud and prepare two questions to ask.'
      },
      {
        title: 'Learning options after school: college, TVET and work',
        content: 'Compare colleges, TVET institutions, apprenticeships and work. Check entry requirements and costs with the official institution.'
      }
    ]
  },
  {
    id: 'english-kiswahili',
    title: 'English and Kiswahili practice',
    category: 'Language',
    level: 'Beginner',
    duration: 'About 2 hours',
    description: 'Practise everyday language in both languages.',
    kenyaContext: 'Practise with methali, nahau and everyday market and matatu conversations.',
    lessons: [
      {
        title: 'Everyday vocabulary',
        content: 'Learn ten new words each week in both English and Kiswahili and use each in a sentence you say aloud.'
      },
      {
        title: 'Building sentences',
        content: 'Build sentences with a subject, a verb and an object. Swap words to make new sentences.'
      },
      {
        title: 'Reading comprehension tips',
        content: 'Read the questions first, then the passage. Underline key words and answer in full sentences.'
      },
      {
        title: 'Writing short compositions (insha)',
        content: 'Plan a beginning, middle and end, use paragraphs and check spelling and punctuation. In insha, use methali and nahau where they fit.'
      },
      {
        title: 'Speaking practice',
        content: 'Talk for two minutes on a familiar topic each day. Record yourself and listen for ways to improve.'
      }
    ]
  },
  {
    id: 'coding-first-steps',
    title: 'Coding first steps',
    category: 'Digital',
    level: 'Intermediate',
    duration: 'About 3 hours',
    description: 'Learn the ideas behind programming.',
    kenyaContext: 'Build something local, such as a matatu fare calculator or a school marks tracker.',
    lessons: [
      {
        title: 'What is a program?',
        content: 'A program is a list of clear instructions a computer follows. Practise by writing the steps for making tea.'
      },
      {
        title: 'Variables',
        content: 'A variable stores a value under a name, such as score = 0. You can change it as the program runs.'
      },
      {
        title: 'Decisions with if',
        content: 'An if statement lets a program choose: if the score is above 50, show Pass, otherwise show Try again.'
      },
      {
        title: 'Loops',
        content: 'A loop repeats steps. Use it to count to ten or print a times table without writing every line.'
      },
      {
        title: 'Build a tiny project',
        content: 'Combine variables, decisions and loops to make a quiz or a simple calculator. Start small and improve it step by step.'
      }
    ]
  },
  {
    id: 'teacher-skills',
    title: 'Teacher skills',
    category: 'Teaching',
    level: 'Intermediate',
    duration: 'About 2.5 hours',
    description: 'Plan, assess and manage learning in a CBE classroom.',
    kenyaContext: 'Link examples to learners’ homes: markets, farms, local leaders and community projects.',
    lessons: [
      {
        title: 'Lesson planning basics (use our templates in the Library)',
        content: 'State the learning outcome, plan an introduction, activities and a conclusion, and list resources and how you will assess learning.'
      },
      {
        title: 'Assessment in CBE',
        content: 'Use varied methods such as observation, oral questions, projects and portfolios. Give feedback learners can act on.'
      },
      {
        title: 'Classroom management',
        content: 'Set routines early, praise effort, keep instructions short and address problems calmly and privately.'
      },
      {
        title: 'Keeping records',
        content: 'Keep your record of work, learner progress and assessment evidence up to date each week so reporting is easier.'
      },
      {
        title: 'Writing report-form comments (use the Tools generator)',
        content: 'Describe what the learner can do, give one strength and one next step, and keep the tone encouraging and specific.'
      }
    ]
  }
];

// ==============================================================================
// 15-TERM OFFICIAL KENYA EDUCATION GLOSSARY
// ==============================================================================

export const GLOSSARY: [string, string][] = [
  ['CBE', 'Competency-Based Education: a curriculum that focuses on what learners can do, not only what they remember.'],
  ['KICD', 'Kenya Institute of Curriculum Development, which designs the national curriculum.'],
  ['KNEC', 'Kenya National Examinations Council, which sets and marks national assessments.'],
  ['KPSEA', 'Kenya Primary School Education Assessment, taken at the end of Grade 6.'],
  ['KJSEA', 'Kenya Junior School Education Assessment, taken at the end of Grade 9.'],
  ['KCSE', 'Kenya Certificate of Secondary Education, taken at the end of secondary school.'],
  ['KUCCPS', 'Kenya Universities and Colleges Central Placement Service, which places students in universities and colleges.'],
  ['HELB', 'Higher Education Loans Board, which offers student loans and bursaries.'],
  ['NEMIS', 'National Education Management Information System, the Ministry’s learner and school records system.'],
  ['UPI', 'Unique Personal Identifier given to each learner in NEMIS.'],
  ['Capitation', 'Government funds paid to public schools for each enrolled learner.'],
  ['TVET', 'Technical and Vocational Education and Training, offered in technical colleges and institutes.'],
  ['Pathway', 'A group of senior school subjects: STEM, Social Sciences, or Arts and Sports.'],
  ['CSL', 'Community Service Learning, a senior school learning area that links classroom learning to community projects.'],
  ['Scheme of work', 'A teacher’s term plan showing what will be taught each week.']
];

// ==============================================================================
// QUIZ QUESTION BANKS (8 Questions Each)
// ==============================================================================

export interface QuizQuestion {
  q: string;
  opts: string[];
  ans: number;
}

export const QUIZZES_FULL: Record<'m' | 's' | 'k', QuizQuestion[]> = {
  m: [
    { q: 'What is 7 × 8?', opts: ['54', '56', '64'], ans: 1 },
    { q: 'Convert 3/4 to a decimal?', opts: ['0.75', '0.34', '0.7'], ans: 0 },
    { q: 'Perimeter of a square with side 5 cm?', opts: ['10 cm', '20 cm', '25 cm'], ans: 1 },
    { q: 'What is 15% of 200?', opts: ['20', '30', '15'], ans: 1 },
    { q: 'Solve: 2x + 6 = 14. x = ?', opts: ['4', '8', '10'], ans: 0 },
    { q: 'Area of a rectangle 8 cm by 5 cm?', opts: ['26 cm²', '40 cm²', '13 cm²'], ans: 1 },
    { q: 'Next prime number after 7?', opts: ['9', '11', '13'], ans: 1 },
    { q: 'What is 1/2 + 1/4?', opts: ['3/4', '2/6', '1/8'], ans: 0 }
  ],
  s: [
    { q: 'Which gas do green plants absorb for photosynthesis?', opts: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], ans: 1 },
    { q: 'What is the chemical formula of pure water?', opts: ['H₂O', 'CO₂', 'NaCl'], ans: 0 },
    { q: 'Which vital organ pumps blood throughout the body?', opts: ['Lungs', 'Liver', 'Heart'], ans: 2 },
    { q: 'Boiling point of pure water at sea level?', opts: ['90 °C', '100 °C', '120 °C'], ans: 1 },
    { q: 'Water vapour turning into liquid is called?', opts: ['Evaporation', 'Condensation', 'Melting'], ans: 1 },
    { q: 'Which of the following is a mammal?', opts: ['Shark', 'Bat', 'Frog'], ans: 1 },
    { q: 'The force that pulls falling objects toward Earth is?', opts: ['Friction', 'Gravity', 'Magnetism'], ans: 1 },
    { q: 'What is the SI unit of force?', opts: ['Joule', 'Newton', 'Watt'], ans: 1 }
  ],
  k: [
    { q: 'What is the English meaning of "Mwalimu"?', opts: ['Doctor', 'Teacher', 'Farmer'], ans: 1 },
    { q: 'Wingi wa neno "Kitabu"?', opts: ['Vitabu', 'Kitabus', 'Mitabu'], ans: 0 },
    { q: 'Kinyume cha neno "Kubwa"?', opts: ['Refu', 'Ndogo', 'Pana'], ans: 1 },
    { q: 'What is the English meaning of "Maji"?', opts: ['Fire', 'Water', 'Wind'], ans: 1 },
    { q: 'Kinyume cha neno "Mrefu"?', opts: ['Mfupi', 'Mpana', 'Mzito'], ans: 0 },
    { q: 'Maana ya neno "Shule" kwa Kiingereza?', opts: ['School', 'Market', 'Church'], ans: 0 },
    { q: 'Wingi wa neno "Mtoto"?', opts: ['Watoto', 'Vitoto', 'Mitoto'], ans: 0 },
    { q: 'Kuna siku ngapi katika juma moja?', opts: ['Sita', 'Saba', 'Nane'], ans: 1 }
  ]
};

// ==============================================================================
// GAMES DATA: MEMORY MATCH & WORD SCRAMBLE
// ==============================================================================

export const MEMORY_MATCH_PAIRS: [string, string][] = [
  ['Mwalimu', 'Teacher'],
  ['Kitabu', 'Book'],
  ['Shule', 'School'],
  ['Maji', 'Water'],
  ['Rafiki', 'Friend'],
  ['Nyumba', 'House'],
  ['Mtoto', 'Child'],
  ['Kalamu', 'Pen']
];

export const WORD_SCRAMBLE_WORDS = [
  { word: 'MWALIMU', hint: 'Kiswahili for teacher and educator' },
  { word: 'CURRICULUM', hint: 'The national programme of study (KICD)' },
  { word: 'EXAMINATION', hint: 'KNEC national assessment test' },
  { word: 'SCHEME', hint: 'A teacher’s term plan of work' },
  { word: 'PATHWAY', hint: 'Senior School subject grouping (STEM, Social, Arts)' },
  { word: 'BASKETBALL', hint: 'A popular school co-curricular sport' },
  { word: 'CHEMISTRY', hint: 'Study of matter, elements and reactions' },
  { word: 'COMPETENCY', hint: 'Ability to apply knowledge and skill effectively' }
];

// ==============================================================================
// 7 CORE TEACHING TEMPLATES DEFINITIONS
// ==============================================================================

export interface TeachingTemplate {
  category: 'Schemes' | 'Lesson notes' | 'Exams' | 'Records';
  title: string;
  typeId: 'scheme' | 'lesson' | 'notes' | 'exam' | 'rubric' | 'record' | 'tpad';
  targetGrades: string;
  filename: string;
}

export const TEACHING_TEMPLATES: TeachingTemplate[] = [
  { category: 'Exams', title: 'End-term exam paper with marking scheme', typeId: 'exam', targetGrades: 'All grades', filename: 'End-term_Exam_Paper' },
  { category: 'Exams', title: 'Competency assessment rubric', typeId: 'rubric', targetGrades: 'All grades', filename: 'Competency_Assessment_Rubric' },
  { category: 'Schemes', title: 'Scheme of work template (editable)', typeId: 'scheme', targetGrades: 'PP1 to Grade 12', filename: 'Scheme_of_Work_Template' },
  { category: 'Lesson notes', title: 'Lesson plan template', typeId: 'lesson', targetGrades: 'All grades', filename: 'Lesson_Plan_Template' },
  { category: 'Lesson notes', title: 'Lesson notes template', typeId: 'notes', targetGrades: 'All grades', filename: 'Lesson_Notes_Template' },
  { category: 'Records', title: 'Record of work covered', typeId: 'record', targetGrades: 'All grades', filename: 'Record_of_Work_Covered' },
  { category: 'Records', title: 'Appraisal evidence log (TPAD format)', typeId: 'tpad', targetGrades: 'Teachers', filename: 'TPAD_Appraisal_Evidence_Log' }
];

// ==============================================================================
// DOWNLOADABLE WORD (.DOC) GENERATORS FOR ALL TEMPLATES & TOOLS
// ==============================================================================

function generateDocFile(filename: string, htmlBody: string) {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${filename}</title>
    <style>
      body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111; line-height: 1.5; }
      h2 { color: #1a3d1b; font-size: 16pt; margin-bottom: 4px; }
      h3 { color: #2c5f2d; font-size: 13pt; margin-top: 12px; }
      h4 { color: #333; font-size: 11pt; margin-top: 8px; }
      table { border-collapse: collapse; width: 100%; margin-top: 8px; margin-bottom: 12px; font-size: 10pt; }
      th, td { border: 1px solid #444; padding: 6px 8px; text-align: left; }
      th { background-color: #f0f4f0; color: #1a3d1b; font-weight: bold; }
      p { margin: 4px 0; }
    </style>
    </head>
    <body>
      <div style="border-bottom: 2px solid #2c5f2d; padding-bottom: 6px; margin-bottom: 12px;">
        <span style="font-size: 14pt; font-weight: bold; color: #2c5f2d;">MWALIMU FAMILY</span>
        <span style="float: right; color: #666; font-size: 9pt;">Kenya Education Learning Hub · mwalimufamily.co.ke</span>
      </div>
      ${htmlBody}
      <br/><br/>
      <div style="border-top: 1px solid #ccc; padding-top: 6px; font-size: 9pt; color: #777;">
        Generated via Mwalimu Family Teaching Desk. KICD Competency Based Curriculum (CBC) Aligned.
      </div>
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

export function downloadWordDocument(filename: string, title: string, grade: string, subject: string, term: string, type: string) {
  const tableHeader = ['Week', 'Lesson', 'Strand', 'Sub-strand', 'Specific learning outcomes', 'Learning experiences', 'Key inquiry question(s)', 'Learning resources', 'Assessment', 'Reflection'];
  let rowsHtml = '';
  for (let i = 1; i <= 13; i++) {
    rowsHtml += `<tr>
      <td style="text-align:center;">${i}</td>
      <td style="text-align:center;">1-5</td>
      <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
    </tr>`;
  }

  const html = `
    <h2>${title.toUpperCase()}</h2>
    <p><b>School:</b> _________________________ &nbsp;&nbsp;&nbsp; <b>Teacher:</b> _________________________</p>
    <p><b>Grade / Class:</b> ${grade} &nbsp;&nbsp;&nbsp; <b>Subject:</b> ${subject} &nbsp;&nbsp;&nbsp; <b>Term:</b> ${term} &nbsp;&nbsp;&nbsp; <b>Year:</b> 2026</p>
    <br/>
    <table>
      <thead><tr>${tableHeader.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
  `;

  generateDocFile(filename, html);
}

export function downloadTemplateByType(typeId: string, filename: string) {
  let body = '';
  const headerInfo = `<p><b>School:</b> _________________________ &nbsp;&nbsp; <b>Teacher:</b> _________________________</p><p><b>Year:</b> 2026 &nbsp;&nbsp; <b>Term:</b> Term 1 &nbsp;&nbsp; <b>Grade:</b> Grade 7 &nbsp;&nbsp; <b>Subject:</b> ________________</p><br/>`;

  if (typeId === 'scheme') {
    const tableHeader = ['Week', 'Lesson', 'Strand', 'Sub-strand', 'Specific learning outcomes', 'Learning experiences', 'Key inquiry question(s)', 'Learning resources', 'Assessment', 'Reflection'];
    let rowsHtml = '';
    for (let i = 1; i <= 13; i++) {
      rowsHtml += `<tr><td style="text-align:center;">${i}</td><td style="text-align:center;">1-5</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`;
    }
    body = `<h2>SCHEME OF WORK</h2>${headerInfo}<table><thead><tr>${tableHeader.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  } else if (typeId === 'lesson') {
    body = `
      <h2>LESSON PLAN</h2>
      ${headerInfo}
      <p><b>Date:</b> ______________ &nbsp;&nbsp; <b>Time:</b> ______________ &nbsp;&nbsp; <b>Roll:</b> Boys: ____ Girls: ____ Total: ____</p>
      <h4>1. Strand / Sub-strand:</h4><p>____________________________________________________________________</p>
      <h4>2. Specific Learning Outcomes:</h4><p>By the end of the lesson, the learner should be able to:<br/>a) ____________________________________________________________________<br/>b) ____________________________________________________________________</p>
      <h4>3. Key Inquiry Question(s):</h4><p>____________________________________________________________________</p>
      <h4>4. Core Competencies & Values:</h4><p>Competencies: ________________________ &nbsp;&nbsp; Values: ________________________</p>
      <h4>5. Learning Resources & Digital Aids:</h4><p>____________________________________________________________________</p>
      <h4>6. Lesson Development:</h4>
      <table>
        <thead><tr><th style="width:15%;">Step / Time</th><th style="width:40%;">Teacher Activity</th><th style="width:35%;">Learner Activity</th><th style="width:10%;">Assessment</th></tr></thead>
        <tbody>
          <tr><td>Introduction (5 min)</td><td>Hook learners, review previous concept</td><td>Engage in prompt / inquiry</td><td>Oral check</td></tr>
          <tr><td>Development (30 min)</td><td>Guided inquiry, demonstration, task assignment</td><td>Group work, experimentation, practice</td><td>Observation</td></tr>
          <tr><td>Conclusion (5 min)</td><td>Review key takeaways, set extension task</td><td>Summarise main points, self-assess</td><td>Reflection</td></tr>
        </tbody>
      </table>
      <h4>7. Extended Activity:</h4><p>____________________________________________________________________</p>
      <h4>8. Teacher's Self-Reflection:</h4><p>____________________________________________________________________</p>
    `;
  } else if (typeId === 'notes') {
    body = `
      <h2>LESSON NOTES & STUDY GUIDE</h2>
      ${headerInfo}
      <h4>Strand / Main Topic:</h4><p>____________________________________________________________________</p>
      <h4>Key Learning Outcomes:</h4><p>____________________________________________________________________</p>
      <h4>Key Terms & Glossary:</h4><p>1. ____________________________________________________________________<br/>2. ____________________________________________________________________</p>
      <h4>Main Summary Notes:</h4><p>____________________________________________________________________________________________________________________________________________________________________</p>
      <h4>Worked Classroom Examples:</h4><p>____________________________________________________________________________________________________________________________________________________________________</p>
      <h4>Learner Practice Activity:</h4><p>____________________________________________________________________________________________________________________________________________________________________</p>
      <h4>Revision Questions:</h4><p>1. ____________________________________________________________________<br/>2. ____________________________________________________________________</p>
    `;
  } else if (typeId === 'exam') {
    body = `
      <h2>END-TERM EXAMINATION & MARKING SCHEME</h2>
      <p><b>Name:</b> ____________________________________ &nbsp;&nbsp; <b>Adm No:</b> _________ &nbsp;&nbsp; <b>Class:</b> ________</p>
      <p><b>Time Allowed:</b> 2 Hours &nbsp;&nbsp; <b>Total Marks:</b> 100 Marks</p>
      <h3>SECTION A: SHORT ANSWER QUESTIONS (40 MARKS)</h3>
      <table>
        <thead><tr><th style="width:10%;">No.</th><th style="width:75%;">Question</th><th style="width:15%;">Marks</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>State two characteristics of living things.</td><td>(4 marks)</td></tr>
          <tr><td>2</td><td>Explain the role of photosynthesis in green plants.</td><td>(6 marks)</td></tr>
          <tr><td>3</td><td>Convert 45% into a decimal and a fraction in its simplest form.</td><td>(5 marks)</td></tr>
          <tr><td>4</td><td>Identify three core national values outlined in the Kenya Constitution.</td><td>(6 marks)</td></tr>
        </tbody>
      </table>
      <h3>SECTION B: STRUCTURED QUESTIONS (60 MARKS)</h3>
      <table>
        <thead><tr><th style="width:10%;">No.</th><th style="width:75%;">Question Description</th><th style="width:15%;">Marks</th></tr></thead>
        <tbody>
          <tr><td>5</td><td>Detailed application problem / case study question.</td><td>(20 marks)</td></tr>
          <tr><td>6</td><td>Experiment analysis, data interpretation and conclusions.</td><td>(20 marks)</td></tr>
          <tr><td>7</td><td>Extended essay / practical calculation task.</td><td>(20 marks)</td></tr>
        </tbody>
      </table>
      <br/>
      <h2>OFFICIAL MARKING SCHEME & RUBRIC</h2>
      <table>
        <thead><tr><th style="width:10%;">No.</th><th style="width:75%;">Expected Answer & Marking Points</th><th style="width:15%;">Marks Awarded</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>Award 2 marks for each correct characteristic clearly described.</td><td>4 marks</td></tr>
          <tr><td>2</td><td>Definition of photosynthesis (2 marks), light and carbon intake (2 marks), food/oxygen production (2 marks).</td><td>6 marks</td></tr>
          <tr><td>3</td><td>Decimal: 0.45 (2 marks); Fraction: 45/100 = 9/20 (3 marks).</td><td>5 marks</td></tr>
        </tbody>
      </table>
    `;
  } else if (typeId === 'rubric') {
    body = `
      <h2>COMPETENCY ASSESSMENT RUBRIC</h2>
      ${headerInfo}
      <p><b>Assessment Task:</b> Group Project / Practical Performance Assessment</p>
      <table>
        <thead>
          <tr>
            <th style="width:20%;">Sub-strand / Skill</th>
            <th style="width:20%;">Exceeds (Level 4)</th>
            <th style="width:20%;">Meets (Level 3)</th>
            <th style="width:20%;">Approaches (Level 2)</th>
            <th style="width:20%;">Below (Level 1)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Content Mastery</td><td>Demonstrates comprehensive insight and applies concepts creatively.</td><td>Shows clear understanding of expected outcomes.</td><td>Recalls basic concepts with occasional prompts.</td><td>Requires significant remedial assistance.</td></tr>
          <tr><td>Communication</td><td>Articulates ideas persuasively and with clarity.</td><td>Communicates findings accurately and coherently.</td><td>Expresses ideas partially; needs clarification.</td><td>Struggles to convey basic findings.</td></tr>
          <tr><td>Collaboration</td><td>Exemplary team leader; supports group members.</td><td>Active participant; contributes reliably.</td><td>Cooperates intermittently when directed.</td><td>Passive; does not contribute effectively.</td></tr>
          <tr><td>Problem Solving</td><td>Deploys innovative approaches to resolve issues.</td><td>Resolves core problems using taught methods.</td><td>Follows standard procedures with guidance.</td><td>Unable to apply problem-solving steps.</td></tr>
        </tbody>
      </table>
    `;
  } else if (typeId === 'record') {
    body = `
      <h2>RECORD OF WORK COVERED</h2>
      ${headerInfo}
      <table>
        <thead><tr><th style="width:8%;">Week</th><th style="width:12%;">Date</th><th style="width:25%;">Strand & Sub-strand</th><th style="width:35%;">Work Covered / Lessons Taught</th><th style="width:20%;">Teacher Reflection / Remarks</th></tr></thead>
        <tbody>
          ${Array.from({ length: 13 }, (_, i) => `<tr><td style="text-align:center;">${i + 1}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`).join('')}
        </tbody>
      </table>
    `;
  } else if (typeId === 'tpad') {
    body = `
      <h2>TEACHER APPRAISAL EVIDENCE LOG (TPAD)</h2>
      <p><b>Teacher Name:</b> _________________________ &nbsp;&nbsp; <b>TSC No:</b> ______________ &nbsp;&nbsp; <b>School:</b> _________________________</p>
      <p><i>Reference tool for internal documentation prior to submission on TSC portal.</i></p>
      <table>
        <thead><tr><th style="width:25%;">Teaching Standard</th><th style="width:35%;">Key Evidence / Artifacts</th><th style="width:15%;">Target</th><th style="width:10%;">Self-Rating</th><th style="width:15%;">Supervisor Remarks</th></tr></thead>
        <tbody>
          <tr><td>1. Professional Knowledge and Application</td><td>Schemes of work, lesson plans, learner assessment logs.</td><td>100% compliant</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>2. Comprehensive Learning Environment</td><td>Class attendance registers, discipline records, safety checks.</td><td>Safe & inclusive</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>3. Teacher Professional Development</td><td>Workshops attended, peer mentorship logs, online certifications.</td><td>Continuous CPD</td><td>&nbsp;</td><td>&nbsp;</td></tr>
          <tr><td>4. Collaboration with Parents and Community</td><td>PTA meeting records, academic progress consultative notes.</td><td>Termly updates</td><td>&nbsp;</td><td>&nbsp;</td></tr>
        </tbody>
      </table>
    `;
  }

  generateDocFile(filename, body);
}

// Download timetable as Word
export function downloadTimetableDoc(classes: { className: string; rows: any[] }[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  let tablesHtml = '';

  classes.forEach(c => {
    tablesHtml += `<h3>Class: ${c.className}</h3><table><thead><tr><th>Period</th>${days.map(d => `<th>${d}</th>`).join('')}</tr></thead><tbody>`;
    c.rows.forEach(r => {
      if (r.isBreak) {
        tablesHtml += `<tr><th colspan="6" style="background:#f4a261;color:#111;text-align:center;">Break</th></tr>`;
      } else if (r.isLunch) {
        tablesHtml += `<tr><th colspan="6" style="background:#f4a261;color:#111;text-align:center;">Lunch</th></tr>`;
      } else {
        tablesHtml += `<tr><td style="text-align:center;font-weight:bold;">${r.period}</td>${r.daySubs.map((s: string) => `<td>${s}</td>`).join('')}</tr>`;
      }
    });
    tablesHtml += `</tbody></table><br/>`;
  });

  generateDocFile('Class_Timetable_Schedule', `<h2>CLASS TIMETABLE SCHEDULE</h2><p>Mwalimu Family Timetable Planner · 2026</p><br/>${tablesHtml}`);
}

// Download rubric as Word
export function downloadCustomRubricDoc(task: string, criteriaStr: string) {
  const criteria = criteriaStr.split(',').map(c => c.trim()).filter(Boolean);
  const rows = criteria.map(c => `
    <tr>
      <td style="font-weight:bold;">${c}</td>
      <td>Exemplary proficiency and creativity in ${c.toLowerCase()}.</td>
      <td>Meets required grade-level standards in ${c.toLowerCase()}.</td>
      <td>Partial mastery of ${c.toLowerCase()}; needs targeted practice.</td>
      <td>Minimal demonstration of ${c.toLowerCase()}; requires guided intervention.</td>
    </tr>
  `).join('');

  const html = `
    <h2>COMPETENCY ASSESSMENT RUBRIC</h2>
    <p><b>Assessment Task:</b> ${task}</p>
    <p><b>Date:</b> ____________________ &nbsp;&nbsp; <b>Evaluator:</b> ____________________</p>
    <br/>
    <table>
      <thead>
        <tr>
          <th>Criteria</th>
          <th>Exceeds Expectation (4)</th>
          <th>Meets Expectation (3)</th>
          <th>Approaches Expectation (2)</th>
          <th>Below Expectation (1)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  generateDocFile(`Rubric_${task.replace(/\s+/g, '_')}`, html);
}

// Download revision timetable as Word
export function downloadRevisionDoc(examDate: string, subjectsStr: string, slotsPerDay: number) {
  const subjects = subjectsStr.split(',').map(s => s.trim()).filter(Boolean);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  let k = 0;
  let rows = '';

  days.forEach(d => {
    let slots = '';
    for (let i = 0; i < slotsPerDay; i++) {
      const sub = subjects.length ? subjects[k++ % subjects.length] : 'Revision';
      slots += `<td>${sub}</td>`;
    }
    rows += `<tr><td style="font-weight:bold;">${d}</td>${slots}</tr>`;
  });

  const slotsHeaders = Array.from({ length: slotsPerDay }, (_, i) => `<th>Slot ${i + 1}</th>`).join('');

  const html = `
    <h2>WEEKLY REVISION TIMETABLE</h2>
    <p><b>Target Exam Date:</b> ${examDate || 'Upcoming Examination'}</p>
    <br/>
    <table>
      <thead><tr><th>Day</th>${slotsHeaders}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  generateDocFile('Weekly_Revision_Timetable', html);
}

// Download class ranking as Word
export function downloadClassMarksDoc(students: { name: string; marks: number[]; total: number; mean: number; rank: number }[]) {
  const rows = students.map(s => `
    <tr>
      <td style="text-align:center;font-weight:bold;">${s.rank}</td>
      <td>${s.name}</td>
      <td style="text-align:center;">${s.total}</td>
      <td style="text-align:center;font-weight:bold;">${s.mean.toFixed(1)}%</td>
    </tr>
  `).join('');

  const classMean = students.length ? (students.reduce((a, b) => a + b.mean, 0) / students.length).toFixed(1) : '0';

  const html = `
    <h2>CLASS MARKS & RANKING REPORT</h2>
    <p><b>Total Learners Evaluated:</b> ${students.length} &nbsp;&nbsp;&nbsp; <b>Class Overall Mean:</b> ${classMean}%</p>
    <br/>
    <table>
      <thead><tr><th style="width:10%;">Rank</th><th style="width:50%;">Learner Name</th><th style="width:20%;">Total Score</th><th style="width:20%;">Mean %</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  generateDocFile('Class_Marks_and_Ranking', html);
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

// ==============================================================================
// FORM SUBMISSION HANDLER (API + WHATSAPP FALLBACK + LOCAL STORAGE TRACKER)
// ==============================================================================

export interface FormSubmissionRecord {
  ref: string;
  type: string;
  title: string;
  date: string;
  data?: Record<string, any>;
}

export async function submitOnlineForm(
  type: 'job' | 'ad' | 'find' | 'tut' | 'note',
  typeName: string,
  title: string,
  fields: [string, string][],
  consent: boolean
): Promise<{ ok: boolean; ref: string; whatsappUrl: string }> {
  // Generate Reference ID: e.g. JOB-261123-4521
  const prefixMap: Record<string, string> = { job: 'JOB', ad: 'ADV', find: 'TUT', tut: 'TTR', note: 'NTC' };
  const dateCode = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randNum = 1000 + Math.floor(Math.random() * 9000);
  const ref = `${prefixMap[type] || 'REQ'}-${dateCode}-${randNum}`;

  // Build WhatsApp text
  const waText = `*${typeName}* [${ref}]\n` + fields.map(([label, val]) => `${label}: ${val}`).join('\n');
  const whatsappUrl = `https://wa.me/254715363944?text=${encodeURIComponent(waText)}`;

  // Save to localStorage for 'My Activity' section
  try {
    const raw = localStorage.getItem('mfsub');
    const list: FormSubmissionRecord[] = raw ? JSON.parse(raw) : [];
    list.unshift({
      ref,
      type: typeName,
      title: title || typeName,
      date: new Date().toISOString().slice(0, 10),
      data: Object.fromEntries(fields)
    });
    localStorage.setItem('mfsub', JSON.stringify(list.slice(0, 50)));
  } catch {}

  // POST to Next.js API
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        ref,
        fields,
        consent
      })
    });
    if (res.ok) {
      return { ok: true, ref, whatsappUrl };
    }
  } catch (err) {
    console.warn('API submit network fallback:', err);
  }

  return { ok: true, ref, whatsappUrl };
}

// ---- Ask Mwalimu Knowledge Base Rules ----
export const ASK_MWALIMU_KB = [
  {
    keys: ['result', 'kjsea', 'kcse', 'kpsea', 'release', 'timeline', 'date'],
    reply: 'KJSEA results are expected in December 2026. KCSE and KPSEA are targeted for January 2027. These are targets, so watch official Ministry of Education and KNEC channels.',
    link: ['/exams', 'Open the Exams hub']
  },
  {
    keys: ['fake', 'scam', 'pay', 'early', 'suspicious', 'money'],
    reply: 'Never pay to see results early. Only official Ministry of Education and KNEC channels release results.',
    link: ['/help', 'Read how to spot fake messages and stay safe']
  },
  {
    keys: ['scheme', 'template', 'lesson plan', 'record', 'download', 'word', 'doc'],
    reply: 'Our library has free, editable Word templates for every grade, subject and term from PP1 to Form 4.',
    link: ['/learn', 'Open the library']
  },
  {
    keys: ['grade 10', 'pathway', 'stem', 'placement', 'senior', 'social sciences'],
    reply: 'Grade 10 senior school pathways are STEM, Social Sciences, and Arts and Sports. Confirm placement details with the Ministry or your school.',
    link: ['/parents', 'Open the Parents’ hub']
  },
  {
    keys: ['kuccps', 'cluster', 'university', 'college', 'points'],
    reply: 'You can estimate cluster points in Tools. KUCCPS sets the exact cut-offs, so confirm on the official KUCCPS site.',
    link: ['/tools', 'Open Tools']
  },
  {
    keys: ['tutor', 'maths', 'practice', 'quiz', 'learn', 'ai'],
    reply: 'Practise maths and take quizzes in Tutoring and Games, or use our dedicated AI Tutor for CBC & 8-4-4 syllabus questions.',
    link: ['/tutor', 'Open AI Tutor']
  },
  {
    keys: ['job', 'teach', 'vacancy', 'post', 'apply'],
    reply: 'Education vacancies are listed in Education Jobs. Genuine employers never charge application fees.',
    link: ['/jobs', 'Open Education Jobs']
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
    link: ['/learn', 'Explore the Library']
  };
}
