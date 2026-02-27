import React, { useState, useEffect, useCallback } from 'react';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../api/missionService';
import { showToast } from '../utils/toast';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', message: '' });
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const load = useCallback(async () => {
        try {
            const res = await getAnnouncements();
            setAnnouncements(res.data || []);
        } catch { } finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.message.trim()) {
            showToast.alert('Title and message are required.'); return;
        }
        setCreating(true);
        try {
            const res = await createAnnouncement(form);
            setAnnouncements(prev => [res.data, ...prev]);
            setForm({ title: '', message: '' });
            showToast.success('Broadcast transmitted to all units!');
        } catch { } finally { setCreating(false); }
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => a._id !== id));
            showToast.success('Announcement removed.');
        } catch { } finally { setDeletingId(null); }
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen" style={{ background: '#030712', color: 'white' }}>
            {/* Top Bar */}
            <div className="border-b px-6 py-4 flex items-center justify-between"
                style={{ borderColor: 'rgba(178,34,34,0.3)', background: 'rgba(10,15,30,0.9)', backdropFilter: 'blur(8px)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#B22222,#8B0000)', boxShadow: '0 0 14px rgba(178,34,34,0.5)' }}>
                        <span style={{ color: '#FFD700' }} className="font-black text-sm">📡</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">GLOBAL BROADCAST</p>
                        <p className="text-xs font-mono" style={{ color: '#B22222' }}>Admin Control</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-white/30 hidden sm:block">{user.name?.toUpperCase()}</span>
                    <button onClick={() => { localStorage.clear(); window.location.replace('/login'); }}
                        className="text-xs px-3 py-2 rounded-lg cursor-pointer border"
                        style={{ borderColor: 'rgba(178,34,34,0.4)', color: '#B22222' }}>
                        LOGOUT
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Broadcast Form */}
                <form onSubmit={handleCreate}
                    className="mb-10 p-6 rounded-2xl border"
                    style={{ borderColor: '#FFD700', background: 'rgba(255,215,0,0.03)', boxShadow: '0 0 24px rgba(255,215,0,0.06)' }}>
                    <p className="text-xs font-mono mb-4" style={{ color: '#FFD700' }}>
                        📡 TRANSMIT NEW BROADCAST
                    </p>
                    <input
                        className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm text-white outline-none mb-3"
                        style={{ borderColor: 'rgba(178,34,34,0.4)' }}
                        placeholder="Broadcast Title *"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        required
                    />
                    <textarea
                        className="w-full bg-transparent border rounded-xl px-4 py-3 text-sm text-white outline-none resize-none mb-4"
                        style={{ borderColor: 'rgba(178,34,34,0.4)' }}
                        placeholder="Broadcast message to all users… *"
                        rows={4}
                        value={form.message}
                        onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        required
                    />
                    <button type="submit" disabled={creating}
                        className="w-full py-3 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#B22222,#8B0000)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.4)' }}>
                        {creating ? 'Transmitting…' : '📡  TRANSMIT BROADCAST'}
                    </button>
                </form>

                {/* Announcement List */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="text-xl font-black text-white">
                        ACTIVE <span style={{ color: '#FFD700' }}>BROADCASTS</span>
                    </h1>
                    <p className="text-xs font-mono text-white/30">{announcements.length} signals</p>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-20 rounded-xl animate-pulse"
                                style={{ background: 'rgba(178,34,34,0.05)', border: '1px solid rgba(178,34,34,0.1)' }} />
                        ))}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-white/30 text-sm font-mono">NO BROADCASTS YET</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {announcements.map(a => (
                            <div key={a._id}
                                className="p-5 rounded-xl border flex items-start justify-between gap-4"
                                style={{ borderColor: 'rgba(178,34,34,0.25)', background: '#0a0f1e' }}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-bold text-white text-sm">{a.title}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/20" />
                                        <span className="text-xs text-white/30 font-mono">{formatDate(a.createdAt)}</span>
                                    </div>
                                    <p className="text-white/60 text-sm">{a.message}</p>
                                    {a.adminId && (
                                        <p className="text-xs text-white/20 font-mono mt-2">
                                            via {a.adminId.name}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(a._id)}
                                    disabled={deletingId === a._id}
                                    className="shrink-0 text-xs px-3 py-1.5 rounded-lg cursor-pointer border disabled:opacity-40"
                                    style={{ borderColor: 'rgba(178,34,34,0.4)', color: '#B22222' }}>
                                    {deletingId === a._id ? '…' : '✕'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementsPage;
