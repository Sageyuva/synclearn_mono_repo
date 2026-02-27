import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLessons, getQuizForLesson, submitQuiz, getAnnouncements } from '../api/missionService';
import { showToast } from '../utils/toast';

// ─── Quiz Modal ────────────────────────────────────────────────────────────────
const QuizModal = ({ lesson, onClose }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        getQuizForLesson(lesson._id)
            .then(res => {
                setQuiz(res.data);
                setAnswers(new Array(res.data.questions.length).fill(null));
            })
            .catch(() => { showToast.error('Could not load quiz.'); onClose(); })
            .finally(() => setLoading(false));
    }, [lesson._id, onClose]);

    const handleSelect = (qi, oi) =>
        setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            showToast.alert('Answer all questions before submitting.'); return;
        }
        setSubmitting(true);
        try {
            const res = await submitQuiz(quiz._id, answers);
            setResult(res.data);
            showToast.success(`Score: ${res.data.score}/${res.data.total}`);
        } catch { } finally { setSubmitting(false); }
    };

    const OPTS = ['A', 'B', 'C', 'D'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,7,18,0.92)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                    <div>
                        <p className="text-xs text-emerald-400 mb-0.5">Quiz · {lesson.category}</p>
                        <h2 className="text-lg font-bold text-white">{lesson.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/30 hover:text-white/70 cursor-pointer text-xl ml-4">✕</button>
                </div>

                <div className="p-6">
                    {result ? (
                        /* ── Result screen ── */
                        <div className="text-center py-10">
                            <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent mb-2">
                                {result.score}/{result.total}
                            </div>
                            <p className="text-white/50 text-sm mb-6">Assessment complete</p>
                            <div className="w-full rounded-full h-2.5 bg-white/5 mb-6">
                                <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-1000"
                                    style={{ width: `${(result.score / result.total) * 100}%` }} />
                            </div>
                            <p className="text-sm text-white/40 mb-8">
                                {result.score === result.total ? '🏆 Perfect! Outstanding work.' :
                                    result.score >= 3 ? '✅ Well done! Mission accomplished.' : '📚 Keep studying. You can do better!'}
                            </p>
                            <button onClick={onClose}
                                className="px-8 py-3 rounded-xl font-semibold cursor-pointer bg-gradient-to-r from-emerald-600 to-violet-600 text-white text-sm">
                                Close
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center py-16">
                            <svg className="animate-spin w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : quiz ? (
                        <>
                            {quiz.questions.map((q, qi) => (
                                <div key={qi} className="mb-5 p-4 rounded-xl border border-white/8 bg-white/2">
                                    <p className="text-xs text-emerald-400 mb-1">Question {qi + 1}</p>
                                    <p className="text-white font-semibold text-sm mb-3">{q.questionText}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {q.options.map((opt, oi) => {
                                            const selected = answers[qi] === oi;
                                            return (
                                                <button key={oi} onClick={() => handleSelect(qi, oi)}
                                                    className={`text-left px-4 py-2.5 rounded-lg text-sm border cursor-pointer transition-all ${selected
                                                            ? 'border-violet-500 bg-violet-500/15 text-violet-300'
                                                            : 'border-white/8 bg-white/2 text-white/60 hover:border-white/20 hover:text-white/80'
                                                        }`}>
                                                    <span className={`font-mono mr-2 ${selected ? 'text-violet-400' : 'text-emerald-400/60'}`}>
                                                        {OPTS[oi]}.
                                                    </span>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleSubmit} disabled={submitting}
                                className="w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 bg-gradient-to-r from-emerald-600 to-violet-600 text-white mt-2">
                                {submitting ? 'Submitting…' : 'Submit Assessment'}
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-white/30 py-12 text-sm">No quiz attached to this lesson yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Lesson Modal ──────────────────────────────────────────────────────────────
const LessonModal = ({ lesson, onClose, onStartQuiz }) => (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(3,7,18,0.88)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-start justify-between px-6 py-5 border-b border-white/8">
                <div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                        {lesson.category}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{lesson.title}</h2>
                    {lesson.teacherId && (
                        <p className="text-sm text-white/35 mt-1">by {lesson.teacherId.name} · {lesson.teacherId.subject}</p>
                    )}
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-white/70 cursor-pointer text-xl ml-4 shrink-0">✕</button>
            </div>
            <div className="px-6 py-5">
                <p className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
                <button onClick={onStartQuiz}
                    className="mt-8 w-full py-3.5 rounded-xl font-semibold text-sm cursor-pointer bg-gradient-to-r from-emerald-600 to-violet-600 text-white hover:from-emerald-500 hover:to-violet-500 transition-all">
                    Start Quiz →
                </button>
            </div>
        </div>
    </div>
);

// ─── Lesson Card ───────────────────────────────────────────────────────────────
const LessonCard = ({ lesson, onOpen }) => (
    <div onClick={() => onOpen(lesson)}
        className="group p-5 rounded-2xl border border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15 cursor-pointer transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                {lesson.category}
            </span>
            {lesson.isActive && (
                <span className="text-xs flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
            )}
        </div>
        <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-emerald-300 transition-colors">{lesson.title}</h3>
        <p className="text-white/35 text-xs line-clamp-2 mb-4">{lesson.content?.slice(0, 120)}…</p>
        {lesson.teacherId && (
            <p className="text-xs text-white/25">{lesson.teacherId.name} · {lesson.teacherId.subject}</p>
        )}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-white/30">Open lesson</span>
            <span className="text-violet-400 text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
    </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────
const MissionsPage = () => {
    const navigate = useNavigate();
    const [lessons, setLessons] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [quizLesson, setQuizLesson] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const load = useCallback(async () => {
        try {
            const [lesRes, annRes] = await Promise.all([getAllLessons(), getAnnouncements()]);
            setLessons(lesRes.data || []);
            setAnnouncements(annRes.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = lessons.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Top bar */}
            <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/home')} className="text-white/40 hover:text-white/70 cursor-pointer text-sm transition-colors">← Home</button>
                        <span className="text-white/15">|</span>
                        <span className="font-semibold text-white text-sm">My Lessons</span>
                    </div>
                    <span className="text-xs text-white/30">{user.name}</span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-5 py-8">

                {/* Announcements strip */}
                {announcements.length > 0 && (
                    <div className="mb-8 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                            </span>
                            <p className="text-xs font-semibold text-violet-300">Admin Broadcasts</p>
                        </div>
                        <div className="space-y-2">
                            {announcements.slice(0, 2).map(a => (
                                <div key={a._id} className="text-sm">
                                    <span className="font-medium text-white">{a.title}: </span>
                                    <span className="text-white/55">{a.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Title + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Lessons</h1>
                        <p className="text-white/35 text-sm mt-0.5">{filtered.length} available</p>
                    </div>
                    <input
                        type="text"
                        placeholder="Search lessons…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none border border-white/10 bg-white/5 focus:border-emerald-500 transition-colors w-full sm:w-64"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-44 rounded-2xl animate-pulse bg-white/3 border border-white/5" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-4xl mb-3">📚</p>
                        <p className="text-white/25 text-sm">No lessons found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(lesson => (
                            <LessonCard key={lesson._id} lesson={lesson} onOpen={setSelectedLesson} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedLesson && !quizLesson && (
                <LessonModal lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    onStartQuiz={() => { setQuizLesson(selectedLesson); setSelectedLesson(null); }} />
            )}
            {quizLesson && (
                <QuizModal lesson={quizLesson} onClose={() => setQuizLesson(null)} />
            )}
        </div>
    );
};

export default MissionsPage;
