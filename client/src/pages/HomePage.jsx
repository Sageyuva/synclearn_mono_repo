import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnnouncements } from '../api/missionService';
import { getRank } from '../utils/rankUtils';

// ─── Broadcast Feed ────────────────────────────────────────────────────────────
const BroadcastFeed = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnnouncements()
            .then(res => setAnnouncements(res.data || []))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="glass-card border border-white/10 rounded-2xl p-5 animate-pulse">
                <div className="h-3 w-24 bg-white/10 rounded mb-4" />
                <div className="space-y-3">
                    {[1, 2].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card border border-white/10 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/8 flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
                </span>
                <p className="text-sm font-semibold text-white">Admin Broadcasts</p>
                {announcements.length > 0 && (
                    <span className="ml-auto text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/20">
                        {announcements.length} active
                    </span>
                )}
            </div>

            {/* List */}
            {announcements.length === 0 ? (
                <div className="px-5 py-8 text-center text-white/25 text-sm">
                    No broadcasts yet. Check back soon.
                </div>
            ) : (
                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                    {announcements.map(a => (
                        <div key={a._id} className="px-5 py-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-sm">📡</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-sm mb-0.5">{a.title}</p>
                                    <p className="text-white/55 text-sm leading-relaxed">{a.message}</p>
                                    <p className="text-white/25 text-xs mt-1.5">
                                        {new Date(a.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main HomePage ─────────────────────────────────────────────────────────────
const HomePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        window.location.replace('/login');
    };

    const QUICK_LINKS = [
        { label: 'My Missions', icon: '🎯', path: '/missions', desc: 'View lessons & take quizzes' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            {/* Top bar */}
            <header className="border-b border-white/8 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center font-black text-sm text-white">S</div>
                        <span className="font-semibold text-white text-sm">SyncLearn</span>
                    </div>
                    <button onClick={handleLogout}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400/70 hover:text-red-400 hover:border-red-500/40 cursor-pointer transition-colors">
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                        Welcome back, {user.name?.split(' ')[0] || 'Student'}! 👋
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Here's what's happening in your school today.</p>
                </div>

                {/* Broadcasts */}
                <BroadcastFeed />

                {/* Quick nav */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {QUICK_LINKS.map(link => (
                        <button key={link.path} onClick={() => navigate(link.path)}
                            className="group text-left p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 cursor-pointer transition-all duration-200">
                            <div className="text-2xl mb-3">{link.icon}</div>
                            <p className="font-semibold text-white text-sm mb-0.5">{link.label}</p>
                            <p className="text-white/40 text-xs">{link.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Student info */}
                <div className="glass-card border border-white/10 rounded-2xl px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/40 text-xs mb-0.5">Logged in as</p>
                            <p className="font-medium text-sm text-white">{user.name || user.email}</p>
                            <p className="text-white/30 text-xs">{user.email} · Class {user.class}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-xs mb-1">Total XP</p>
                            <p className="text-2xl font-black text-emerald-400">{user.totalScore ?? 0}</p>
                            {(() => {
                                const rank = user.rank || getRank(user.totalScore ?? 0);
                                return (
                                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-semibold mt-1 ${rank.bg} ${rank.color}`}>
                                        {rank.emoji} {rank.label}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
