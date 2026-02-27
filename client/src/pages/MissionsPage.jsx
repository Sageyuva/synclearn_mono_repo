import React, { useState, useEffect, useCallback } from 'react';
import { getAllLessons, getQuizForLesson, submitQuiz, getAnnouncements } from '../api/missionService';
import { showToast } from '../utils/toast';

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
const QuizModal = ({ lesson, onClose }) => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getQuizForLesson(lesson._id);
                setQuiz(res.data);
                setAnswers(new Array(res.data.questions.length).fill(null));
            } catch {
                showToast.error('Could not load quiz.');
                onClose();
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [lesson._id, onClose]);

    const handleSelect = (qIdx, optIdx) => {
        setAnswers(prev => {
            const next = [...prev];
            next[qIdx] = optIdx;
            return next;
        });
    };

    const handleSubmit = async () => {
        if (answers.some(a => a === null)) {
            showToast.alert('Answer all 5 questions before submitting.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await submitQuiz(quiz._id, answers);
            setResult(res.data);
            showToast.success(`Assessment complete! Score: ${res.data.score}/${res.data.total}`);
        } catch {
            // interceptor handles toast
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(3,7,18,0.92)', backdropFilter: 'blur(8px)' }}>
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border"
                style={{ background: '#0a0f1e', borderColor: '#B22222', boxShadow: '0 0 40px rgba(178,34,34,0.3)' }}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#B22222' }}>
                    <div>
                        <p className="text-xs font-mono mb-1" style={{ color: '#FFD700' }}>ASSESSMENT MODULE</p>
                        <h2 className="text-xl font-bold text-white">{lesson.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white/80 cursor-pointer text-2xl">✕</button>
                </div>

                <div className="p-6">
                    {/* Result screen */}
                    {result ? (
                        <div className="text-center py-12">
                            <div className="text-6xl font-black mb-4" style={{ color: '#FFD700' }}>
                                {result.score}/{result.total}
                            </div>
                            <p className="text-white/60 mb-2">Assessment Score</p>
                            <div className="w-full rounded-full h-3 mt-4 mb-6 bg-white/5">
                                <div className="h-3 rounded-full transition-all duration-1000"
                                    style={{ width: `${(result.score / result.total) * 100}%`, background: 'linear-gradient(90deg,#B22222,#FFD700)' }} />
                            </div>
                            <p className="text-sm text-white/40">
                                {result.score === result.total ? '🏆 Perfect score! Outstanding.' :
                                    result.score >= 3 ? '✅ Mission accomplished.' : '⚠️ Needs improvement. Review the lesson.'}
                            </p>
                            <button onClick={onClose}
                                className="mt-8 px-8 py-3 rounded-xl font-semibold cursor-pointer"
                                style={{ background: '#B22222', color: '#FFD700' }}>
                                Close Debrief
                            </button>
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center py-16">
                            <svg className="animate-spin w-10 h-10" style={{ color: '#FFD700' }} fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : quiz ? (
                        <>
                            {quiz.questions.map((q, qi) => (
                                <div key={qi} className="mb-6 p-4 rounded-xl border"
                                    style={{ borderColor: 'rgba(178,34,34,0.3)', background: 'rgba(178,34,34,0.05)' }}>
                                    <p className="text-sm font-mono mb-1" style={{ color: '#FFD700' }}>Q{qi + 1}</p>
                                    <p className="text-white font-medium mb-4">{q.questionText}</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {q.options.map((opt, oi) => (
                                            <button key={oi} onClick={() => handleSelect(qi, oi)}
                                                className="text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 cursor-pointer border"
                                                style={{
                                                    borderColor: answers[qi] === oi ? '#FFD700' : 'rgba(255,255,255,0.1)',
                                                    background: answers[qi] === oi ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                                                    color: answers[qi] === oi ? '#FFD700' : 'rgba(255,255,255,0.7)',
                                                }}>
                                                <span className="font-mono mr-2" style={{ color: '#B22222' }}>
                                                    {['A', 'B', 'C', 'D'][oi]}.
                                                </span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={handleSubmit} disabled={submitting}
                                className="w-full py-4 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #B22222, #8B0000)', color: '#FFD700', border: '1px solid #FFD700' }}>
                                {submitting ? 'Transmitting Results…' : '▶  SUBMIT ASSESSMENT'}
                            </button>
                        </>
                    ) : (
                        <p className="text-center text-white/40 py-12">No quiz found for this mission.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Lesson Viewer Modal ──────────────────────────────────────────────────────
const LessonModal = ({ lesson, onClose, onStartQuiz }) => (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: 'rgba(3,7,18,0.88)', backdropFilter: 'blur(6px)' }}>
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border"
            style={{ background: '#0a0f1e', borderColor: '#FFD700', boxShadow: '0 0 40px rgba(255,215,0,0.15)' }}>
            <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'rgba(255,215,0,0.2)' }}>
                <div>
                    <p className="text-xs font-mono mb-1" style={{ color: '#B22222' }}>
                        ◉ MISSION BRIEFING · {lesson.category.toUpperCase()}
                    </p>
                    <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
                    {lesson.teacherId && (
                        <p className="text-sm mt-1 text-white/40">
                            by {lesson.teacherId.name} · {lesson.teacherId.subject}
                        </p>
                    )}
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white/80 cursor-pointer text-2xl ml-4 shrink-0">✕</button>
            </div>
            <div className="p-6">
                <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm">
                    {lesson.content}
                </div>
                <button onClick={onStartQuiz}
                    className="mt-8 w-full py-4 rounded-xl font-bold text-sm cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#B22222,#8B0000)', color: '#FFD700', border: '1px solid #FFD700', boxShadow: '0 0 20px rgba(178,34,34,0.4)' }}>
                    ▶  START ASSESSMENT
                </button>
            </div>
        </div>
    </div>
);

// ─── Mission Card ─────────────────────────────────────────────────────────────
const MissionCard = ({ lesson, onOpen }) => (
    <div onClick={() => onOpen(lesson)}
        className="relative group rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden"
        style={{
            background: 'linear-gradient(135deg, rgba(10,15,30,0.95), rgba(15,20,40,0.95))',
            borderColor: lesson.isActive ? '#B22222' : 'rgba(255,255,255,0.08)',
            boxShadow: lesson.isActive ? '0 0 20px rgba(178,34,34,0.2)' : 'none',
        }}>
        {/* Glow top bar active missions */}
        {lesson.isActive && (
            <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, transparent, #B22222, #FFD700, #B22222, transparent)' }} />
        )}
        <div className="p-5">
            <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded"
                    style={{ background: 'rgba(178,34,34,0.15)', color: '#FFD700', border: '1px solid rgba(178,34,34,0.3)' }}>
                    {lesson.category}
                </span>
                {lesson.isActive && (
                    <span className="text-xs font-mono flex items-center gap-1" style={{ color: '#B22222' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        ACTIVE
                    </span>
                )}
            </div>
            <h3 className="text-white font-bold text-base mb-2 group-hover:text-yellow-400 transition-colors">
                {lesson.title}
            </h3>
            <p className="text-white/40 text-sm line-clamp-2 mb-4">
                {lesson.content?.slice(0, 120)}…
            </p>
            {lesson.teacherId && (
                <p className="text-xs text-white/30 font-mono">
                    ↳ {lesson.teacherId.name} · {lesson.teacherId.subject}
                </p>
            )}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/30">View Briefing</span>
                <span style={{ color: '#FFD700' }}>→</span>
            </div>
        </div>
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const MissionsPage = () => {
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
        } catch {
            // interceptor handles toast
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = lessons.filter(l =>
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen" style={{ background: '#030712', color: 'white' }}>

            {/* HUD Top Bar */}
            <div className="border-b px-6 py-4 flex items-center justify-between"
                style={{ borderColor: 'rgba(178,34,34,0.3)', background: 'rgba(10,15,30,0.8)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: '#B22222', boxShadow: '0 0 12px rgba(178,34,34,0.5)' }}>
                        <span className="text-sm font-black" style={{ color: '#FFD700' }}>S</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white">MISSION HUD</p>
                        <p className="text-xs font-mono" style={{ color: '#B22222' }}>SyncLearn Student Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-white/30">
                        AGENT: <span className="text-white/60">{user.name?.toUpperCase() || 'UNKNOWN'}</span>
                    </span>
                    <button
                        onClick={() => { localStorage.clear(); window.location.replace('/login'); }}
                        className="text-xs px-3 py-1.5 rounded-lg cursor-pointer border"
                        style={{ borderColor: 'rgba(178,34,34,0.4)', color: '#B22222' }}>
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">

                {/* Announcements Banner */}
                {announcements.length > 0 && (
                    <div className="mb-8 rounded-xl border p-4 overflow-hidden"
                        style={{ borderColor: '#FFD700', background: 'rgba(255,215,0,0.05)', boxShadow: '0 0 20px rgba(255,215,0,0.08)' }}>
                        <p className="text-xs font-mono mb-2" style={{ color: '#FFD700' }}>📡 GLOBAL BROADCAST</p>
                        {announcements.slice(0, 2).map(a => (
                            <div key={a._id} className="mb-1">
                                <span className="font-semibold text-white text-sm">{a.title}: </span>
                                <span className="text-white/60 text-sm">{a.message}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Title + Search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-white">
                            ACTIVE <span style={{ color: '#FFD700' }}>MISSIONS</span>
                        </h1>
                        <p className="text-white/40 text-sm mt-1 font-mono">
                            {filtered.length} briefings available
                        </p>
                    </div>
                    <input
                        type="text"
                        placeholder="Search missions…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/20 outline-none border w-full sm:w-72"
                        style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(178,34,34,0.3)' }}
                    />
                </div>

                {/* Missions Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 rounded-xl animate-pulse"
                                style={{ background: 'rgba(178,34,34,0.05)', border: '1px solid rgba(178,34,34,0.1)' }} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-5xl mb-4">🛸</p>
                        <p className="font-mono text-white/30">NO MISSIONS FOUND</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(lesson => (
                            <MissionCard key={lesson._id} lesson={lesson} onOpen={setSelectedLesson} />
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedLesson && !quizLesson && (
                <LessonModal
                    lesson={selectedLesson}
                    onClose={() => setSelectedLesson(null)}
                    onStartQuiz={() => { setQuizLesson(selectedLesson); setSelectedLesson(null); }}
                />
            )}
            {quizLesson && (
                <QuizModal
                    lesson={quizLesson}
                    onClose={() => setQuizLesson(null)}
                />
            )}
        </div>
    );
};

export default MissionsPage;
