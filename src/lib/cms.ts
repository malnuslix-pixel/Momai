// ==============================================================================
// MWALIMU FAMILY - UNIFIED CMS SCHEMA & SEED DEFAULTS
// Controls frontend titles/branding, News, Courses, Learning, Teaching & Games
// ==============================================================================

import {
  ARTICLES,
  Article,
  COURSES,
  Course,
  GRADES,
  TERMS,
  RESOURCE_TYPES,
  TEACHING_TEMPLATES,
  TeachingTemplate,
  QUIZZES_FULL,
  QuizQuestion,
  MEMORY_MATCH_PAIRS,
  WORD_SCRAMBLE_WORDS,
} from './mwalimu-data';

export type CmsSectionKey =
  | 'roleChooser'
  | 'search'
  | 'news'
  | 'tutorSpotlight'
  | 'library'
  | 'teaching'
  | 'courses'
  | 'games'
  | 'exams'
  | 'tools'
  | 'notices'
  | 'parents'
  | 'jobs'
  | 'videos'
  | 'help'
  | 'tutoring';

export interface SiteSectionCopy {
  tag?: string;
  tagSw?: string;
  title: string;
  titleSw: string;
  subtitle: string;
  subtitleSw: string;
}

export interface HeroSceneCopy {
  title: string;
  titleSw: string;
  subtitle: string;
  subtitleSw: string;
  cta1Label: string;
  cta1LabelSw: string;
  cta1Href: string;
  cta2Label: string;
  cta2LabelSw: string;
  cta2Href: string;
}

export interface TickerItem {
  label: string;
  labelSw: string;
  href: string;
}

export interface SiteCopyConfig {
  brandName: string;
  footerTagline: string;
  footerCopy: string;
  tickerLabel: string;
  tickerLabelSw: string;
  tickerItems: TickerItem[];
  heroScenes: HeroSceneCopy[];
  sections: Record<CmsSectionKey, SiteSectionCopy>;
}

