// ==============================================================================
// MWALIMU FAMILY - AI TUTOR ENGINE
// CBC-aligned educational AI with built-in Kenyan curriculum knowledge
// ==============================================================================

export interface TutorContext {
  subject?: string;
  grade?: string;
  mode: 'chat' | 'practice' | 'explain';
  history: { role: 'user' | 'assistant'; content: string }[];
}

const CBC_KNOWLEDGE: Record<string, Record<string, string[]>> = {
  Mathematics: {
    'Grade 7': [
      'Natural numbers up to 1,000,000 — place value, ordering, rounding',
      'Factors, multiples, HCF and LCM',
      'Integers — addition, subtraction on number line',
      'Fractions — proper, improper, mixed numbers, operations',
      'Decimals — place value, conversion, operations',
      'Percentage — simple percentage, percentage increase/decrease',
      'Ratio and proportion',
      'Algebraic expressions — forming and simplifying',
      'Linear equations in one unknown',
      'Geometry — angles, triangles, quadrilaterals',
      'Area and perimeter of rectangles, triangles, circles',
      'Data handling — mean, mode, median, bar graphs',
    ],
    'Grade 8': [
      'Indices and standard form',
      'Linear equations in two unknowns',
      'Inequalities',
      'Coordinates and graphs',
      'Scale drawing',
      'Pythagoras theorem',
      'Trigonometric ratios — sin, cos, tan',
      'Area and volume — prisms, cylinders',
      'Probability — experimental and theoretical',
      'Vectors — column vectors, magnitude',
    ],
    'Grade 9': [
      'Quadratic expressions and equations',
      'Formulae and variation',
      'Sequence and series',
      'Matrices — 2x2 operations',
      'Circle geometry — theorems',
      'Trigonometry — sine and cosine rules',
      'Statistics — cumulative frequency, quartiles',
      'Linear programming basics',
    ],
    'Form 3': [
      'Quadratic expressions and equations',
      'Formulae and variation — direct, inverse, joint',
      'Sequence and series — arithmetic and geometric',
      'Binomial expansion',
      'Matrices and transformations',
      'Loci',
    ],
    'Form 4': [
      'Differentiation',
      'Integration',
      'Statistics II — standard deviation, variance',
      'Probability II — combined events, tree diagrams',
      'Vectors II — position vectors, division of line',
      'Three-dimensional geometry',
    ],
  },
  'Integrated Science': {
    'Grade 7': [
      'Living things and their environment',
      'The human body — digestive system, respiratory system',
      'Matter — states, properties, changes',
      'Force and energy — types of forces, simple machines',
      'Mixtures and solutions — separation techniques',
    ],
    'Grade 8': [
      'Cell structure and function',
      'Human body systems — circulatory, nervous',
      'Chemical reactions — acids, bases, indicators',
      'Electricity — circuits, conductors, insulators',
      'Ecology — food chains, food webs, ecosystems',
      'Heat transfer — conduction, convection, radiation',
    ],
  },
  English: {
    'Grade 7': [
      'Comprehension — inference, main ideas, vocabulary in context',
      'Grammar — tenses (present, past, future), subject-verb agreement',
      'Writing — narrative essays, formal letters, diary entries',
      'Oral skills — pronunciation, intonation, public speaking',
      'Literature — short stories, oral narratives, proverbs',
    ],
    'Grade 8': [
      'Comprehension — summarizing, critical analysis',
      'Grammar — conditionals, reported speech, passive voice',
      'Writing — argumentative essays, book reviews, emails',
      'Vocabulary — word formation, idioms, phrasal verbs',
      'Set books — analysis, character study, themes',
    ],
  },
  Kiswahili: {
    'Grade 7': [
      'Ufahamu — kusoma na kuelewa maandishi',
      'Sarufi — ngeli za nomino, vitenzi, vivumishi',
      'Insha — insha za masimulizi, barua za kirafiki',
      'Fasihi — hadithi fupi, methali, vitendawili',
    ],
    'Grade 8': [
      'Ufahamu wa hali ya juu',
      'Sarufi — nyakati za vitenzi, sentensi changamano',
      'Insha — insha za mdahalo, barua rasmi',
      'Fasihi — riwaya, tamthilia',
    ],
  },
};

