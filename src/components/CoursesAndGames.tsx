'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  COURSES,
  QUIZZES_FULL,
  MEMORY_MATCH_PAIRS,
  WORD_SCRAMBLE_WORDS
} from '@/lib/mwalimu-data';
import { useLanguage } from '@/lib/language';

interface CoursesAndGamesProps {
  mode?: 'all' | 'courses' | 'games';
}

export default function CoursesAndGames({ mode = 'all' }: CoursesAndGamesProps) {
  const [lang] = useLanguage();
  // ==========================================
  // COURSES STATE & LOGIC
  // ==========================================
  const [courseCategory, setCourseCategory] = useState('All');
  const [courseSearch, setCourseSearch] = useState('');
  const [completedLessons, setCompletedLessons] = useState<Record<string, number[]>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mfc_lessons');
      if (stored) setCompletedLessons(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleLesson = (courseId: string, lessonIdx: number) => {
    const current = completedLessons[courseId] || [];
    const exists = current.includes(lessonIdx);
    const updated = exists ? current.filter(i => i !== lessonIdx) : [...current, lessonIdx];
    const next = { ...completedLessons, [courseId]: updated };
    setCompletedLessons(next);
    try {
      localStorage.setItem('mfc_lessons', JSON.stringify(next));
    } catch {}
  };

  const totalPossibleLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
  const totalCompletedLessons = Object.values(completedLessons).reduce((sum, list) => sum + list.length, 0);

  const filteredCourses = COURSES.filter(c => {
    const matchesCat = courseCategory === 'All' || c.category === courseCategory;
    const matchesSearch = !courseSearch ||
      (c.title + ' ' + c.description + ' ' + c.lessons.map(l => l.title).join(' ')).toLowerCase().includes(courseSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // ==========================================
  // GAMES STATE & LOGIC
  // ==========================================
  const [activeGameTab, setActiveGameTab] = useState<'quiz' | 'memory' | 'speed' | 'scramble'>('quiz');

  // GAME 1: Subject Quiz
  const [quizSub, setQuizSub] = useState<'m' | 's' | 'k'>('m');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);

  const currentQuizList = QUIZZES_FULL[quizSub];
  const currentQ = currentQuizList[quizIdx % currentQuizList.length];

  const handleQuizSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const isCorrect = idx === currentQ.ans;
    if (isCorrect) {
      setQuizScore(s => s + 1);
      setQuizStreak(st => st + 1);
    } else {
      setQuizStreak(0);
    }

    setTimeout(() => {
      setSelectedOpt(null);
      setQuizIdx(prev => (prev + 1) % currentQuizList.length);
    }, 1000);
  };

  // GAME 2: Memory Match (Kiswahili - English)
  interface MemoryCard {
    id: number;
    text: string;
    pairId: number;
    isSwahili: boolean;
    flipped: boolean;
    matched: boolean;
  }

  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchesWon, setMatchesWon] = useState(0);

  const initMemoryGame = () => {
    const cards: MemoryCard[] = [];
    const chosenPairs = MEMORY_MATCH_PAIRS.slice(0, 6); // 6 pairs = 12 cards
    chosenPairs.forEach(([sw, en], idx) => {
      cards.push({ id: idx * 2, text: sw, pairId: idx, isSwahili: true, flipped: false, matched: false });
      cards.push({ id: idx * 2 + 1, text: en, pairId: idx, isSwahili: false, flipped: false, matched: false });
    });
    // Shuffle
    cards.sort(() => Math.random() - 0.5);
    setMemoryCards(cards);
    setSelectedCards([]);
    setMatchesWon(0);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 2) return;
    const clicked = memoryCards.find(c => c.id === id);
    if (!clicked || clicked.flipped || clicked.matched) return;

    const nextCards = memoryCards.map(c => c.id === id ? { ...c, flipped: true } : c);
    setMemoryCards(nextCards);

    const nextSelected = [...selectedCards, id];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const card1 = nextCards.find(c => c.id === nextSelected[0])!;
      const card2 = nextCards.find(c => c.id === nextSelected[1])!;

      if (card1.pairId === card2.pairId && card1.isSwahili !== card2.isSwahili) {
        // Match!
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => c.pairId === card1.pairId ? { ...c, matched: true } : c));
          setSelectedCards([]);
          setMatchesWon(m => m + 1);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setMemoryCards(cards => cards.map(c => nextSelected.includes(c.id) ? { ...c, flipped: false } : c));
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // GAME 3: Speed Maths (60s challenge)
  const [speedOp, setSpeedOp] = useState<'+' | '−' | '×'>('+');
  const [speedSeconds, setSpeedSeconds] = useState(60);
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedProblem, setSpeedProblem] = useState({ a: 7, b: 8, ans: 15 });
  const [speedAnswer, setSpeedAnswer] = useState('');
  const [speedScore, setSpeedScore] = useState(0);

  const generateSpeedProblem = (op: '+' | '−' | '×') => {
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let ans = a + b;
    if (op === '−') {
      if (b > a) { const tmp = a; a = b; b = tmp; }
      ans = a - b;
    } else if (op === '×') {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 12) + 2;
      ans = a * b;
    }
    setSpeedProblem({ a, b, ans });
    setSpeedAnswer('');
  };

  const startSpeedGame = () => {
    setSpeedScore(0);
    setSpeedSeconds(60);
    setSpeedRunning(true);
    generateSpeedProblem(speedOp);
  };

  useEffect(() => {
    let timer: any = null;
    if (speedRunning && speedSeconds > 0) {
      timer = setInterval(() => setSpeedSeconds(s => s - 1), 1000);
    } else if (speedSeconds === 0 && speedRunning) {
      setSpeedRunning(false);
    }
    return () => clearInterval(timer);
  }, [speedRunning, speedSeconds]);

  const handleSpeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speedRunning) return;
    if (Number(speedAnswer) === speedProblem.ans) {
      setSpeedScore(s => s + 1);
    }
    generateSpeedProblem(speedOp);
  };

  // GAME 4: Word Scramble
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<string | null>(null);

  const currentScramble = WORD_SCRAMBLE_WORDS[scrambleIdx % WORD_SCRAMBLE_WORDS.length];
  const scrambledWord = useMemo(() => {
    const orig = currentScramble.word;
    let chars = orig.split('');
    for (let attempts = 0; attempts < 15; attempts++) {
      chars = chars.sort(() => Math.random() - 0.5);
      if (chars.join('') !== orig || orig.length <= 2) break;
    }
    return chars.join('');
  }, [scrambleIdx, currentScramble.word]);

  const handleScrambleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (scrambleInput.trim().toUpperCase() === currentScramble.word) {
      setScrambleFeedback(lang === 'sw' ? '🎉 Safi sana! Sahihi!' : '🎉 Safi sana! Correct!');
      setTimeout(() => {
        setScrambleFeedback(null);
        setScrambleInput('');
        setScrambleIdx(i => i + 1);
      }, 1200);
    } else {
      setScrambleFeedback(lang === 'sw' ? '❌ Jaribu tena (Try again)' : '❌ Jaribu tena (Try again)');
      setTimeout(() => setScrambleFeedback(null), 1200);
    }
  };

  return (
    <>
      {/* COURSES SECTION */}
      {mode !== 'games' && (
      <section className="sec alt" id="courses" aria-labelledby="crh">
        <div className="w">
          <h2 className="sh" id="crh">{lang === 'sw' ? 'Kozi na Ujuzi' : 'Courses and skills'}</h2>
          <p className="sub">
            {lang === 'sw'
              ? 'Miongozo ya bure ya kujiendeleza kwa wanafunzi, wazazi na walimu. Weka alama kwenye masomo unayomaliza — maendeleo yako yanahifadhiwa kwenye kifaa hiki.'
              : 'Free, self-paced skill guides for learners, parents and teachers. Tick off lessons as you go — your progress is securely saved on this device.'}
          </p>

          <p style={{ fontWeight: 600, color: '#2c5f2d', marginBottom: '1rem' }}>
            {lang === 'sw'
              ? `📊 Masomo ${totalCompletedLessons} kati ya ${totalPossibleLessons} yamekamilika kwenye kifaa hiki.`
              : `📊 ${totalCompletedLessons} of ${totalPossibleLessons} lessons completed on this device.`}
          </p>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
            <input
              className="sel"
              type="search"
              placeholder={lang === 'sw' ? 'Tafuta kozi, k.m. CV, chapa, M-Pesa...' : 'Search courses, e.g. CV, typing, M-Pesa...'}
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              style={{ width: 'auto', minWidth: '240px', minHeight: '44px' }}
            />

            <div className="chips" style={{ margin: 0 }}>
              {['All', 'Digital', 'Study', 'Life', 'Career', 'Language', 'Teaching'].map(cat => (
                <button
                  key={cat}
                  className={`chip ${courseCategory === cat ? 'on' : ''}`}
                  onClick={() => setCourseCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="ex3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.4rem' }}>
            {filteredCourses.map(course => {
              const doneList = completedLessons[course.id] || [];
              const pct = Math.round((doneList.length / course.lessons.length) * 100);

              return (
                <div key={course.id} style={{ background: '#fff', borderRadius: '18px', padding: '1.5rem', border: '1px solid #e0ddd6', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="tag">{course.category} · {course.level}</span>
                      <small style={{ color: '#777' }}>{course.duration}</small>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', margin: '0.4rem 0' }}>{course.title}</h3>
                    <p style={{ fontSize: '0.92rem', color: '#555', marginBottom: '0.8rem' }}>{course.description}</p>
                    <p style={{ fontSize: '0.84rem', color: '#1a3d1b', background: '#f0f5f0', padding: '0.4rem 0.6rem', borderRadius: '8px', marginBottom: '0.8rem' }}>
                      <b>🇰🇪 In Kenya:</b> {course.kenyaContext}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ background: '#e0ddd6', height: '6px', borderRadius: '4px', overflow: 'hidden', margin: '0.6rem 0' }}>
                      <div style={{ width: `${pct}%`, background: '#2c5f2d', height: '100%', transition: 'width 0.3s' }} />
                    </div>
                    <small style={{ color: '#666' }}>{doneList.length} of {course.lessons.length} lessons done ({pct}%)</small>

                    {/* Expandable Lessons */}
                    <details style={{ marginTop: '0.8rem', borderTop: '1px solid #eee', paddingTop: '0.6rem' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#2c5f2d', fontSize: '0.9rem' }}>
                        View 5 Lessons & Notes
                      </summary>
                      <div style={{ marginTop: '0.6rem', display: 'grid', gap: '0.6rem' }}>
                        {course.lessons.map((lesson, lIdx) => {
                          const isDone = doneList.includes(lIdx);
                          return (
                            <label key={lIdx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.88rem' }}>
                              <input
                                type="checkbox"
                                checked={isDone}
                                onChange={() => toggleLesson(course.id, lIdx)}
                                style={{ marginTop: '0.2rem' }}
                              />
                              <div>
                                <b style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                                  Lesson {lIdx + 1}: {lesson.title}
                                </b>
                                <p style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.15rem', lineHeight: 1.4 }}>
                                  {lesson.content}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </details>
                  </div>

                  <a
                    className="gb o"
                    href={`https://wa.me/254715363944?text=${encodeURIComponent(`Hello Mwalimu Family, I have a question about the ${course.title} course.`)}`}
                    target="_blank"
                    rel="noopener"
                    style={{ marginTop: '1rem', textAlign: 'center', width: 'fit-content' }}
                  >
                    Ask tutor on WhatsApp →
                  </a>
                </div>
              );
            })}
          </div>

          <div className="warn" style={{ marginTop: '2.5rem' }}>
            <h3 style={{ color: 'var(--hd)' }}>Request a new course</h3>
            <p style={{ color: 'var(--tx)' }}>
              Tell our curriculum desk which course topic you or your school needs on WhatsApp:{' '}
              <a
                className="dl"
                href="https://wa.me/254715363944?text=I%20would%20like%20a%20course%20on..."
                target="_blank"
                rel="noopener"
              >
                Suggest a course on WhatsApp →
              </a>
            </p>
          </div>
        </div>
      </section>
      )}

      {/* GAMES AND QUIZZES SECTION */}
      {mode !== 'courses' && (
      <section className="sec" id="games" aria-labelledby="gmh">
        <div className="w">
          <h2 className="sh" id="gmh">{lang === 'sw' ? 'Michezo na Chemsha Bongo' : 'Games and quizzes'}</h2>
          <p className="sub">
            {lang === 'sw'
              ? 'Chemsha bongo za masomo na michezo shirikishi ya kujifunza yenye alama na rekodi zilizohifadhiwa.'
              : 'Subject quizzes and interactive learning games with saved scores and streaks.'}
          </p>

          {/* Game Tabs */}
          <div className="chips" style={{ marginBottom: '1.8rem' }}>
            <button
              className={`chip ${activeGameTab === 'quiz' ? 'on' : ''}`}
              onClick={() => setActiveGameTab('quiz')}
            >
              📝 {lang === 'sw' ? 'Maswali ya Masomo' : 'Subject Quizzes'}
            </button>
            <button
              className={`chip ${activeGameTab === 'memory' ? 'on' : ''}`}
              onClick={() => setActiveGameTab('memory')}
            >
              🧠 {lang === 'sw' ? 'Mechi ya Kumbukumbu' : 'Memory Match'}
            </button>
            <button
              className={`chip ${activeGameTab === 'speed' ? 'on' : ''}`}
              onClick={() => setActiveGameTab('speed')}
            >
              ⚡ {lang === 'sw' ? 'Hisabati ya Kasi' : 'Speed Maths'}
            </button>
            <button
              className={`chip ${activeGameTab === 'scramble' ? 'on' : ''}`}
              onClick={() => setActiveGameTab('scramble')}
            >
              🔤 {lang === 'sw' ? 'Changamsha Maneno' : 'Word Scramble'}
            </button>
          </div>

          <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* TAB 1: SUBJECT QUIZ */}
            {activeGameTab === 'quiz' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <select
                    className="sel"
                    value={quizSub}
                    onChange={(e) => {
                      setQuizSub(e.target.value as any);
                      setQuizIdx(0);
                      setQuizScore(0);
                      setQuizStreak(0);
                      setSelectedOpt(null);
                    }}
                    style={{ width: 'auto', minWidth: '180px', minHeight: '40px' }}
                  >
                    <option value="m">🔢 {lang === 'sw' ? 'Hisabati (Maswali 8)' : 'Mathematics (8 Qs)'}</option>
                    <option value="s">🔬 {lang === 'sw' ? 'Sayansi Unganishi (Maswali 8)' : 'Integrated Science (8 Qs)'}</option>
                    <option value="k">🗣️ {lang === 'sw' ? 'Kiswahili (Maswali 8)' : 'Kiswahili (8 Qs)'}</option>
                  </select>

                  <div style={{ fontWeight: 700, color: '#2c5f2d', fontSize: '0.95rem' }}>
                    {lang === 'sw'
                      ? `Alama: ${quizScore} · Msururu: ${quizStreak} 🔥`
                      : `Score: ${quizScore} · Streak: ${quizStreak} 🔥`}
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--tx-mu, #4a5568)', marginBottom: '0.4rem' }}>
                  {lang === 'sw'
                    ? `Swali la ${(quizIdx % currentQuizList.length) + 1} kati ya ${currentQuizList.length}:`
                    : `Question ${(quizIdx % currentQuizList.length) + 1} of ${currentQuizList.length}:`}
                </p>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.2rem' }}>{currentQ.q}</h3>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {currentQ.opts.map((opt, idx) => {
                    let btnClass = 'qo';
                    if (selectedOpt !== null) {
                      if (idx === currentQ.ans) btnClass += ' ok';
                      else if (selectedOpt === idx) btnClass += ' no';
                    }
                    return (
                      <button
                        key={idx}
                        className={btnClass}
                        onClick={() => handleQuizSelect(idx)}
                        disabled={selectedOpt !== null}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: MEMORY MATCH */}
            {activeGameTab === 'memory' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                    {lang === 'sw' ? 'Mechi ya Kumbukumbu: Kiswahili - Kiingereza' : 'Kiswahili - English Memory Match'}
                  </h3>
                  <button className="gb o" onClick={initMemoryGame} style={{ margin: 0, padding: '0.35rem 0.85rem', fontSize: '0.85rem', minHeight: '38px' }}>
                    {lang === 'sw' ? 'Anza Upya' : 'Restart'}
                  </button>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--tx-mu, #4a5568)', marginBottom: '1rem' }}>
                  {lang === 'sw'
                    ? `Oanisha neno la Kiswahili na tafsiri yake ya Kiingereza. Jozi zilizopatikana: ${matchesWon} / 6.`
                    : `Match each Kiswahili word with its corresponding English translation. Matched: ${matchesWon} / 6 pairs.`}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))', gap: '0.6rem' }}>
                  {memoryCards.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleCardClick(c.id)}
                      disabled={c.matched}
                      style={{
                        minHeight: '62px',
                        borderRadius: '12px',
                        border: c.matched
                          ? '2px solid rgba(74, 140, 75, 0.5)'
                          : c.flipped
                            ? '2px solid #ffd166'
                            : '2px solid #3d6e42',
                        background: c.matched
                          ? 'rgba(46, 125, 50, 0.22)'
                          : c.flipped
                            ? '#1a3d1b'
                            : 'rgba(255, 255, 255, 0.95)',
                        color: c.matched
                          ? '#2c5f2d'
                          : c.flipped
                            ? '#ffd166'
                            : '#1a1a1a',
                        fontWeight: 700,
                        fontSize: 'clamp(0.72rem, 3.2vw, 0.92rem)',
                        cursor: c.matched ? 'default' : 'pointer',
                        padding: '0.35rem 0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        transition: 'all 0.2s',
                        boxShadow: c.flipped ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                      }}
                    >
                      {c.flipped || c.matched ? c.text : '❓'}
                    </button>
                  ))}
                </div>

                {matchesWon === 6 && (
                  <p style={{ marginTop: '1.2rem', fontWeight: 700, color: '#2c5f2d', textAlign: 'center', fontSize: '1.1rem' }}>
                    {lang === 'sw' ? '🏆 Hongera sana! Umelinganisha jozi zote kikamilifu!' : '🏆 Hongera! You solved all pairs!'}
                  </p>
                )}
              </div>
            )}

            {/* TAB 3: SPEED MATHS */}
            {activeGameTab === 'speed' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                    {lang === 'sw' ? 'Hisabati ya Kasi ya Sekunde 60' : '60-Second Speed Maths'}
                  </h3>
                  <select
                    className="sel"
                    value={speedOp}
                    onChange={(e) => {
                      const op = e.target.value as any;
                      setSpeedOp(op);
                      generateSpeedProblem(op);
                    }}
                    style={{ width: 'auto', minHeight: '40px' }}
                  >
                    <option value="+">{lang === 'sw' ? 'Kujumlisha (+)' : 'Addition (+)'}</option>
                    <option value="−">{lang === 'sw' ? 'Kutoa (−)' : 'Subtraction (−)'}</option>
                    <option value="×">{lang === 'sw' ? 'Kuzidisha (×)' : 'Multiplication (×)'}</option>
                  </select>
                </div>

                {!speedRunning ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                    <p style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
                      {lang === 'sw'
                        ? 'Unaweza kutatua maswali mangapi ndani ya sekunde 60?'
                        : 'How many problems can you solve in 60 seconds?'}
                    </p>
                    {speedScore > 0 && (
                      <p style={{ fontWeight: 700, color: '#2c5f2d', fontSize: '1.2rem', marginBottom: '1rem' }}>
                        {lang === 'sw' ? `Alama ya Mwisho: ${speedScore} sahihi! 🎉` : `Last Score: ${speedScore} correct! 🎉`}
                      </p>
                    )}
                    <button className="gb" onClick={startSpeedGame} style={{ fontSize: '1.05rem', padding: '0.75rem 2rem', minHeight: '48px' }}>
                      {lang === 'sw' ? 'Anza Sekunde 60' : 'Start 60 Seconds'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#c0392b' }}>
                        {lang === 'sw' ? `⏳ Sekunde ${speedSeconds} zimebaki` : `⏳ ${speedSeconds}s left`}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2c5f2d' }}>
                        {lang === 'sw' ? `Alama: ${speedScore}` : `Score: ${speedScore}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '2.4rem', fontWeight: 800, textAlign: 'center', margin: '1rem 0', fontFamily: 'Fraunces, serif' }}>
                      {speedProblem.a} {speedOp} {speedProblem.b} = ?
                    </div>

                    <form onSubmit={handleSpeedSubmit} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                      <input
                        className="sel"
                        type="number"
                        value={speedAnswer}
                        onChange={(e) => setSpeedAnswer(e.target.value)}
                        placeholder={lang === 'sw' ? 'Jibu lako' : 'Your answer'}
                        autoFocus
                        style={{ maxWidth: '160px', fontSize: '1.2rem', textAlign: 'center', minHeight: '44px' }}
                      />
                      <button type="submit" className="gb" style={{ minHeight: '44px', padding: '0.5rem 1.4rem' }}>
                        {lang === 'sw' ? 'Wasilisha' : 'Submit'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: WORD SCRAMBLE */}
            {activeGameTab === 'scramble' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                  {lang === 'sw' ? 'Changamsha Maneno ya Mtaala wa Kenya' : 'Kenyan Education Word Scramble'}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--tx-mu, #4a5568)', marginBottom: '1rem' }}>
                  {lang === 'sw' ? 'Panga herufi upya kufichua neno la kimasomo.' : 'Unscramble the letters to reveal the curriculum word.'}
                </p>

                <div style={{ font: '800 clamp(1.8rem, 5vw, 2.3rem) Fraunces, Georgia, serif', letterSpacing: '0.25em', color: '#1a3d1b', textAlign: 'center', margin: '1.2rem 0', wordBreak: 'break-all' }}>
                  {scrambledWord}
                </div>

                <p style={{ textAlign: 'center', color: 'var(--tx-mu, #4a5568)', fontStyle: 'italic', marginBottom: '1.2rem', fontSize: '0.92rem' }}>
                  💡 {lang === 'sw' ? 'Dokezo' : 'Hint'}: {currentScramble.hint}
                </p>

                <form onSubmit={handleScrambleCheck} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input
                    className="sel"
                    type="text"
                    value={scrambleInput}
                    onChange={(e) => setScrambleInput(e.target.value)}
                    placeholder={lang === 'sw' ? 'Andika neno...' : 'Enter word...'}
                    autoCapitalize="characters"
                    style={{ maxWidth: '220px', textTransform: 'uppercase', minHeight: '44px', fontSize: '1rem' }}
                  />
                  <button type="submit" className="gb" style={{ minHeight: '44px', padding: '0.5rem 1.3rem' }}>
                    {lang === 'sw' ? 'Angalia' : 'Check'}
                  </button>
                  <button
                    type="button"
                    className="gb o"
                    onClick={() => { setScrambleIdx(i => i + 1); setScrambleInput(''); }}
                    style={{ minHeight: '44px', padding: '0.5rem 1rem' }}
                  >
                    {lang === 'sw' ? 'Ruka' : 'Skip'}
                  </button>
                </form>

                {scrambleFeedback && (
                  <p style={{ textAlign: 'center', fontWeight: 700, marginTop: '1rem', fontSize: '1rem' }}>
                    {scrambleFeedback}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      )}
    </>
  );
}