export interface LearningMaterial {
  id: string;
  title: string;
  grade: string;
  subject: string;
  term: string;
  type: string;
  summary: string;
  content: string;
  url?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface CmsLearningData {
  grades: string[];
  terms: string[];
  resourceTypes: [string, string][];
  materials: LearningMaterial[];
}

export interface CmsTeachingTemplate extends TeachingTemplate {
  id?: string;
  customBody?: string;
}

export interface CmsGamesData {
  quizzes: Record<'m' | 's' | 'k', QuizQuestion[]>;
  memoryPairs: [string, string][];
  wordScramble: { word: string; hint: string }[];
}

export interface CmsNewsData {
  featuredId: string;
  featuredStats: { value: string; label: string }[];
  articles: Article[];
}

export interface CmsData {
  siteCopy: SiteCopyConfig;
  news: CmsNewsData;
  courses: Course[];
  learning: CmsLearningData;
  teaching: CmsTeachingTemplate[];
  games: CmsGamesData;
  updatedAt?: string;
}

export const DEFAULT_SITE_COPY: SiteCopyConfig = {
  brandName: 'Mwalimu Family',
  footerTagline: 'News and learning resources for Kenyan families and teachers.',
  footerCopy: '© 2026 Mwalimu Family. Proudly serving Kenya’s 47 counties.',
  tickerLabel: 'Latest:',
  tickerLabelSw: 'Mapya:',
  tickerItems: [
    {
      label: '2026 KJSEA results expected in December, KCSE targeted for January 2027',
      labelSw: 'Matokeo ya KJSEA 2026 kutarajiwa Desemba, KCSE ikilengwa Januari 2027',
      href: '/news/s1',
    },
    {
      label: 'How to spot fake KJSEA and KCSE results messages',
      labelSw: 'Jinsi ya kutambua jumbe ghushi za matokeo ya KJSEA na KCSE',
      href: '/news/s4',
    },
    {
      label: 'KPSEA, KJSEA and KCSE explained',
      labelSw: 'Ufafanuzi kamili wa mitihani ya KPSEA, KJSEA na KCSE',
      href: '/news/s5',
    },
  ],
  heroScenes: [
    {
      title: "Kenya's school news, made clear.",
      titleSw: 'Habari za shule za Kenya, kwa lugha rahisi.',
      subtitle: 'What exam timelines, policies and placements mean for your family, explained in plain words.',
      subtitleSw: 'Nini maana ya ratiba za mitihani, miongozo na nafasi za masomo kwa familia yako, ikielezwa wazi.',
      cta1Label: '📚 Browse Library',
      cta1LabelSw: '📚 Maktaba ya Masomo',
      cta1Href: '/learn',
      cta2Label: '📝 View Exams Hub',
      cta2LabelSw: '📝 Kituo cha Mitihani',
      cta2Href: '/exams',
    },
    {
      title: 'Classroom-ready resources.',
      titleSw: 'Nyenzo kamili za kufundishia darasani.',
      subtitle: 'Schemes of work, lesson plans and records for every grade, built for Kenyan teachers.',
      subtitleSw: 'Maazimio ya kazi, maandalio ya masomo na rekodi za kila darasa kwa walimu wa Kenya.',
      cta1Label: '👩🏾‍🏫 Teacher Preparation',
      cta1LabelSw: '👩🏾‍🏫 Maandalizi ya Walimu',
      cta1Href: '/teach',
      cta2Label: '🧮 Classroom Tools',
      cta2LabelSw: '🧮 Zana za Darasani',
      cta2Href: '/tools',
    },
    {
      title: 'Practical skills for school and work.',
      titleSw: 'Ujuzi wa vitendo kwa shule na maisha.',
      subtitle: 'Short courses in study, money, digital and career skills, with Kenyan examples.',
      subtitleSw: 'Kozi fupi za stadi za masomo, fedha, teknolojia na taaluma zenye mifano halisi ya Kenya.',
      cta1Label: '🎓 Browse Courses',
      cta1LabelSw: '🎓 Kozi na Mafunzo',
      cta1Href: '/courses',
      cta2Label: '🤖 Ask Mwalimu AI Tutor',
      cta2LabelSw: '🤖 Uliza Mwalimu AI',
      cta2Href: '/tutor',
    },
  ],
  sections: {
    roleChooser: {
      tag: 'Audience Pathways',
      tagSw: 'Njia za Wadau',
      title: 'Tailored for Every Educational Stakeholder',
      titleSw: 'Imeandaliwa Mahususi kwa Kila Mdau wa Elimu',
      subtitle: 'Choose your role to find verified curriculum resources, official notices, and time-saving tools.',
      subtitleSw: 'Chagua nafasi yako kupata nyenzo rasmi za mtaala, matangazo ya serikali, na zana za kuokoa muda.',
    },
    search: {
      title: 'Search the site & shortcuts',
      titleSw: 'Tafuta kwenye tovuti na njia za mkato',
      subtitle: 'Find calculators, schemes, revision topics, teaching jobs, or ask Mwalimu AI directly.',
      subtitleSw: 'Pata vikokotoo, maazimio ya kazi, mada za marudio, au uliza Mwalimu AI moja kwa moja.',
    },
    news: {
      tag: 'Education Desk',
      tagSw: 'Dawati la Elimu',
      title: 'Latest news',
      titleSw: 'Habari mpya za elimu',
      subtitle: 'What’s happening in education and across Kenya. Browse by category.',
      subtitleSw: 'Kinachoendelea katika elimu nchini Kenya. Chuja kwa kategoria au tafuta.',
    },
    tutorSpotlight: {
      tag: 'Flagship AI Assistant',
      tagSw: 'Msaidizi Mkuu wa AI',
      title: 'Mwalimu AI Tutor: Instant Kenyan Syllabus Revision',
      titleSw: 'Mwalimu AI: Marudio ya Papo Hapo ya Mtaala wa Kenya',
      subtitle: 'Stuck on a tricky question or topic? Ask in plain English or Kiswahili. Get instant step-by-step workings, CBC Grade 7–10 competency guides, and KCSE exam tips aligned with KICD standards.',
      subtitleSw: 'Umekwama kwenye swali gumu? Uliza kwa Kiingereza au Kiswahili upate hatua kwa hatua kulingana na mtaala wa KICD.',
    },
    library: {
      title: 'Learning and teaching library',
      titleSw: 'Maktaba ya kujifunzia na kufundishia',
      subtitle: 'Editable, ready-to-fill teaching materials for every grade, subject and term. Pick your grade below, then download free as editable Word (.doc) files.',
      subtitleSw: 'Nyenzo zilizo tayari kujazwa kwa kila darasa, somo na muhula. Pakua bure kama faili za Word (.doc).',
    },
    teaching: {
      title: 'Teaching materials',
      titleSw: 'Vifaa na violezo vya ualimu',
      subtitle: 'Free, original templates and tools for Kenyan teachers: schemes of work, lesson notes, exams and records. Everything downloads as an editable Word (.doc) file.',
      subtitleSw: 'Violezo vya bure na zana kwa walimu wa Kenya: maazimio, maandalio, mitihani na rekodi.',
    },
    courses: {
      title: 'Short courses',
      titleSw: 'Kozi fupi za ujuzi',
      subtitle: 'Self-paced mini-courses for teachers, learners and families. Read through at your own speed — your progress saves automatically.',
      subtitleSw: 'Kozi fupi za kujisomea kwa walimu, wanafunzi na familia. Maendeleo yako yanahifadhiwa moja kwa moja.',
    },
    games: {
      title: 'Learning games and quizzes',
      titleSw: 'Michezo ya kujifunza na maswali',
      subtitle: 'Fun Kenyan revision games and quick quizzes to sharpen your skills. Your high scores are saved locally on this device.',
      subtitleSw: 'Michezo ya marudio na maswali mafupi ya kuimarisha ujuzi wako.',
    },
    exams: {
      title: 'National exams hub',
      titleSw: 'Kituo cha mitihani ya kitaifa',
      subtitle: 'Timelines, official portals, grading systems and results safety for KPSEA, KJSEA and KCSE.',
      subtitleSw: 'Ratiba, tovuti rasmi, mifumo ya alama na usalama wa matokeo ya KPSEA, KJSEA na KCSE.',
    },
    tools: {
      title: 'Classroom & KCSE tools',
      titleSw: 'Zana za darasani na KCSE',
      subtitle: 'Calculators, rubric builders, class lists, flashcards and study planners tailored to Kenyan grading.',
      subtitleSw: 'Vikokotoo, rubriki, orodha za alama na mipango ya marudio ya mfumo wa Kenya.',
    },
    notices: {
      title: 'Notices & Grade 10 placement',
      titleSw: 'Matangazo na maandalizi ya Gredi 10',
      subtitle: 'Official alerts, results release countdowns, Senior School checklist and community noticeboard.',
      subtitleSw: 'Tahadhari rasmi, muda uliosalia wa matokeo na orodha ya Gredi 10.',
    },
    parents: {
      title: 'Parents hub',
      titleSw: 'Kituo cha wazazi',
      subtitle: 'Term dates, Grade 10 pathway guides, fees checklist and parenting support in plain words.',
      subtitleSw: 'Tarehe za muhula, miongozo ya Gredi 10 na mpangilio wa karo.',
    },
    jobs: {
      title: 'Teaching & tutoring jobs',
      titleSw: 'Nafasi za kazi za ualimu',
      subtitle: 'Verified teaching vacancies across Kenya. Mwalimu Family enforces a strict 0% placement fee policy.',
      subtitleSw: 'Nafasi zilizothibitishwa za ualimu kote Kenya. Bila ada yoyote ya udalali.',
    },
    videos: {
      title: 'Curated YouTube classroom',
      titleSw: 'Darasa la video za YouTube',
      subtitle: 'Short explainers on CBC transitions, KUCCPS cluster math, KJSEA grading and practical study habits.',
      subtitleSw: 'Video fupi za maelezo kuhusu CBC, KUCCPS, KJSEA na stadi za kusoma.',
    },
    help: {
      title: 'Help & CBE glossary',
      titleSw: 'Msaada na kamusi ya CBE',
      subtitle: 'Plain-language answers to Kenyan education terms, portals, grading codes and policies.',
      subtitleSw: 'Maelezo rahisi ya istilahi za elimu ya Kenya, tovuti na sera.',
    },
    tutoring: {
      title: 'Tutoring & revision practice',
      titleSw: 'Masomo ya ziada na mazoezi',
      subtitle: 'Connect with vetted tutors in Kenya or try quick CBE practice exercises with instant answers.',
      subtitleSw: 'Unganishwa na walimu wa ziada waliothibitishwa au fanya mazoezi ya haraka.',
    },
  },
};

export const DEFAULT_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'lm-grade9-kjsea-math',
    title: 'KJSEA Grade 9 Mathematics Topical Revision Pack',
    grade: 'Grade 9',
    subject: 'Mathematics',
    term: 'Term 3',
    type: 'Lesson Notes',
    summary: 'Worked examples on algebra, geometry, commercial arithmetic and data handling for Grade 9 exit prep.',
    content: 'Strand: Numbers & Algebra\n- Integers, indices, standard form and linear equations\n- Ratios, proportions, profit/loss & simple interest\n- Competency practice questions with step-by-step KJSEA EE1–BE2 rubric cues.',
    featured: true,
    createdAt: '2026-11-20',
  },
  {
    id: 'lm-grade8-sci-scheme',
    title: 'Grade 8 Integrated Science Term 1 KICD Scheme',
    grade: 'Grade 8',
    subject: 'Integrated Science',
    term: 'Term 1',
    type: 'Scheme of Work',
    summary: 'Complete 13-week breakdown aligned to KICD Junior School Integrated Science design.',
    content: 'Week 1–4: Scientific Investigation & Lab Safety\nWeek 5–8: Mixtures, Elements & Compounds\nWeek 9–13: Living Things, Human Circulatory System & Assessment.',
    featured: true,
    createdAt: '2026-11-20',
  },
];