const PRACTICE_QUESTIONS: Record<string, any[]> = {
  'Mathematics-Grade 7': [
    { question: 'What is the LCM of 12 and 18?', options: ['24', '36', '54', '72'], correct_answer: '36', explanation: 'The multiples of 12 are: 12, 24, 36, 48... The multiples of 18 are: 18, 36, 54... The least common multiple is 36.' },
    { question: 'If 3x + 7 = 22, what is the value of x?', options: ['3', '4', '5', '6'], correct_answer: '5', explanation: '3x + 7 = 22 → 3x = 22 - 7 → 3x = 15 → x = 15 ÷ 3 = 5' },
    { question: 'What is 25% of 480?', options: ['96', '110', '120', '125'], correct_answer: '120', explanation: '25% of 480 = (25/100) × 480 = 0.25 × 480 = 120' },
    { question: 'The angles of a triangle add up to:', options: ['90°', '180°', '270°', '360°'], correct_answer: '180°', explanation: 'The sum of interior angles of any triangle is always 180 degrees.' },
    { question: 'What is the HCF of 24 and 36?', options: ['6', '8', '12', '24'], correct_answer: '12', explanation: 'Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. The highest common factor is 12.' },
    { question: 'Convert 3/4 to a percentage:', options: ['60%', '70%', '75%', '80%'], correct_answer: '75%', explanation: '3/4 × 100 = 75%' },
    { question: 'What is the area of a rectangle with length 12cm and width 5cm?', options: ['17 cm²', '34 cm²', '60 cm²', '120 cm²'], correct_answer: '60 cm²', explanation: 'Area = length × width = 12 × 5 = 60 cm²' },
  ],
  'Mathematics-Grade 8': [
    { question: 'Express 0.00056 in standard form:', options: ['5.6 × 10⁻⁴', '5.6 × 10⁻³', '56 × 10⁻⁵', '0.56 × 10⁻³'], correct_answer: '5.6 × 10⁻⁴', explanation: '0.00056 = 5.6 × 10⁻⁴ (move decimal 4 places right)' },
    { question: 'Find the hypotenuse of a right triangle with sides 3cm and 4cm:', options: ['5 cm', '6 cm', '7 cm', '8 cm'], correct_answer: '5 cm', explanation: 'c² = a² + b² = 3² + 4² = 9 + 16 = 25, so c = √25 = 5 cm' },
    { question: 'A bag has 3 red and 5 blue balls. P(red) = ?', options: ['3/8', '5/8', '3/5', '1/3'], correct_answer: '3/8', explanation: 'P(red) = number of red balls / total balls = 3/(3+5) = 3/8' },
    { question: 'Solve: 2x - 3 = x + 5', options: ['x = 2', 'x = 4', 'x = 8', 'x = 10'], correct_answer: 'x = 8', explanation: '2x - 3 = x + 5 → 2x - x = 5 + 3 → x = 8' },
  ],
  'Integrated Science-Grade 7': [
    { question: 'Which organ pumps blood around the body?', options: ['Lungs', 'Heart', 'Liver', 'Brain'], correct_answer: 'Heart', explanation: 'The heart is a muscular organ that pumps blood through the circulatory system to all parts of the body.' },
    { question: 'What is the process by which plants make food using sunlight?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Transpiration'], correct_answer: 'Photosynthesis', explanation: 'Photosynthesis is the process where plants use sunlight, water, and CO₂ to produce glucose and oxygen.' },
    { question: 'Which state of matter has a definite shape and volume?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], correct_answer: 'Solid', explanation: 'Solids have particles tightly packed, giving them both a definite shape and definite volume.' },
  ],
  'English-Grade 7': [
    { question: 'Choose the correct past tense: "She ___ to school yesterday."', options: ['go', 'goes', 'went', 'going'], correct_answer: 'went', explanation: '"Went" is the past tense of "go". We use past tense for completed past actions.' },
    { question: 'Which sentence has correct subject-verb agreement?', options: ['The students was happy.', 'The students were happy.', 'The students is happy.', 'The students am happy.'], correct_answer: 'The students were happy.', explanation: '"Students" is plural, so it takes the plural verb "were".' },
  ],
};

