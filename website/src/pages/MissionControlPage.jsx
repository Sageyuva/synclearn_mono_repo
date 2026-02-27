import React, { useState, useEffect, useCallback } from 'react';
import { getAllLessons, createLesson, deleteLesson, getQuizForLesson, createQuiz, deleteQuiz } from '../api/missionService';
import { showToast } from '../utils/toast';

// ─── Quiz Builder ─────────────────────────────────────────────────────────────
const EMPTY_QUESTION = () => ({ questionText: '', options: ['', '', '', ''], correctAns: 0 });
const EMPTY_QUIZ = () => Array.from({ length: 5 }, EMPTY_QUESTION);

const QuizBuilder = ({ lessonId, existingQuiz, onDone }) => {
    const [questions, setQuestions] = useState(existingQuiz ? existingQuiz.questions : EMPTY_QUIZ());
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const updateQ = (qi, field, value) => {
        setQuestions(prev => {
            const next = prev.map((q, i) => i === qi ? { ...q, [field]: value } : q);
            return next;
        });
    };
    const updateOpt = (qi, oi, value) => {
        setQuestions(prev => {
            const next = [...prev];
            const opts = [...next[qi].options];
            opts[oi] = value;
            next[qi] = { ...next[qi], options: opts };
            return next;
        });
    };

    const handleSave = async () => {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) { showToast.alert(`Q${i + 1}: Enter question text.`); return; }
            if (q.options.some(o => !o.trim())) { showToast.alert(`Q${i + 1}: Fill all 4 options.`); return; }
        }
        setSaving(true);
        try {
            await createQuiz({ lessonId, questions });
            showToast.success('Quiz uploaded successfully!');
            onDone();
        } catch { } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        if (!existingQuiz) return;
        setDeleting(true);
        try {
            await deleteQuiz(existingQuiz._id);
            showToast.success('Quiz deleted.');
            onDone();
        } catch { } finally { setDeleting(false); }
    };

    return (
        <div className="mt-4 space-y-4">
            {questions.map((q, qi) => (
                <div key={qi} className="p-4 rounded-xl border" style={{ borderColor: 'rgba(178,34,34,0.3)', background: 'rgba(178,34,34,0.04)' }}>
                    <p className="text-xs font-mono mb-2" style={{ color: '#FFD700' }}>QUESTION {qi + 1}</p>
                    <input
                        className="w-full bg-transparent border rounded-lg px-3 py-2 text-sm text-white outline-none mb-3"
                        style={{ borderColor: 'rgba(255,255,255,0.12)' }}
                        placeholder="Enter question text…"
                        value={q.questionText}
                        onChange={e => updateQ(qi, 'questionText', e.target.value)}
                        disabled={!!existingQuiz}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                                <button
                                    onClick={() => !existingQuiz && updateQ(qi, 'correctAns', oi)}
                                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                                    style={{ borderColor: q.correctAns === oi ? '#FFD700' : 'rgba(255,255,255,0.2)', background: q.correctAns === oi ? '#FFD700' : 'transparent' }}
                                    disabled={!!existingQuiz}
                                />
                                <input
                                    className="flex-1 bg-transparent border rounded-lg px-3 py-1.5 text-xs text-white outline-none"
                                    style={{ borderColor: 'rgba(255,255,255,0.1)' }}
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
            <div className="flex gap-3">
                {!existingQuiz ? (
                    <button onClick={handleSave} disabled={saving}
                        className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50"
                        style={{ background: '#B22222', color: '#FFD700' }}>
                        {saving ? 'Uploading…' : '▶  UPLOAD QUIZ'}
                    </button>
                ) : (
                    <button onClick={handleDelete} disabled={deleting}
                        className="flex-1 py-3 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50 border"
                        style={{ borderColor: '#B22222', color: '#B22222' }}>
                        {deleting ? 'Deleting…' : '✕  DELETE QUIZ'}
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
        } catch {
            setQuiz(undefined);
        } finally { setLoadingQuiz(false); }
    };

    const toggle = () => {
        if (!expanded) loadQuiz();
        setExpanded(p => !p);
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteLesson(lesson._id);
            showToast.success('Mission deleted.');
            onDelete(lesson._id);
        } catch { } finally { setDeleting(false); }
    };

    return (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(178,34,34,0.3)', background: '#0a0f1e' }}>
            <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono px-2 py-0.5 rounded"
                            style={{ background: 'rgba(178,34,34,0.15)', color: '#FFD700', border: '1px solid rgba(178,34,34,0.3)' }}>
                            {lesson.category}
                        </span>
                        {lesson.isActive && (
                            <span className="text-xs font-mono flex items-center gap-1" style={{ color: '#B22222' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />LIVE
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold">{lesson.title}</h3>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{lesson.content?.slice(0, 100)}…</p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <button onClick={toggle}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border transition-colors"
                        style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700' }}>
                        {expanded ? 'COLLAPSE' : 'QUIZ'}
                    </button>
                    <button onClick={handleDelete} disabled={deleting}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border transition-colors disabled:opacity-40"
                        style={{ borderColor: 'rgba(178,34,34,0.4)', color: '#B22222' }}>
                        {deleting ? '…' : 'DEL'}
                    </button>
                </div>
            </div>
            {expanded && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(178,34,34,0.15)' }}>
                    {loadingQuiz ? (
                        <p className="text-white/30 text-xs py-4 font-mono">LOADING QUIZ DATA…</p>
                    ) : (
                        <QuizBuilder lessonId={lesson._id} existingQuiz={quiz || null} onDone={() => { setQuiz(null); loadQuiz(); onRefresh(); }} />
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

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const load = useCallback(async () => {
        try {
            const res = await getAllLessons();
            setLessons(res.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim() || !form.category.trim()) {
            showToast.alert('All fields are required.'); return;
        }
        setCreating(true);
        try {
            const res = await createLesson(form);
            setLessons(prev => [res.data, ...prev]);
            setForm({ title: '', content: '', category: '' });
            setShowForm(false);
            showToast.success('Mission deployed successfully!');
        } catch { } finally { setCreating(false); }
    };

    return (
        <div className="min-h-screen" style={{ background: '#030712', color: 'white' }}>
            {/* Top Bar */}
            <div className="border-b px-6 py-4 flex items-center justify-between"
                style={{ borderColor: 'rgba(178,34,34,0.3)', background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#B22222', boxShadow: '0 0 12px rgba(178,34,34,0.5)' }}>
                        <span style={{ color: '#FFD700' }} className="font-black text-sm">M</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">MISSION CONTROL</p>
                        <p className="text-xs font-mono" style={{ color: '#B22222' }}>Teacher Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30 hidden sm:block">
                        {user.name?.toUpperCase()}
                    </span>
                    <button onClick={() => setShowForm(p => !p)}
                        className="text-xs px-4 py-2 rounded-lg cursor-pointer font-bold"
                        style={{ background: '#B22222', color: '#FFD700' }}>
                        {showForm ? '✕ CANCEL' : '+ NEW MISSION'}
                    </button>
                    <button onClick={() => { localStorage.clear(); window.location.replace('/login'); }}
                        className="text-xs px-3 py-2 rounded-lg cursor-pointer border"
                        style={{ borderColor: 'rgba(178,34,34,0.4)', color: '#B22222' }}>
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Create Form */}
                {showForm && (
                    <form onSubmit={handleCreate}
                        className="mb-8 p-6 rounded-2xl border"
                        style={{ borderColor: '#FFD700', background: 'rgba(255,215,0,0.03)', boxShadow: '0 0 30px rgba(255,215,0,0.05)' }}>
                        <p className="text-xs font-mono mb-4" style={{ color: '#FFD700' }}>◉ DEPLOY NEW MISSION</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <input
                                className="bg-transparent border rounded-xl px-4 py-3 text-sm text-white outline-none col-span-full"
                                style={{ borderColor: 'rgba(178,34,34,0.4)' }}
                                placeholder="Mission Title *"
                                value={form.title}
                                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                required
                            />
                            <input
                                className="bg-transparent border rounded-xl px-4 py-3 text-sm text-white outline-none"
                                style={{ borderColor: 'rgba(178,34,34,0.4)' }}
                                placeholder="Category (e.g. Math, Science) *"
                                value={form.category}
                                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                required
                            />
                        </div>
                        <textarea
                            className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                            style={{ borderColor: 'rgba(178,34,34,0.4)' }}
                            placeholder="Mission content / lesson briefing text… *"
                            rows={6}
                            value={form.content}
                            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                            required
                        />
                        <button type="submit" disabled={creating}
                            className="mt-4 w-full py-3 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg,#B22222,#8B0000)', color: '#FFD700', border: '1px solid #FFD700' }}>
                            {creating ? 'Deploying…' : '▶  DEPLOY MISSION'}
                        </button>
                    </form>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-white">
                            DEPLOYED <span style={{ color: '#FFD700' }}>MISSIONS</span>
                        </h1>
                        <p className="text-white/30 text-xs font-mono mt-0.5">{lessons.length} total</p>
                    </div>
                    <button onClick={load}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border"
                        style={{ borderColor: 'rgba(255,215,0,0.3)', color: '#FFD700' }}>
                        ↻ REFRESH
                    </button>
                </div>

                {/* Lesson List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 rounded-xl animate-pulse"
                                style={{ background: 'rgba(178,34,34,0.05)', border: '1px solid rgba(178,34,34,0.1)' }} />
                        ))}
                    </div>
                ) : lessons.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-4xl mb-3">📡</p>
                        <p className="font-mono text-white/30 text-sm">NO MISSIONS DEPLOYED YET</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {lessons.map(lesson => (
                            <LessonCard
                                key={lesson._id}
                                lesson={lesson}
                                onDelete={id => setLessons(prev => prev.filter(l => l._id !== id))}
                                onRefresh={load}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionControlPage;
