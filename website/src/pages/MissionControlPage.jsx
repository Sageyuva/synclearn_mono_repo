import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { getAllLessons, createLesson, deleteLesson, getQuizForLesson, createQuiz, deleteQuiz } from '../api/missionService';
import { showToast } from '../utils/toast';

const EMPTY_QUESTION = () => ({ questionText: '', options: ['', '', '', ''], correctAns: 0 });
const EMPTY_QUIZ = () => Array.from({ length: 5 }, EMPTY_QUESTION);

// ─── Quiz Builder ─────────────────────────────────────────────────────────────
const QuizBuilder = ({ lessonId, existingQuiz, onDone }) => {
    const [questions, setQuestions] = useState(existingQuiz ? existingQuiz.questions : EMPTY_QUIZ());
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const updateQ = (qi, field, value) =>
        setQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q));

    const updateOpt = (qi, oi, value) =>
        setQuestions(prev => {
            const next = [...prev];
            const opts = [...next[qi].options];
            opts[oi] = value;
            next[qi] = { ...next[qi], options: opts };
            return next;
        });

    const handleSave = async () => {
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].questionText.trim()) { showToast.alert(`Q${i + 1}: Enter question text.`); return; }
            if (questions[i].options.some(o => !o.trim())) { showToast.alert(`Q${i + 1}: Fill all 4 options.`); return; }
        }
        setSaving(true);
        try {
            await createQuiz({ lessonId, questions });
            showToast.success('Quiz created successfully!');
            onDone();
        } catch { } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteQuiz(existingQuiz._id);
            showToast.success('Quiz deleted.');
            onDone();
        } catch { } finally { setDeleting(false); }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 outline-none focus:border-violet-500 transition-all";

    return (
        <div className="mt-4 space-y-4">
            {questions.map((q, qi) => (
                <div key={qi} className="p-4 rounded-xl border border-white/8 bg-white/2">
                    <p className="text-xs text-white/40 mb-2">Question {qi + 1}</p>
                    <input
                        className={inputCls + ' mb-3 text-sm'}
                        placeholder="Question text…"
                        value={q.questionText}
                        onChange={e => updateQ(qi, 'questionText', e.target.value)}
                        disabled={!!existingQuiz}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                                <button
                                    onClick={() => !existingQuiz && updateQ(qi, 'correctAns', oi)}
                                    disabled={!!existingQuiz}
                                    className="w-4 h-4 rounded-full border-2 shrink-0"
                                    style={{
                                        borderColor: q.correctAns === oi ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                                        background: q.correctAns === oi ? '#8b5cf6' : 'transparent'
                                    }}
                                />
                                <input
                                    className={inputCls}
                                    placeholder={`Option ${['A', 'B', 'C', 'D'][oi]}`}
                                    value={opt}
                                    onChange={e => updateOpt(qi, oi, e.target.value)}
                                    disabled={!!existingQuiz}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div>
                {!existingQuiz ? (
                    <button onClick={handleSave} disabled={saving}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 bg-gradient-to-r from-violet-600 to-purple-600 text-white transition-all">
                        {saving ? 'Saving quiz…' : 'Save Quiz'}
                    </button>
                ) : (
                    <button onClick={handleDelete} disabled={deleting}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all">
                        {deleting ? 'Deleting…' : 'Delete Quiz'}
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── Lesson Card ──────────────────────────────────────────────────────────────
const LessonCard = ({ lesson, onDelete, onRefresh }) => {
    const [expanded, setExpanded] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const loadQuiz = async () => {
        if (quiz !== null) return;
        setLoadingQuiz(true);
        try {
            const res = await getQuizForLesson(lesson._id);
            setQuiz(res.data);
        } catch { setQuiz(undefined); }
        finally { setLoadingQuiz(false); }
    };

    const toggle = () => { if (!expanded) loadQuiz(); setExpanded(p => !p); };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteLesson(lesson._id);
            showToast.success('Lesson deleted.');
            onDelete(lesson._id);
        } catch { } finally { setDeleting(false); }
    };

    return (
        <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                            {lesson.category}
                        </span>
                        {lesson.isActive && (
                            <span className="text-xs flex items-center gap-1 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live
                            </span>
                        )}
                    </div>
                    <h3 className="font-semibold text-white text-sm">{lesson.title}</h3>
                    <p className="text-white/35 text-xs mt-1 line-clamp-2">{lesson.content?.slice(0, 120)}…</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button onClick={toggle}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors">
                        {expanded ? 'Close' : 'Quiz'}
                    </button>
                    <button onClick={handleDelete} disabled={deleting}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 disabled:opacity-40 transition-colors">
                        {deleting ? '…' : 'Del'}
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="px-5 pb-5 border-t border-white/8">
                    {loadingQuiz ? (
                        <p className="text-white/30 text-xs py-4">Loading quiz…</p>
                    ) : (
                        <QuizBuilder lessonId={lesson._id} existingQuiz={quiz || null}
                            onDone={() => { setQuiz(null); loadQuiz(); onRefresh(); }} />
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const MissionControlPage = () => {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', content: '', category: '' });
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const load = useCallback(async () => {
        try {
            const res = await getAllLessons();
            setLessons(res.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title || !form.content || !form.category) {
            showToast.alert('All fields are required.'); return;
        }
        setCreating(true);
        try {
            const res = await createLesson(form);
            setLessons(prev => [res.data, ...prev]);
            setForm({ title: '', content: '', category: '' });
            setShowForm(false);
            showToast.success('Lesson created!');
        } catch { } finally { setCreating(false); }
    };

    const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-emerald-500 transition-all";

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Mission Control</h1>
                        <p className="text-white/40 text-sm mt-1">Deploy lessons and build quizzes for students.</p>
                    </div>
                    <button onClick={() => setShowForm(p => !p)}
                        className="text-sm px-4 py-2 rounded-xl cursor-pointer font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all">
                        {showForm ? '✕ Cancel' : '+ New Lesson'}
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <form onSubmit={handleCreate}
                        className="glass-card border border-white/10 rounded-2xl p-6 mb-6">
                        <h2 className="text-base font-semibold text-white mb-4">New Lesson</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input className={inputCls} placeholder="Title *"
                                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                            <input className={inputCls} placeholder="Category (e.g. Math) *"
                                value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required />
                        </div>
                        <textarea className={`${inputCls} resize-none`} rows={5}
                            placeholder="Lesson content… *"
                            value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
                        <button type="submit" disabled={creating}
                            className="mt-4 w-full py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white transition-all">
                            {creating ? 'Creating…' : 'Create Lesson'}
                        </button>
                    </form>
                )}

                {/* Lessons List */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-white/40">{lessons.length} lessons total</p>
                    <button onClick={load} className="text-xs text-white/30 hover:text-white/60 cursor-pointer transition-colors">↻ Refresh</button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 rounded-2xl animate-pulse bg-white/3 border border-white/5" />
                        ))}
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="glass-card border border-white/10 rounded-2xl p-12 text-center text-white/20 text-sm">
                        No lessons yet. Create your first one above.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lessons.map(lesson => (
                            <LessonCard key={lesson._id} lesson={lesson}
                                onDelete={id => setLessons(prev => prev.filter(l => l._id !== id))}
                                onRefresh={load} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MissionControlPage;