export function generatePracticeQuestion(subject: string, grade: string, _topic?: string) {
  const key = `${subject}-${grade}`;
  const pool = PRACTICE_QUESTIONS[key] || PRACTICE_QUESTIONS['Mathematics-Grade 7']!;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function buildTutorSystemPrompt(ctx: TutorContext): string {
  const topicsStr = ctx.subject && ctx.grade
    ? (CBC_KNOWLEDGE[ctx.subject]?.[ctx.grade] || []).join('; ')
    : '';

  return `You are "Mwalimu AI", a warm, encouraging Kenyan education tutor. You help students in the CBC (Competency-Based Curriculum) and 8-4-4 systems.

RULES:
1. Always be encouraging, patient, and positive. Use phrases like "Well done!", "Great thinking!", "Let's try together"
2. Explain concepts step-by-step, as simply as possible
3. Use Kenyan examples and context (KES for money, Kenyan geography, local references)
4. If asked about exam results, always direct to official KNEC/MoE channels. NEVER share personal data
5. For practice mode: generate a question, wait for the answer, then explain
6. For explain mode: break down the topic into digestible parts with examples
7. Keep responses concise but thorough — most students are on mobile phones
8. Use simple English. You may include common Kiswahili phrases for relatability
9. Never help with cheating on exams. Encourage honest study
10. If the topic is outside education, politely redirect to learning topics

${ctx.subject ? `SUBJECT: ${ctx.subject}` : ''}
${ctx.grade ? `GRADE LEVEL: ${ctx.grade}` : ''}
${topicsStr ? `KEY TOPICS FOR THIS LEVEL:\n${topicsStr}` : ''}

${ctx.mode === 'practice' ? 'MODE: Practice — Generate multiple-choice questions and check answers.' : ''}
${ctx.mode === 'explain' ? 'MODE: Explain — Break down concepts into simple steps with examples.' : ''}`;
}

export function getFallbackResponse(message: string, ctx: TutorContext): string {
  const msg = message.toLowerCase();

  if (msg.includes('results') || msg.includes('kcse') || msg.includes('kjsea') || msg.includes('kpsea')) {
    return "🎓 For official exam results, please visit the KNEC official portal at knec.ac.ke or use the KNEC SMS service. Never pay anyone claiming to give early results — that's a scam! For results interpretation help, I'm here to explain grading systems and what your scores mean. What would you like to know?";
  }

  if (msg.includes('practice') || msg.includes('quiz') || msg.includes('question')) {
    const q = generatePracticeQuestion(ctx.subject || 'Mathematics', ctx.grade || 'Grade 7');
    return `📝 Here's a practice question for you!\n\n**${q.question}**\n\nA) ${q.options[0]}\nB) ${q.options[1]}\nC) ${q.options[2]}\nD) ${q.options[3]}\n\nType your answer (A, B, C, or D) and I'll check it for you! 💪`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('habari')) {
    return "👋 Habari! Welcome to Mwalimu AI — your personal study buddy! I can help you with:\n\n📚 **Learn** — Explain any CBC topic step by step\n📝 **Practice** — Quiz questions with instant feedback\n🧮 **Calculate** — Help with math problems\n📊 **Advice** — KUCCPS courses, career guidance\n\nWhat subject would you like to study today?";
  }

  if (ctx.subject && ctx.grade) {
    const topics = CBC_KNOWLEDGE[ctx.subject]?.[ctx.grade];
    if (topics) {
      return `📚 Here are the key topics for **${ctx.subject}** at **${ctx.grade}** level:\n\n${topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nWhich topic would you like me to explain? Or type "practice" for quiz questions! 💡`;
    }
  }

  if (msg.includes('kuccps') || msg.includes('university') || msg.includes('course')) {
    return "🎓 For KUCCPS course selection:\n\n1. **Cluster points** are calculated from your 4 best subjects relevant to the course\n2. Each course has minimum subject requirements\n3. The portal opens mid-January for applications\n\nI can help you calculate cluster points or suggest courses based on your grades. What subjects did you score well in?";
  }

  return "🤔 That's a great question! I'm Mwalimu AI and I specialize in Kenyan education topics:\n\n• **Subjects**: Maths, Science, English, Kiswahili, and more\n• **Exams**: KCSE, KJSEA, KPSEA preparation\n• **Career**: KUCCPS courses, career guidance\n\nTry asking me to explain a topic, or type \"practice\" for quiz questions! What would you like to study? 📚";
}
