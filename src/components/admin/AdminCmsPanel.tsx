'use client';

import React, { useState } from 'react';
import { Article, Course } from '@/lib/mwalimu-data';
import {
  CmsData,
  LearningMaterial,
  CmsTeachingTemplate,
} from '@/lib/cms';
import { CMS_UPDATED_EVENT } from '@/lib/cms-context';

interface AdminCmsPanelProps {
  cms: CmsData;
  onCmsUpdated: (next: CmsData) => void;
  showToast: (msg: string) => void;
  subTab: 'news' | 'courses' | 'learning' | 'games';
}

export default function AdminCmsPanel({
  cms,
  onCmsUpdated,
  showToast,
  subTab,
}: AdminCmsPanelProps) {
  const [saving, setSaving] = useState(false);

  const persistSlice = async (
    section: 'news' | 'courses' | 'learning' | 'teaching' | 'games',
    data: any,
    label: string
  ) => {
    setSaving(true);
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      });
      const json = await res.json();
      if (json.ok && json.cms) {
        onCmsUpdated(json.cms);
        window.dispatchEvent(new CustomEvent(CMS_UPDATED_EVENT, { detail: { cms: json.cms } }));
        showToast(`${label} saved (${json.storedIn || 'live'}).`);
      } else {
        showToast(json.error || `Failed to save ${label}`);
      }
    } catch {
      showToast(`Network error saving ${label}.`);
    } finally {
      setSaving(false);
    }
  };

  // =========================================================================
  // NEWS & AI WRITER STATE
  // =========================================================================
  const [newsAiTopic, setNewsAiTopic] = useState('');
  const [newsAiNotes, setNewsAiNotes] = useState('');
  const [newsAiCat, setNewsAiCat] = useState('Education');
  const [newsAiLoading, setNewsAiLoading] = useState(false);

  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artLabel, setArtLabel] = useState('Education');
  const [artDate, setArtDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [artParagraphs, setArtParagraphs] = useState('');
  const [artFacts, setArtFacts] = useState('');
  const [artTakeaways, setArtTakeaways] = useState('');
  const [artActionHref, setArtActionHref] = useState('/notices');
  const [artActionLabel, setArtActionLabel] = useState('Open Official Notices');

  const loadArticleToEditor = (a: Article) => {
    setEditingArticleId(a.id);
    setArtTitle(a.t);
    setArtLabel(a.l);
    setArtDate(a.d);
    setArtParagraphs(a.c.join('\n\n'));
    setArtFacts((a.k || []).join('\n'));
    setArtTakeaways((a.m || []).join('\n'));
    setArtActionHref(a.x?.[0] || '/notices');
    setArtActionLabel(a.x?.[1] || 'View Notice');
  };

  const resetArticleEditor = () => {
    setEditingArticleId(null);
    setArtTitle('');
    setArtLabel('Education');
    setArtDate(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
    setArtParagraphs('');
    setArtFacts('');
    setArtTakeaways('');
    setArtActionHref('/notices');
    setArtActionLabel('Open Official Notices');
  };

  const handleAIWriteNews = async () => {
    if (!newsAiTopic.trim() && !newsAiNotes.trim()) {
      showToast('Enter a topic or paste source notes for the AI journalist.');
      return;
    }
    setNewsAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'write_news',
          topic: newsAiTopic,
          notes: newsAiNotes,
          category: newsAiCat,
        }),
      });
      const json = await res.json();
      if (json.ok && json.article) {
        const a: Article = json.article;
        setEditingArticleId(null);
        setArtTitle(a.t);
        setArtLabel(a.l);
        setArtDate(a.d);
        setArtParagraphs(a.c.join('\n\n'));
        setArtFacts((a.k || []).join('\n'));
        setArtTakeaways((a.m || []).join('\n'));
        if (a.x) {
          setArtActionHref(a.x[0]);
          setArtActionLabel(a.x[1]);
        }
        showToast(`AI drafted full news story (${json.provider}). Review and click Save Article!`);
      } else {
        showToast(json.error || 'AI news draft failed.');
      }
    } catch {
      showToast('Network error generating article.');
    } finally {
      setNewsAiLoading(false);
    }
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artParagraphs.trim()) {
      showToast('Article headline and body paragraphs are required.');
      return;
    }
    const id = editingArticleId || `n-${Date.now().toString(36)}`;
    const existing = cms.news.articles.find((x) => x.id === id);
    const article: Article = {
      id,
      t: artTitle.trim(),
      l: artLabel.trim() || 'Education',
      d: artDate.trim() || 'Recent',
      c: artParagraphs.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
      k: artFacts.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      m: artTakeaways.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
      q: existing?.q || [],
      r: existing?.r || ['s1', 's4'],
      x: [artActionHref.trim() || '/news', artActionLabel.trim() || 'Read Updates'],
    };
    const nextArticles = existing
      ? cms.news.articles.map((a) => (a.id === id ? article : a))
      : [article, ...cms.news.articles];
    await persistSlice('news', { ...cms.news, articles: nextArticles }, 'News article');
    resetArticleEditor();
  };

  // =========================================================================
  // COURSES & AI COURSE BUILDER STATE
  // =========================================================================
  const [courseAiTopic, setCourseAiTopic] = useState('');
  const [courseAiCat, setCourseAiCat] = useState<Course['category']>('Study');
  const [courseAiLevel, setCourseAiLevel] = useState<Course['level']>('Beginner');
  const [courseAiLoading, setCourseAiLoading] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [cTitle, setCTitle] = useState('');
  const [cCat, setCCat] = useState<Course['category']>('Study');
  const [cLevel, setCLevel] = useState<Course['level']>('Beginner');
  const [cDuration, setCDuration] = useState('About 2 hours');
  const [cDesc, setCDesc] = useState('');
  const [cKenya, setCKenya] = useState('');
  const [cLessonsText, setCLessonsText] = useState('');

  const handleAIGenerateCourse = async () => {
    if (!courseAiTopic.trim()) {
      showToast('Enter a course topic first.');
      return;
    }
    setCourseAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_course',
          topic: courseAiTopic,
          category: courseAiCat,
          level: courseAiLevel,
        }),
      });
      const json = await res.json();
      if (json.ok && json.course) {
        const c: Course = json.course;
        setEditingCourseId(null);
        setCTitle(c.title);
        setCCat(c.category);
        setCLevel(c.level);
        setCDuration(c.duration);
        setCDesc(c.description);
        setCKenya(c.kenyaContext);
        setCLessonsText(c.lessons.map((l) => `${l.title} | ${l.content}`).join('\n'));
        showToast(`AI drafted "${c.title}" (${json.provider}). Click Save Course to publish!`);
      }
    } catch {
      showToast('Failed to generate course with AI.');
    } finally {
      setCourseAiLoading(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const lessons = cLessonsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const [titlePart, ...rest] = line.split('|');
        return {
          title: (titlePart || `Lesson ${i + 1}`).trim(),
          content: rest.join('|').trim() || titlePart.trim(),
        };
      });
    if (!cTitle.trim() || lessons.length === 0) {
      showToast('Course title and at least 1 lesson (Title | Content) required.');
      return;
    }
    const id =
      editingCourseId ||
      cTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
      `c-${Date.now()}`;
    const course: Course = {
      id,
      title: cTitle.trim(),
      category: cCat,
      level: cLevel,
      duration: cDuration.trim() || 'About 2 hours',
      description: cDesc.trim(),
      kenyaContext: cKenya.trim(),
      lessons,
    };
    const exists = cms.courses.some((x) => x.id === id);
    const next = exists
      ? cms.courses.map((x) => (x.id === id ? course : x))
      : [course, ...cms.courses];
    await persistSlice('courses', next, 'Course catalog');
    setEditingCourseId(null);
    setCTitle('');
    setCDesc('');
    setCKenya('');
    setCLessonsText('');
  };

  // =========================================================================
  // LEARNING MATERIALS & TEACHING TEMPLATES STATE
  // =========================================================================
  const [matGrade, setMatGrade] = useState('Grade 8');
  const [matSubject, setMatSubject] = useState('Mathematics');
  const [matTerm, setMatTerm] = useState('Term 1');
  const [matType, setMatType] = useState('Lesson Notes');
  const [matTitle, setMatTitle] = useState('');
  const [matSummary, setMatSummary] = useState('');
  const [matContent, setMatContent] = useState('');
  const [matUrl, setMatUrl] = useState('');
  const [matAiLoading, setMatAiLoading] = useState(false);

  const [gradesCsv, setGradesCsv] = useState(cms.learning.grades.join(', '));

  const [tplTitle, setTplTitle] = useState('');
  const [tplCat, setTplCat] = useState<CmsTeachingTemplate['category']>('Schemes');
  const [tplGrades, setTplGrades] = useState('Grade 7–9');
  const [tplBody, setTplBody] = useState('');

  const handleAIGenerateLearningPack = async () => {
    setMatAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_learning_pack',
          grade: matGrade,
          subject: matSubject,
          term: matTerm,
          type: matType,
          topic: matTitle,
        }),
      });
      const json = await res.json();
      if (json.ok && json.material) {
        setMatTitle(json.material.title);
        setMatSummary(json.material.summary);
        setMatContent(json.material.content);
        showToast(`AI generated KICD pack (${json.provider}).`);
      }
    } catch {
      showToast('Failed to generate learning pack.');
    } finally {
      setMatAiLoading(false);
    }
  };

  const handleSaveLearningMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim() || !matContent.trim()) {
      showToast('Material title and content are required.');
      return;
    }
    const nextMat: LearningMaterial = {
      id: `lm-${Date.now().toString(36)}`,
      title: matTitle.trim(),
      grade: matGrade,
      subject: matSubject.trim() || 'Mathematics',
      term: matTerm,
      type: matType,
      summary: matSummary.trim() || `${matGrade} ${matSubject} resource`,
      content: matContent.trim(),
      url: matUrl.trim() || undefined,
      featured: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    await persistSlice(
      'learning',
      { ...cms.learning, materials: [nextMat, ...cms.learning.materials] },
      'Learning material'
    );
    setMatTitle('');
    setMatSummary('');
    setMatContent('');
    setMatUrl('');
  };

  const handleSaveTeachingTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplTitle.trim()) {
      showToast('Template title is required.');
      return;
    }
    const nextTpl: CmsTeachingTemplate = {
      id: `tt-${Date.now().toString(36)}`,
      category: tplCat,
      title: tplTitle.trim(),
      typeId: tplCat === 'Exams' ? 'exam' : tplCat === 'Lesson notes' ? 'notes' : tplCat === 'Records' ? 'record' : 'scheme',
      targetGrades: tplGrades.trim() || 'All grades',
      filename: tplTitle.trim().replace(/[^a-zA-Z0-9]+/g, '_'),
      customBody: tplBody.trim() || undefined,
    };
    await persistSlice('teaching', [nextTpl, ...cms.teaching], 'Teaching template');
    setTplTitle('');
    setTplBody('');
  };

  // =========================================================================
  // GAMES & QUIZZES STATE
  // =========================================================================
  const [quizSubjectKey, setQuizSubjectKey] = useState<'m' | 's' | 'k'>('m');
  const [quizTopic, setQuizTopic] = useState('');
  const [quizAiLoading, setQuizAiLoading] = useState(false);
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qAns, setQAns] = useState(0);

  const [memSw, setMemSw] = useState('');
  const [memEn, setMemEn] = useState('');
  const [scrWord, setScrWord] = useState('');
  const [scrHint, setScrHint] = useState('');

  const handleAIGenerateQuizPack = async (mode: 'quiz' | 'memory' | 'scramble') => {
    setQuizAiLoading(true);
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_quiz_pack',
          mode,
          subjectKey: quizSubjectKey,
          topic: quizTopic,
        }),
      });
      const json = await res.json();
      if (!json.ok) return;

      if (mode === 'quiz' && Array.isArray(json.questions)) {
        const nextGames = {
          ...cms.games,
          quizzes: {
            ...cms.games.quizzes,
            [quizSubjectKey]: [...json.questions, ...cms.games.quizzes[quizSubjectKey]],
          },
        };
        await persistSlice('games', nextGames, `AI added ${json.questions.length} quiz questions`);
      } else if (mode === 'memory' && Array.isArray(json.pairs)) {
        const nextGames = {
          ...cms.games,
          memoryPairs: [...json.pairs, ...cms.games.memoryPairs],
        };
        await persistSlice('games', nextGames, 'AI memory pairs');
      } else if (mode === 'scramble' && Array.isArray(json.words)) {
        const nextGames = {
          ...cms.games,
          wordScramble: [...json.words, ...cms.games.wordScramble],
        };
        await persistSlice('games', nextGames, 'AI scramble words');
      }
    } catch {
      showToast('AI game pack generation failed.');
    } finally {
      setQuizAiLoading(false);
    }
  };

  // =========================================================================
  // RENDER SUB-VIEWS
  // =========================================================================
  if (subTab === 'news') {
    return (
      <div>
        <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
          <h2>AI Education Journalist (Full Article Writer)</h2>
          <p className="mu">Enter a Kenyan education topic or paste an MoE / KNEC press statement — AI generates headline, paragraphs, key facts, parent takeaways &amp; FAQs.</p>
          <div className="grid g2" style={{ marginBottom: '0.6rem' }}>
            <input
              type="text"
              value={newsAiTopic}
              onChange={(e) => setNewsAiTopic(e.target.value)}
              placeholder="Topic/headline idea (e.g. Grade 10 reporting checklist 2027)"
            />
            <select value={newsAiCat} onChange={(e) => setNewsAiCat(e.target.value)}>
              <option value="Education">Education</option>
              <option value="Explainer">Explainer</option>
              <option value="Analysis">Analysis</option>
              <option value="Policy">Policy</option>
            </select>
          </div>
          <textarea
            rows={3}
            value={newsAiNotes}
            onChange={(e) => setNewsAiNotes(e.target.value)}
            placeholder="Optional circular notes, figures, or source facts..."
            style={{ width: '100%', marginBottom: '0.6rem' }}
          />
          <button type="button" className="b" onClick={handleAIWriteNews} disabled={newsAiLoading}>
            {newsAiLoading ? 'Writing full article…' : 'Write Full Article with AI'}
          </button>
        </div>

        <div className="card">
          <h2>{editingArticleId ? `Edit Article (${editingArticleId})` : 'Publish / Edit News Article'}</h2>
          <form onSubmit={handleSaveArticle}>
            <div className="grid g2" style={{ marginBottom: '0.7rem' }}>
              <div>
                <label>Headline</label>
                <input type="text" value={artTitle} onChange={(e) => setArtTitle(e.target.value)} required />
              </div>
              <div>
                <label>Category &amp; Date</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" value={artLabel} onChange={(e) => setArtLabel(e.target.value)} placeholder="Education" />
                  <input type="text" value={artDate} onChange={(e) => setArtDate(e.target.value)} placeholder="20 November 2026" />
                </div>
              </div>
            </div>
            <label>Article Paragraphs (separate paragraphs with a blank line)</label>
            <textarea rows={5} value={artParagraphs} onChange={(e) => setArtParagraphs(e.target.value)} style={{ width: '100%', marginBottom: '0.7rem' }} required />
            <div className="grid g2" style={{ marginBottom: '0.7rem' }}>
              <div>
                <label>Key Facts (one bullet per line)</label>
                <textarea rows={3} value={artFacts} onChange={(e) => setArtFacts(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label>What It Means For Families (one per line)</label>
                <textarea rows={3} value={artTakeaways} onChange={(e) => setArtTakeaways(e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>
            <div className="grid g2" style={{ marginBottom: '0.8rem' }}>
              <input type="text" value={artActionHref} onChange={(e) => setArtActionHref(e.target.value)} placeholder="CTA Route (/notices)" />
              <input type="text" value={artActionLabel} onChange={(e) => setArtActionLabel(e.target.value)} placeholder="CTA Button Label" />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="b" disabled={saving}>{saving ? 'Saving…' : 'Save & Publish Article'}</button>
              {editingArticleId && (
                <button type="button" className="b s" onClick={resetArticleEditor}>Cancel Edit</button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Published News Stories ({cms.news.articles.length})</h2>
          <div className="sc">
            <table>
              <thead>
                <tr><th>Headline</th><th>Category</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {cms.news.articles.map((art) => (
                  <tr key={art.id}>
                    <td>
                      <b>{art.t}</b>
                      {cms.news.featuredId === art.id && <span className="p ok" style={{ marginLeft: '0.4rem' }}>Featured Lead</span>}
                    </td>
                    <td>{art.l}</td>
                    <td>{art.d}</td>
                    <td style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <button className="b s" onClick={() => loadArticleToEditor(art)}>Edit</button>
                      {cms.news.featuredId !== art.id && (
                        <button
                          className="b s"
                          onClick={() => persistSlice('news', { ...cms.news, featuredId: art.id }, 'Featured story')}
                        >
                          Set Lead
                        </button>
                      )}
                      <button
                        className="b s"
                        onClick={() =>
                          persistSlice(
                            'news',
                            { ...cms.news, articles: cms.news.articles.filter((x) => x.id !== art.id) },
                            'News deletion'
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (subTab === 'courses') {
    return (
      <div>
        <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
          <h2>AI Course &amp; Lesson Builder</h2>
          <div className="grid g3" style={{ marginBottom: '0.6rem' }}>
            <input type="text" value={courseAiTopic} onChange={(e) => setCourseAiTopic(e.target.value)} placeholder="Topic (e.g. Digital Safety & Financial Literacy)" />
            <select value={courseAiCat} onChange={(e) => setCourseAiCat(e.target.value as any)}>
              {['Digital', 'Study', 'Life', 'Career', 'Language', 'Teaching'].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={courseAiLevel} onChange={(e) => setCourseAiLevel(e.target.value as any)}>
              {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button type="button" className="b" onClick={handleAIGenerateCourse} disabled={courseAiLoading}>
            {courseAiLoading ? 'Designing course…' : 'Generate Course with AI'}
          </button>
        </div>

        <div className="card">
          <h2>{editingCourseId ? `Edit Course (${editingCourseId})` : 'Add / Edit Self-Paced Course'}</h2>
          <form onSubmit={handleSaveCourse}>
            <div className="grid g3" style={{ marginBottom: '0.7rem' }}>
              <input type="text" value={cTitle} onChange={(e) => setCTitle(e.target.value)} placeholder="Course title" required />
              <select value={cCat} onChange={(e) => setCCat(e.target.value as any)}>
                {['Digital', 'Study', 'Life', 'Career', 'Language', 'Teaching'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={cLevel} onChange={(e) => setCLevel(e.target.value as any)}>
                {['Beginner', 'Intermediate', 'Advanced'].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="grid g2" style={{ marginBottom: '0.7rem' }}>
              <input type="text" value={cDuration} onChange={(e) => setCDuration(e.target.value)} placeholder="Duration (e.g. About 2 hours)" />
              <input type="text" value={cKenya} onChange={(e) => setCKenya(e.target.value)} placeholder="Kenyan context sentence" />
            </div>
            <input type="text" value={cDesc} onChange={(e) => setCDesc(e.target.value)} placeholder="Short course description" style={{ width: '100%', marginBottom: '0.7rem' }} />
            <label>Lessons (one per line: <code>Lesson Title | Detailed explanation</code>)</label>
            <textarea rows={5} value={cLessonsText} onChange={(e) => setCLessonsText(e.target.value)} style={{ width: '100%', marginBottom: '0.7rem' }} required />
            <button type="submit" className="b" disabled={saving}>{saving ? 'Saving…' : 'Save Course to Frontend'}</button>
          </form>
        </div>

        <div className="card">
          <h2>Active Courses ({cms.courses.length})</h2>
          <div className="sc">
            <table>
              <thead><tr><th>Course</th><th>Category</th><th>Lessons</th><th>Actions</th></tr></thead>
              <tbody>
                {cms.courses.map((c) => (
                  <tr key={c.id}>
                    <td><b>{c.title}</b><div className="mu">{c.description}</div></td>
                    <td>{c.category} · {c.level}</td>
                    <td>{c.lessons.length} lessons</td>
                    <td style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        className="b s"
                        onClick={() => {
                          setEditingCourseId(c.id);
                          setCTitle(c.title);
                          setCCat(c.category);
                          setCLevel(c.level);
                          setCDuration(c.duration);
                          setCDesc(c.description);
                          setCKenya(c.kenyaContext);
                          setCLessonsText(c.lessons.map((l) => `${l.title} | ${l.content}`).join('\n'));
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="b s"
                        onClick={() => persistSlice('courses', cms.courses.filter((x) => x.id !== c.id), 'Course removal')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (subTab === 'learning') {
    return (
      <div>
        <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
          <h2>📚 Publish Learning Material Pack (with AI KICD Generator)</h2>
          <form onSubmit={handleSaveLearningMaterial}>
            <div className="grid g2" style={{ marginBottom: '0.6rem' }}>
              <select value={matGrade} onChange={(e) => setMatGrade(e.target.value)}>
                {cms.learning.grades.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              <input type="text" value={matSubject} onChange={(e) => setMatSubject(e.target.value)} placeholder="Subject" />
            </div>
            <div className="grid g2" style={{ marginBottom: '0.6rem' }}>
              <select value={matTerm} onChange={(e) => setMatTerm(e.target.value)}>
                {cms.learning.terms.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={matType} onChange={(e) => setMatType(e.target.value)}>
                {cms.learning.resourceTypes.map(([lbl]) => <option key={lbl} value={lbl}>{lbl}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              <input type="text" value={matTitle} onChange={(e) => setMatTitle(e.target.value)} placeholder="Material title / topic" style={{ flex: 1 }} required />
              <button type="button" className="b s" onClick={handleAIGenerateLearningPack} disabled={matAiLoading}>
                {matAiLoading ? 'Drafting…' : 'Draft Pack with AI'}
              </button>
            </div>
            <input type="text" value={matSummary} onChange={(e) => setMatSummary(e.target.value)} placeholder="Short summary shown on Library card" style={{ width: '100%', marginBottom: '0.6rem' }} />
            <input type="url" value={matUrl} onChange={(e) => setMatUrl(e.target.value)} placeholder="Optional external URL (PDF/Drive link)" style={{ width: '100%', marginBottom: '0.6rem' }} />
            <textarea rows={4} value={matContent} onChange={(e) => setMatContent(e.target.value)} placeholder="Downloadable Word (.doc) content: strands, learning outcomes, inquiry questions..." style={{ width: '100%', marginBottom: '0.6rem' }} required />
            <button type="submit" className="b" disabled={saving}>Publish Learning Material</button>
          </form>
        </div>

        <div className="card">
          <h2>Published Library Packs ({cms.learning.materials.length}) &amp; Grades Control</h2>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
            <input type="text" value={gradesCsv} onChange={(e) => setGradesCsv(e.target.value)} style={{ flex: 1 }} aria-label="Supported grades CSV" />
            <button
              type="button"
              className="b s"
              onClick={() =>
                persistSlice(
                  'learning',
                  { ...cms.learning, grades: gradesCsv.split(',').map((s) => s.trim()).filter(Boolean) },
                  'Library grades list'
                )
              }
            >
              Update Grades
            </button>
          </div>
          {cms.learning.materials.map((m) => (
            <div key={m.id} className="al" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{m.title}</b> <span className="mu">({m.grade} · {m.subject} · {m.type})</span>
              </div>
              <button
                className="b s"
                onClick={() =>
                  persistSlice('learning', { ...cms.learning, materials: cms.learning.materials.filter((x) => x.id !== m.id) }, 'Material deleted')
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>👩🏾‍🏫 Teaching Desk Templates ({cms.teaching.length})</h2>
          <form onSubmit={handleSaveTeachingTemplate} style={{ marginBottom: '1rem' }}>
            <div className="grid g3" style={{ marginBottom: '0.6rem' }}>
              <input type="text" value={tplTitle} onChange={(e) => setTplTitle(e.target.value)} placeholder="Template title" required />
              <select value={tplCat} onChange={(e) => setTplCat(e.target.value as any)}>
                {['Schemes', 'Lesson notes', 'Exams', 'Records'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="text" value={tplGrades} onChange={(e) => setTplGrades(e.target.value)} placeholder="Target grades" />
            </div>
            <textarea rows={2} value={tplBody} onChange={(e) => setTplBody(e.target.value)} placeholder="Optional custom Word template body (leave blank to use built-in KICD table)" style={{ width: '100%', marginBottom: '0.6rem' }} />
            <button type="submit" className="b s">Add Teaching Template</button>
          </form>
          {cms.teaching.map((t, idx) => (
            <div key={t.id || idx} className="al" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div><b>{t.title}</b> <span className="mu">· {t.category} · {t.targetGrades}</span></div>
              <button
                className="b s"
                onClick={() => persistSlice('teaching', cms.teaching.filter((_, i) => i !== idx), 'Template deleted')}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ borderLeft: '4px solid #f4a261' }}>
        <h2>🎮 AI Game &amp; Quiz Pack Generator</h2>
        <div className="grid g2" style={{ marginBottom: '0.6rem' }}>
          <select value={quizSubjectKey} onChange={(e) => setQuizSubjectKey(e.target.value as any)}>
            <option value="m">Mathematics Quiz</option>
            <option value="s">Science Quiz</option>
            <option value="k">Kiswahili Quiz</option>
          </select>
          <input type="text" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} placeholder="Focus topic (e.g. Algebra, Ecology, Msamiati)" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="b" onClick={() => handleAIGenerateQuizPack('quiz')} disabled={quizAiLoading}>+4 Quiz Questions (AI)</button>
          <button type="button" className="b s" onClick={() => handleAIGenerateQuizPack('memory')} disabled={quizAiLoading}>+6 Memory Pairs (AI)</button>
          <button type="button" className="b s" onClick={() => handleAIGenerateQuizPack('scramble')} disabled={quizAiLoading}>+5 Scramble Words (AI)</button>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h2>Add Subject Quiz Question ({cms.games.quizzes[quizSubjectKey].length} total)</h2>
          <input type="text" value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Question prompt" style={{ width: '100%', marginBottom: '0.45rem' }} />
          <div className="grid g3" style={{ marginBottom: '0.45rem' }}>
            <input type="text" value={qOpt0} onChange={(e) => setQOpt0(e.target.value)} placeholder="Option A" />
            <input type="text" value={qOpt1} onChange={(e) => setQOpt1(e.target.value)} placeholder="Option B" />
            <input type="text" value={qOpt2} onChange={(e) => setQOpt2(e.target.value)} placeholder="Option C" />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.8rem' }}>
            <select value={qAns} onChange={(e) => setQAns(Number(e.target.value))}>
              <option value={0}>Correct: Option A</option>
              <option value={1}>Correct: Option B</option>
              <option value={2}>Correct: Option C</option>
            </select>
            <button
              type="button"
              className="b s"
              onClick={() => {
                if (!qText.trim() || !qOpt0.trim() || !qOpt1.trim() || !qOpt2.trim()) return;
                const nextGames = {
                  ...cms.games,
                  quizzes: {
                    ...cms.games.quizzes,
                    [quizSubjectKey]: [{ q: qText.trim(), opts: [qOpt0.trim(), qOpt1.trim(), qOpt2.trim()], ans: qAns }, ...cms.games.quizzes[quizSubjectKey]],
                  },
                };
                persistSlice('games', nextGames, 'Quiz question added');
                setQText(''); setQOpt0(''); setQOpt1(''); setQOpt2('');
              }}
            >
              Add Question
            </button>
          </div>
          {cms.games.quizzes[quizSubjectKey].slice(0, 6).map((q, idx) => (
            <div key={idx} className="al" style={{ justifyContent: 'space-between' }}>
              <span>{q.q}</span>
              <button
                className="b s"
                onClick={() => {
                  const nextGames = {
                    ...cms.games,
                    quizzes: {
                      ...cms.games.quizzes,
                      [quizSubjectKey]: cms.games.quizzes[quizSubjectKey].filter((_, i) => i !== idx),
                    },
                  };
                  persistSlice('games', nextGames, 'Question removed');
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Memory Pairs ({cms.games.memoryPairs.length}) &amp; Word Scramble ({cms.games.wordScramble.length})</h2>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <input type="text" value={memSw} onChange={(e) => setMemSw(e.target.value)} placeholder="Kiswahili" />
            <input type="text" value={memEn} onChange={(e) => setMemEn(e.target.value)} placeholder="English" />
            <button
              type="button"
              className="b s"
              onClick={() => {
                if (!memSw.trim() || !memEn.trim()) return;
                persistSlice('games', { ...cms.games, memoryPairs: [[memSw.trim(), memEn.trim()], ...cms.games.memoryPairs] }, 'Memory pair');
                setMemSw(''); setMemEn('');
              }}
            >
              Add Pair
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
            <input type="text" value={scrWord} onChange={(e) => setScrWord(e.target.value)} placeholder="WORD" />
            <input type="text" value={scrHint} onChange={(e) => setScrHint(e.target.value)} placeholder="Hint" />
            <button
              type="button"
              className="b s"
              onClick={() => {
                if (!scrWord.trim() || !scrHint.trim()) return;
                persistSlice('games', { ...cms.games, wordScramble: [{ word: scrWord.trim().toUpperCase(), hint: scrHint.trim() }, ...cms.games.wordScramble] }, 'Scramble word');
                setScrWord(''); setScrHint('');
              }}
            >
              Add Word
            </button>
          </div>
          <p className="mu" style={{ fontSize: '0.85rem' }}>
            Latest pairs: {cms.games.memoryPairs.slice(0, 4).map(([a, b]) => `${a}=${b}`).join(', ')}
          </p>
          <p className="mu" style={{ fontSize: '0.85rem' }}>
            Latest words: {cms.games.wordScramble.slice(0, 5).map((w) => w.word).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
