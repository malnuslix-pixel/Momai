'use client';

import React, { useState, useEffect } from 'react';
import {
  downloadCustomRubricDoc,
  downloadRevisionDoc,
  downloadClassMarksDoc
} from '@/lib/mwalimu-data';

export default function ToolsSection() {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. KCSE Mean Grade Calculator
  const [kcseGrades, setKcseGrades] = useState<number[]>([12, 11, 10, 9, 8, 7, 7]);
  const [kcseResult, setKcseResult] = useState<string | null>(null);

  const calculateKcse = () => {
    const total = kcseGrades.reduce((a, b) => a + b, 0);
    const bands: [number, string][] = [
      [81, 'A'], [74, 'A-'], [67, 'B+'], [60, 'B'], [53, 'B-'],
      [46, 'C+'], [39, 'C'], [32, 'C-'], [25, 'D+'], [18, 'D'], [11, 'D-'], [1, 'E']
    ];
    let mean = 'E';
    for (const [minPt, g] of bands) {
      if (total >= minPt) {
        mean = g;
        break;
      }
    }
    setKcseResult(`Total: ${total}/84 · Mean grade: ${mean} (check KNEC for official result)`);
  };

  // 2. KUCCPS Cluster Points
  const [cluster4, setCluster4] = useState(36);
  const [total7, setTotal7] = useState(60);
  const [clusterResult, setClusterResult] = useState<string | null>(null);

  const calculateCluster = () => {
    if (cluster4 >= 4 && cluster4 <= 48 && total7 >= 7 && total7 <= 84) {
      const points = Math.sqrt((cluster4 / 48) * (total7 / 84)) * 48;
      setClusterResult(`Estimated cluster points: ${points.toFixed(3)} / 48`);
    } else {
      setClusterResult('Please check your numbers (4 cluster: 4-48, 7 total: 7-84)');
    }
  };

  // 3. KJSEA Points Total (9 learning areas, 1 to 8 scale)
  const [kjseaInput, setKjseaInput] = useState('6, 7, 5, 6, 7, 8, 5, 6, 7');
  const [kjseaResult, setKjseaResult] = useState<string | null>(null);

  const calculateKjsea = () => {
    const pts = kjseaInput.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
    if (pts.length === 0) {
      setKjseaResult('Please enter valid points.');
      return;
    }
    const total = pts.reduce((a, b) => a + b, 0);
    const max = pts.length * 8;
    setKjseaResult(`Total points: ${total} / ${max} across ${pts.length} learning areas.`);
  };

  // 4. Report Form Comments (Single)
  const [learnerName, setLearnerName] = useState('Amina');
  const [learnerStrength, setLearnerStrength] = useState('problem solving');
  const [learnerLevel, setLearnerLevel] = useState('Meets expectation');
  const [generatedComment, setGeneratedComment] = useState('');
  const [copiedSingle, setCopiedSingle] = useState(false);

  const generateComment = () => {
    const templates: Record<string, string> = {
      'Exceeds expectation': `${learnerName} has had an outstanding term, showing real strength in ${learnerStrength}. Encourage ${learnerName} to take on extension tasks.`,
      'Meets expectation': `${learnerName} has worked steadily this term and shows good ${learnerStrength}. With regular practice ${learnerName} can aim even higher.`,
      'Approaches expectation': `${learnerName} is making progress and shows promise in ${learnerStrength}. More revision and practice will help ${learnerName} reach the expected level.`,
      'Below expectation': `${learnerName} needs extra support to meet expectations this term, though ${learnerStrength} is a positive. We will work with the family on a plan for ${learnerName}.`
    };
    const cmt = templates[learnerLevel] || '';
    setGeneratedComment(cmt);
    setCopiedSingle(false);
  };

  const copySingleComment = () => {
    navigator.clipboard.writeText(generatedComment);
    setCopiedSingle(true);
    setTimeout(() => setCopiedSingle(false), 2000);
  };

  // 5. Bulk Report Comments Generator
  const [bulkInput, setBulkInput] = useState('Amina, problem solving\nJuma, reading\nNeema, mathematics');
  const [bulkLevel, setBulkLevel] = useState('Meets expectation');
  const [bulkOutput, setBulkOutput] = useState('');
  const [copiedBulk, setCopiedBulk] = useState(false);

  const generateBulkComments = () => {
    const lines = bulkInput.split('\n').filter(l => l.trim().length > 0);
    const templates: Record<string, string> = {
      'Exceeds expectation': '{n} has had an outstanding term, showing real strength in {s}. Encourage {n} to take on extension tasks.',
      'Meets expectation': '{n} has worked steadily this term and shows good {s}. With regular practice {n} can aim even higher.',
      'Approaches expectation': '{n} is making progress and shows promise in {s}. More revision and practice will help {n} reach the expected level.',
      'Below expectation': '{n} needs extra support to meet expectations this term, though {s} is a positive. We will work with the family on a plan for {n}.'
    };

    const out = lines.map(line => {
      const parts = line.split(',');
      const n = (parts[0] || 'The learner').trim();
      const s = (parts[1] || 'effort').trim();
      return templates[bulkLevel].replace(/\{n\}/g, n).replace(/\{s\}/g, s);
    }).join('\n\n');

    setBulkOutput(out);
    setCopiedBulk(false);
  };

  const copyBulkComments = () => {
    navigator.clipboard.writeText(bulkOutput);
    setCopiedBulk(true);
    setTimeout(() => setCopiedBulk(false), 2000);
  };

  // 6. Word Counter
  const [wordText, setWordText] = useState('');
  const wordCount = wordText.trim() ? wordText.trim().split(/\s+/).length : 0;
  const charCount = wordText.length;
  const sentenceCount = wordText.trim() ? (wordText.match(/[.!?]+/g) || []).length : 0;

  // 7. Attendance Calculator
  const [daysPresent, setDaysPresent] = useState(58);
  const [daysAbsent, setDaysAbsent] = useState(4);
  const [attendanceResult, setAttendanceResult] = useState<string | null>(null);

  const calculateAttendance = () => {
    const total = daysPresent + daysAbsent;
    if (total <= 0) {
      setAttendanceResult('Enter valid days.');
      return;
    }
    const rate = ((daysPresent / total) * 100).toFixed(1);
    setAttendanceResult(`Total school days: ${total} · Attendance rate: ${rate}%`);
  };

  // 8. Group Maker
  const [groupNames, setGroupNames] = useState('Amina\nJuma\nNeema\nOtieno\nWanjiru\nKamau\nFatuma\nChebet');
  const [groupSize, setGroupSize] = useState(3);
  const [generatedGroups, setGeneratedGroups] = useState<string[][]>([]);

  const makeGroups = () => {
    const list = groupNames.split('\n').map(s => s.trim()).filter(Boolean);
    // Shuffle
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const groups: string[][] = [];
    for (let i = 0; i < shuffled.length; i += groupSize) {
      groups.push(shuffled.slice(i, i + groupSize));
    }
    setGeneratedGroups(groups);
  };

  // 9. Rubric Builder
  const [rubricTask, setRubricTask] = useState('Group presentation on Soil Conservation');
  const [rubricCriteria, setRubricCriteria] = useState('Content knowledge, Communication, Teamwork, Practical demonstration');
  const [rubricGenerated, setRubricGenerated] = useState(false);

  // 10. School Fees Planner
  const [feeTerm, setFeeTerm] = useState(25000);
  const [feeUniform, setFeeUniform] = useState(5000);
  const [feeTransport, setFeeTransport] = useState(8000);
  const [feeOther, setFeeOther] = useState(2000);
  const [feeWeeks, setFeeWeeks] = useState(12);
  const [feeResult, setFeeResult] = useState<string | null>(null);

  const calculateFees = () => {
    const total = feeTerm + feeUniform + feeTransport + feeOther;
    const weekly = feeWeeks > 0 ? (total / feeWeeks).toFixed(0) : '0';
    setFeeResult(`Total term budget: KES ${total.toLocaleString()} · Weekly savings target: KES ${Number(weekly).toLocaleString()} / week over ${feeWeeks} weeks.`);
  };

  // 11. Score to Performance Level Converter
  const [scoreVal, setScoreVal] = useState(68);
  const [scoreOutVal, setScoreOutVal] = useState(100);
  const [perfResult, setPerfResult] = useState<string | null>(null);

  const calculatePerformanceLevel = () => {
    if (scoreOutVal <= 0) return;
    const pct = Math.round((scoreVal / scoreOutVal) * 100);
    let level = 'BE2 (Below Expectation 2)';
    if (pct >= 85) level = 'EE1 (Exceeding Expectation 1 - Exceptional)';
    else if (pct >= 75) level = 'EE2 (Exceeding Expectation 2 - High)';
    else if (pct >= 65) level = 'ME1 (Meeting Expectation 1 - Good)';
    else if (pct >= 50) level = 'ME2 (Meeting Expectation 2 - Satisfactory)';
    else if (pct >= 40) level = 'AE1 (Approaching Expectation 1)';
    else if (pct >= 30) level = 'AE2 (Approaching Expectation 2)';
    else if (pct >= 20) level = 'BE1 (Below Expectation 1)';

    setPerfResult(`${pct}% · CBC Assessment Level: ${level}`);
  };

  // 12. Pomodoro Focus Timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerType, setTimerType] = useState('25,5');

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleTimerPreset = (val: string) => {
    setTimerType(val);
    setTimerRunning(false);
    const mins = Number(val.split(',')[0]);
    setTimerSeconds(mins * 60);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 13. Revision Timetable Maker
  const [revExamDate, setRevExamDate] = useState('2026-11-20');
  const [revSubjects, setRevSubjects] = useState('Mathematics, English, Kiswahili, Integrated Science, Social Studies, Agriculture');
  const [revSlots, setRevSlots] = useState(2);
  const [revTableBuilt, setRevTableBuilt] = useState(false);

  // 14. Class Marks and Ranking
  const [marksInput, setMarksInput] = useState('Amina, 78, 85, 80\nJuma, 62, 70, 68\nNeema, 88, 92, 90\nOtieno, 55, 60, 58\nWanjiru, 82, 79, 85');
  const [classRanking, setClassRanking] = useState<any[]>([]);

  const calculateRanking = () => {
    const lines = marksInput.split('\n').filter(l => l.trim().length > 0);
    const parsed = lines.map(line => {
      const parts = line.split(',').map(s => s.trim());
      const name = parts[0];
      const marks = parts.slice(1).map(Number).filter(n => !isNaN(n));
      const total = marks.reduce((a, b) => a + b, 0);
      const mean = marks.length > 0 ? total / marks.length : 0;
      return { name, marks, total, mean, rank: 1 };
    }).filter(p => p.name && p.marks.length > 0);

    // Sort descending
    parsed.sort((a, b) => b.total - a.total);
    parsed.forEach((p, idx) => { p.rank = idx + 1; });
    setClassRanking(parsed);
  };

  // 15. Flashcards
  const FLASHCARD_DECKS = {
    m: [
      { q: 'Area of a Circle', a: 'πr² (Pi × radius squared)' },
      { q: 'Area of a Triangle', a: '1/2 × base × height' },
      { q: 'Perimeter of a Rectangle', a: '2 × (length + width)' },
      { q: 'Volume of a Cuboid', a: 'length × width × height' },
      { q: 'Pythagorean Theorem', a: 'a² + b² = c²' }
    ],
    s: [
      { q: 'Photosynthesis', a: 'Plants convert sunlight, water and CO₂ into food and oxygen' },
      { q: 'Gas taken in by plants for photosynthesis', a: 'Carbon Dioxide (CO₂)' },
      { q: 'SI Unit of Force', a: 'Newton (N)' },
      { q: 'Chemical Symbol for Water', a: 'H₂O' },
      { q: 'Primary Organ that Pumps Blood', a: 'The Heart' }
    ],
    k: [
      { q: 'Maji in English', a: 'Water' },
      { q: 'Nyumba in English', a: 'House' },
      { q: 'Shule in English', a: 'School' },
      { q: 'Kitabu in English', a: 'Book' },
      { q: 'Mwalimu in English', a: 'Teacher' }
    ]
  };

  const [deck, setDeck] = useState<'m' | 's' | 'k'>('m');
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeCards = FLASHCARD_DECKS[deck];
  const activeCard = activeCards[cardIdx % activeCards.length];

  // 16. Pathway Conversation Starter Quiz
  const PATHWAY_QUESTIONS = [
    {
      q: 'Which sounds most exciting to you?',
      opts: ['Building or experimenting with machines', 'Debating, writing or helping people in community', 'Music, athletics, acting or design']
    },
    {
      q: 'In a group project, what is your natural role?',
      opts: ['Solving the technical calculations', 'Organising people, facts and presentation flow', 'Designing the poster or performing the final pitch']
    },
    {
      q: 'Which subject do you look forward to most?',
      opts: ['Mathematics or Integrated Science', 'History, Social Studies, Business or Languages', 'Creative Arts, Sports or Performing Arts']
    },
    {
      q: 'On a free Saturday afternoon, you would rather:',
      opts: ['Build or fix a gadget / computer game', 'Read the news, debate or volunteer', 'Practise a sport, dance or sketch']
    }
  ];

  const [pathwayStep, setPathwayStep] = useState(0);
  const [pathwayScores, setPathwayScores] = useState([0, 0, 0]); // [STEM, Social, Arts]
  const [pathwayResult, setPathwayResult] = useState<string | null>(null);

  const handlePathwayAnswer = (optIdx: number) => {
    const nextScores = [...pathwayScores];
    nextScores[optIdx] += 1;
    setPathwayScores(nextScores);

    if (pathwayStep + 1 < PATHWAY_QUESTIONS.length) {
      setPathwayStep(s => s + 1);
    } else {
      const maxIdx = nextScores.indexOf(Math.max(...nextScores));
      const names = ['🔬 STEM Pathway', '📚 Social Sciences Pathway', '🎨 Arts & Sports Science Pathway'];
      setPathwayResult(names[maxIdx]);
    }
  };

  const resetPathway = () => {
    setPathwayStep(0);
    setPathwayScores([0, 0, 0]);
    setPathwayResult(null);
  };

  return (
    <section className="sec" id="tools" aria-labelledby="oh">
      <div className="w">
        <h2 className="sh rv" id="oh">Tools that save time</h2>
        <div className="warn">
          <h3 style={{ color: 'var(--hd)' }}>How these tools work</h3>
          <ul className="kf">
            <li>Everything runs 100% locally in your browser. Personal data, names and marks are never uploaded.</li>
            <li>Calculators provide planning estimates. Confirm official figures with KNEC, KUCCPS or MoE.</li>
            <li>Document generators produce clean, editable Microsoft Word (.doc) files ready to print.</li>
          </ul>
        </div>

        {/* Filter Category Chips */}
        <div className="chips" style={{ marginBottom: '1.8rem' }}>
          {['All', 'Calculators', 'Teachers', 'Learners', 'Planning'].map((cat) => (
            <button
              key={cat}
              className={`chip ${filterCategory === cat ? 'on' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="cg" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '1.4rem' }}>
          
          {/* TOOL 1: KCSE Calculator */}
          {(filterCategory === 'All' || filterCategory === 'Calculators' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>KCSE mean grade calculator</h3>
              <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '0.6rem' }}>Select points for your 7 best subjects (max 84):</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.35rem', marginBottom: '0.8rem' }}>
                {kcseGrades.map((val, idx) => (
                  <select
                    key={idx}
                    className="sel"
                    value={val}
                    onChange={(e) => {
                      const next = [...kcseGrades];
                      next[idx] = Number(e.target.value);
                      setKcseGrades(next);
                    }}
                    style={{ minHeight: '38px', fontSize: '0.85rem' }}
                  >
                    <option value={12}>Sub {idx + 1}: A (12)</option>
                    <option value={11}>Sub {idx + 1}: A- (11)</option>
                    <option value={10}>Sub {idx + 1}: B+ (10)</option>
                    <option value={9}>Sub {idx + 1}: B (9)</option>
                    <option value={8}>Sub {idx + 1}: B- (8)</option>
                    <option value={7}>Sub {idx + 1}: C+ (7)</option>
                    <option value={6}>Sub {idx + 1}: C (6)</option>
                    <option value={5}>Sub {idx + 1}: C- (5)</option>
                    <option value={4}>Sub {idx + 1}: D+ (4)</option>
                    <option value={3}>Sub {idx + 1}: D (3)</option>
                    <option value={2}>Sub {idx + 1}: D- (2)</option>
                    <option value={1}>Sub {idx + 1}: E (1)</option>
                  </select>
                ))}
              </div>
              <button className="gb" onClick={calculateKcse}>Calculate</button>
              {kcseResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{kcseResult}</p>}
            </div>
          )}

          {/* TOOL 2: KUCCPS Cluster Points */}
          {(filterCategory === 'All' || filterCategory === 'Calculators' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>KUCCPS cluster points</h3>
              <label>Points in your 4 cluster subjects (4 to 48):</label>
              <input
                className="sel"
                type="number"
                min={4}
                max={48}
                value={cluster4}
                onChange={(e) => setCluster4(Number(e.target.value))}
              />
              <label>Total points in 7 subjects (max 84):</label>
              <input
                className="sel"
                type="number"
                min={7}
                max={84}
                value={total7}
                onChange={(e) => setTotal7(Number(e.target.value))}
              />
              <button className="gb" onClick={calculateCluster}>Calculate Cluster</button>
              {clusterResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{clusterResult}</p>}
              <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.4rem' }}>
                Formula: √(r/48 × t/84) × 48. KUCCPS publishes the official annual cut-offs.
              </p>
            </div>
          )}

          {/* TOOL 3: KJSEA Points Total */}
          {(filterCategory === 'All' || filterCategory === 'Calculators' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>KJSEA points total</h3>
              <label>Points per learning area (1 to 8, comma separated):</label>
              <input
                className="sel"
                type="text"
                value={kjseaInput}
                onChange={(e) => setKjseaInput(e.target.value)}
              />
              <button className="gb" onClick={calculateKjsea}>Calculate KJSEA</button>
              {kjseaResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{kjseaResult}</p>}
              <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.4rem' }}>
                Across 9 Grade 9 learning areas (maximum 72 points).
              </p>
            </div>
          )}

          {/* TOOL 4: Report-form Comments Generator */}
          {(filterCategory === 'All' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Report-form comments</h3>
              <label>Learner name:</label>
              <input className="sel" type="text" value={learnerName} onChange={(e) => setLearnerName(e.target.value)} />
              <label>A strength / interest:</label>
              <input className="sel" type="text" value={learnerStrength} onChange={(e) => setLearnerStrength(e.target.value)} />
              <label>Performance level:</label>
              <select className="sel" value={learnerLevel} onChange={(e) => setLearnerLevel(e.target.value)}>
                <option value="Exceeds expectation">Exceeds expectation</option>
                <option value="Meets expectation">Meets expectation</option>
                <option value="Approaches expectation">Approaches expectation</option>
                <option value="Below expectation">Below expectation</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button className="gb" onClick={generateComment}>Generate</button>
                {generatedComment && (
                  <button className="gb o" onClick={copySingleComment}>
                    {copiedSingle ? 'Copied ✓' : 'Copy'}
                  </button>
                )}
              </div>
              {generatedComment && (
                <p style={{ marginTop: '0.6rem', padding: '0.6rem', background: 'rgba(74,140,75,0.1)', borderRadius: '8px', fontSize: '0.92rem' }}>
                  {generatedComment}
                </p>
              )}
            </div>
          )}

          {/* TOOL 5: Bulk Report Comments Generator */}
          {(filterCategory === 'All' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Bulk report comments</h3>
              <label>One learner per line (Name, strength):</label>
              <textarea
                className="sel"
                rows={4}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
              />
              <label>Performance band for this batch:</label>
              <select className="sel" value={bulkLevel} onChange={(e) => setBulkLevel(e.target.value)}>
                <option value="Exceeds expectation">Exceeds expectation</option>
                <option value="Meets expectation">Meets expectation</option>
                <option value="Approaches expectation">Approaches expectation</option>
                <option value="Below expectation">Below expectation</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button className="gb" onClick={generateBulkComments}>Generate All</button>
                {bulkOutput && (
                  <button className="gb o" onClick={copyBulkComments}>
                    {copiedBulk ? 'Copied All ✓' : 'Copy All'}
                  </button>
                )}
              </div>
              {bulkOutput && (
                <div style={{ marginTop: '0.6rem', maxHeight: '160px', overflowY: 'auto', background: 'rgba(74,140,75,0.08)', padding: '0.6rem', borderRadius: '8px', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                  {bulkOutput}
                </div>
              )}
            </div>
          )}

          {/* TOOL 6: Word Counter */}
          {(filterCategory === 'All' || filterCategory === 'Learners' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Word counter (Essays & Insha)</h3>
              <label>Paste your composition, essay or lesson notes:</label>
              <textarea
                className="sel"
                rows={5}
                value={wordText}
                onChange={(e) => setWordText(e.target.value)}
                placeholder="Andika insha au insha hapa..."
              />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.6rem', fontWeight: 700, color: '#2c5f2d', flexWrap: 'wrap' }}>
                <span>Words: {wordCount}</span>
                <span>Characters: {charCount}</span>
                <span>Sentences: {sentenceCount}</span>
              </div>
            </div>
          )}

          {/* TOOL 7: Attendance Calculator */}
          {(filterCategory === 'All' || filterCategory === 'Teachers' || filterCategory === 'Planning') && (
            <div className="card">
              <h3>Attendance rate calculator</h3>
              <label>Days present:</label>
              <input className="sel" type="number" min={0} value={daysPresent} onChange={(e) => setDaysPresent(Number(e.target.value))} />
              <label>Days absent:</label>
              <input className="sel" type="number" min={0} value={daysAbsent} onChange={(e) => setDaysAbsent(Number(e.target.value))} />
              <button className="gb" onClick={calculateAttendance}>Calculate Rate</button>
              {attendanceResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{attendanceResult}</p>}
            </div>
          )}

          {/* TOOL 8: Group Maker */}
          {(filterCategory === 'All' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Classroom group maker</h3>
              <label>One student name per line:</label>
              <textarea
                className="sel"
                rows={4}
                value={groupNames}
                onChange={(e) => setGroupNames(e.target.value)}
              />
              <label>Group size:</label>
              <input className="sel" type="number" min={2} max={12} value={groupSize} onChange={(e) => setGroupSize(Number(e.target.value))} />
              <button className="gb" onClick={makeGroups}>Make Random Groups</button>
              {generatedGroups.length > 0 && (
                <div style={{ marginTop: '0.6rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {generatedGroups.map((grp, gIdx) => (
                    <div key={gIdx} style={{ padding: '0.4rem', borderBottom: '1px solid #eee', fontSize: '0.88rem' }}>
                      <b>Group {gIdx + 1}:</b> {grp.join(', ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TOOL 9: Rubric Builder */}
          {(filterCategory === 'All' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Competency rubric builder</h3>
              <label>Assessment task or project:</label>
              <input className="sel" type="text" value={rubricTask} onChange={(e) => setRubricTask(e.target.value)} />
              <label>Criteria (comma separated):</label>
              <input className="sel" type="text" value={rubricCriteria} onChange={(e) => setRubricCriteria(e.target.value)} />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button className="gb" onClick={() => setRubricGenerated(true)}>Build Rubric</button>
                {rubricGenerated && (
                  <button className="gb o" onClick={() => downloadCustomRubricDoc(rubricTask, rubricCriteria)}>
                    Download .doc
                  </button>
                )}
              </div>
              {rubricGenerated && (
                <p style={{ fontSize: '0.85rem', color: '#2c5f2d', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✓ 4-Level rubric ready for {rubricTask}. Download Word file to print.
                </p>
              )}
            </div>
          )}

          {/* TOOL 10: School Fees Planner */}
          {(filterCategory === 'All' || filterCategory === 'Calculators' || filterCategory === 'Planning') && (
            <div className="card">
              <h3>Secondary school fees planner</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Term Fees (KES):</label>
                  <input className="sel" type="number" min={0} value={feeTerm} onChange={(e) => setFeeTerm(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Uniform & Books:</label>
                  <input className="sel" type="number" min={0} value={feeUniform} onChange={(e) => setFeeUniform(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Transport & Meals:</label>
                  <input className="sel" type="number" min={0} value={feeTransport} onChange={(e) => setFeeTransport(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem' }}>Other Costs:</label>
                  <input className="sel" type="number" min={0} value={feeOther} onChange={(e) => setFeeOther(Number(e.target.value))} />
                </div>
              </div>
              <label style={{ marginTop: '0.4rem' }}>Weeks until payment is due:</label>
              <input className="sel" type="number" min={1} value={feeWeeks} onChange={(e) => setFeeWeeks(Number(e.target.value))} />
              <button className="gb" onClick={calculateFees}>Calculate Budget</button>
              {feeResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{feeResult}</p>}
            </div>
          )}

          {/* TOOL 11: Score to Performance Level */}
          {(filterCategory === 'All' || filterCategory === 'Calculators' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Score to CBC performance level</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label>Learner score:</label>
                  <input className="sel" type="number" min={0} value={scoreVal} onChange={(e) => setScoreVal(Number(e.target.value))} />
                </div>
                <div>
                  <label>Total out of:</label>
                  <input className="sel" type="number" min={1} value={scoreOutVal} onChange={(e) => setScoreOutVal(Number(e.target.value))} />
                </div>
              </div>
              <button className="gb" onClick={calculatePerformanceLevel}>Convert</button>
              {perfResult && <p style={{ fontWeight: 700, color: '#2c5f2d', marginTop: '0.5rem' }}>{perfResult}</p>}
              <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.4rem' }}>
                Bands: EE1 (85%+), EE2 (75-84%), ME1 (65-74%), ME2 (50-64%), AE1 (40-49%), AE2 (30-39%), BE1 (20-29%), BE2 (below 20%).
              </p>
            </div>
          )}

          {/* TOOL 12: Focus Timer */}
          {(filterCategory === 'All' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>Pomodoro study focus timer</h3>
              <select className="sel" value={timerType} onChange={(e) => handleTimerPreset(e.target.value)}>
                <option value="25,5">25 minutes study, 5 min break</option>
                <option value="40,10">40 minutes study, 10 min break</option>
                <option value="50,10">50 minutes study, 10 min break</option>
              </select>
              <p style={{ font: '800 2.2rem Fraunces, serif', margin: '0.6rem 0', color: '#2c5f2d' }}>
                {formatTimer(timerSeconds)}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="gb" onClick={() => setTimerRunning(!timerRunning)}>
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button className="gb o" onClick={() => handleTimerPreset(timerType)}>
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* TOOL 13: Revision Timetable Maker */}
          {(filterCategory === 'All' || filterCategory === 'Planning' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>Weekly revision timetable maker</h3>
              <label>Target exam date:</label>
              <input className="sel" type="date" value={revExamDate} onChange={(e) => setRevExamDate(e.target.value)} />
              <label>Subjects (comma separated):</label>
              <input className="sel" type="text" value={revSubjects} onChange={(e) => setRevSubjects(e.target.value)} />
              <label>Study slots per day:</label>
              <select className="sel" value={revSlots} onChange={(e) => setRevSlots(Number(e.target.value))}>
                <option value={1}>1 slot / day</option>
                <option value={2}>2 slots / day</option>
                <option value={3}>3 slots / day</option>
                <option value={4}>4 slots / day</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button className="gb" onClick={() => setRevTableBuilt(true)}>Build Plan</button>
                {revTableBuilt && (
                  <button className="gb o" onClick={() => downloadRevisionDoc(revExamDate, revSubjects, revSlots)}>
                    Download .doc
                  </button>
                )}
              </div>
              {revTableBuilt && (
                <p style={{ fontSize: '0.85rem', color: '#2c5f2d', fontWeight: 600, marginTop: '0.5rem' }}>
                  ✓ 7-Day timetable generated. Download Word document to print and post on your desk.
                </p>
              )}
            </div>
          )}

          {/* TOOL 14: Class Marks and Ranking */}
          {(filterCategory === 'All' || filterCategory === 'Teachers') && (
            <div className="card">
              <h3>Class marks and ranking</h3>
              <label>One learner per line (Name, mark, mark, mark):</label>
              <textarea
                className="sel"
                rows={4}
                value={marksInput}
                onChange={(e) => setMarksInput(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button className="gb" onClick={calculateRanking}>Rank Learners</button>
                {classRanking.length > 0 && (
                  <button className="gb o" onClick={() => downloadClassMarksDoc(classRanking)}>
                    Download .doc
                  </button>
                )}
              </div>
              {classRanking.length > 0 && (
                <div style={{ marginTop: '0.6rem', maxHeight: '160px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f0f4f0' }}>
                        <th style={{ padding: '4px' }}>#</th>
                        <th style={{ padding: '4px' }}>Name</th>
                        <th style={{ padding: '4px' }}>Total</th>
                        <th style={{ padding: '4px' }}>Mean</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classRanking.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ textAlign: 'center', padding: '4px' }}>{s.rank}</td>
                          <td style={{ padding: '4px' }}>{s.name}</td>
                          <td style={{ textAlign: 'center', padding: '4px' }}>{s.total}</td>
                          <td style={{ textAlign: 'center', padding: '4px', fontWeight: 'bold' }}>{s.mean.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TOOL 15: Flashcards */}
          {(filterCategory === 'All' || filterCategory === 'Learners') && (
            <div className="card">
              <h3>Interactive revision flashcards</h3>
              <select className="sel" value={deck} onChange={(e) => { setDeck(e.target.value as any); setCardIdx(0); setFlipped(false); }}>
                <option value="m">🔢 Mathematics Formulas</option>
                <option value="s">🔬 Science Concepts & Terms</option>
                <option value="k">🗣️ Kiswahili Vocabulary</option>
              </select>

              <div
                className="fc"
                onClick={() => setFlipped(!flipped)}
                tabIndex={0}
                role="button"
                style={{
                  minHeight: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  border: '2px dashed #4a8c4b',
                  borderRadius: '12px',
                  padding: '1rem',
                  margin: '0.8rem 0',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  background: flipped ? '#eaf5eb' : '#fff',
                  transition: 'background 0.2s'
                }}
              >
                {flipped ? activeCard.a : activeCard.q}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: '#666' }}>Card { (cardIdx % activeCards.length) + 1 } of {activeCards.length} · Tap to flip</span>
                <button
                  className="gb o"
                  onClick={() => { setCardIdx(c => c + 1); setFlipped(false); }}
                  style={{ margin: 0, padding: '0.35rem 0.9rem', fontSize: '0.85rem' }}
                >
                  Next Card →
                </button>
              </div>
            </div>
          )}

          {/* TOOL 16: Pathway Conversation Starter */}
          {(filterCategory === 'All' || filterCategory === 'Learners' || filterCategory === 'Planning') && (
            <div className="card">
              <h3>Grade 10 pathway starter</h3>
              {pathwayResult ? (
                <div>
                  <p style={{ font: '800 1.35rem Fraunces, serif', color: '#2c5f2d', margin: '0.6rem 0' }}>
                    Leaning towards: {pathwayResult}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.5 }}>
                    This is an advisory conversation starter based on your answers. Review Ministry of Education and Junior School teacher assessments for official placement.
                  </p>
                  <button className="gb" onClick={resetPathway} style={{ marginTop: '0.6rem' }}>
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '0.82rem', color: '#666' }}>Question {pathwayStep + 1} of {PATHWAY_QUESTIONS.length}:</p>
                  <p style={{ fontWeight: 600, fontSize: '0.98rem', margin: '0.4rem 0 0.8rem' }}>
                    {PATHWAY_QUESTIONS[pathwayStep].q}
                  </p>
                  <div style={{ display: 'grid', gap: '0.4rem' }}>
                    {PATHWAY_QUESTIONS[pathwayStep].opts.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        className="qo"
                        onClick={() => handlePathwayAnswer(oIdx)}
                        style={{ textAlign: 'left', padding: '0.55rem 0.8rem', fontSize: '0.88rem' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