export const DEFAULT_CMS_DATA: CmsData = {
  siteCopy: DEFAULT_SITE_COPY,
  news: {
    featuredId: 's1',
    featuredStats: [
      { value: '1,048,355', label: 'KCSE candidates' },
      { value: '10,693', label: 'examination centres' },
      { value: '13,484', label: 'KJSEA examiners' },
      { value: '24', label: 'KJSEA marking centres' },
    ],
    articles: Object.values(ARTICLES),
  },
  courses: COURSES,
  learning: {
    grades: [...GRADES],
    terms: [...TERMS],
    resourceTypes: RESOURCE_TYPES.map(([a, b]) => [a, b] as [string, string]),
    materials: DEFAULT_LEARNING_MATERIALS,
  },
  teaching: TEACHING_TEMPLATES.map((t, idx) => ({ ...t, id: `tt-${idx + 1}` })),
  games: {
    quizzes: {
      m: [...QUIZZES_FULL.m],
      s: [...QUIZZES_FULL.s],
      k: [...QUIZZES_FULL.k],
    },
    memoryPairs: MEMORY_MATCH_PAIRS.map(([sw, en]) => [sw, en] as [string, string]),
    wordScramble: WORD_SCRAMBLE_WORDS.map((w) => ({ ...w })),
  },
};

export function mergeCmsData(partial?: Partial<CmsData> | null): CmsData {
  if (!partial) return DEFAULT_CMS_DATA;

  const mergedSections = { ...DEFAULT_SITE_COPY.sections };
  if (partial.siteCopy?.sections) {
    (Object.keys(DEFAULT_SITE_COPY.sections) as CmsSectionKey[]).forEach((k) => {
      if (partial.siteCopy?.sections?.[k]) {
        mergedSections[k] = { ...DEFAULT_SITE_COPY.sections[k], ...partial.siteCopy.sections[k] };
      }
    });
  }

  return {
    siteCopy: {
      ...DEFAULT_SITE_COPY,
      ...(partial.siteCopy || {}),
      tickerItems:
        Array.isArray(partial.siteCopy?.tickerItems) && partial.siteCopy.tickerItems.length > 0
          ? partial.siteCopy.tickerItems
          : DEFAULT_SITE_COPY.tickerItems,
      heroScenes:
        Array.isArray(partial.siteCopy?.heroScenes) && partial.siteCopy.heroScenes.length > 0
          ? partial.siteCopy.heroScenes
          : DEFAULT_SITE_COPY.heroScenes,
      sections: mergedSections,
    },
    news: {
      featuredId: partial.news?.featuredId || DEFAULT_CMS_DATA.news.featuredId,
      featuredStats:
        Array.isArray(partial.news?.featuredStats) && partial.news.featuredStats.length > 0
          ? partial.news.featuredStats
          : DEFAULT_CMS_DATA.news.featuredStats,
      articles:
        Array.isArray(partial.news?.articles) && partial.news.articles.length > 0
          ? partial.news.articles
          : DEFAULT_CMS_DATA.news.articles,
    },
    courses:
      Array.isArray(partial.courses) && partial.courses.length > 0
        ? partial.courses
        : DEFAULT_CMS_DATA.courses,
    learning: {
      grades:
        Array.isArray(partial.learning?.grades) && partial.learning.grades.length > 0
          ? partial.learning.grades
          : DEFAULT_CMS_DATA.learning.grades,
      terms:
        Array.isArray(partial.learning?.terms) && partial.learning.terms.length > 0
          ? partial.learning.terms
          : DEFAULT_CMS_DATA.learning.terms,
      resourceTypes:
        Array.isArray(partial.learning?.resourceTypes) && partial.learning.resourceTypes.length > 0
          ? partial.learning.resourceTypes
          : DEFAULT_CMS_DATA.learning.resourceTypes,
      materials: Array.isArray(partial.learning?.materials)
        ? partial.learning.materials
        : DEFAULT_CMS_DATA.learning.materials,
    },
    teaching:
      Array.isArray(partial.teaching) && partial.teaching.length > 0
        ? partial.teaching
        : DEFAULT_CMS_DATA.teaching,
    games: {
      quizzes: {
        m:
          Array.isArray(partial.games?.quizzes?.m) && partial.games.quizzes.m.length > 0
            ? partial.games.quizzes.m
            : DEFAULT_CMS_DATA.games.quizzes.m,
        s:
          Array.isArray(partial.games?.quizzes?.s) && partial.games.quizzes.s.length > 0
            ? partial.games.quizzes.s
            : DEFAULT_CMS_DATA.games.quizzes.s,
        k:
          Array.isArray(partial.games?.quizzes?.k) && partial.games.quizzes.k.length > 0
            ? partial.games.quizzes.k
            : DEFAULT_CMS_DATA.games.quizzes.k,
      },
      memoryPairs:
        Array.isArray(partial.games?.memoryPairs) && partial.games.memoryPairs.length >= 6
          ? partial.games.memoryPairs
          : DEFAULT_CMS_DATA.games.memoryPairs,
      wordScramble:
        Array.isArray(partial.games?.wordScramble) && partial.games.wordScramble.length > 0
          ? partial.games.wordScramble
          : DEFAULT_CMS_DATA.games.wordScramble,
    },
    updatedAt: partial.updatedAt || new Date().toISOString(),
  };
}
