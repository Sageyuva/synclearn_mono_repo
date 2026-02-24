import React from 'react';

const HomePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4">
            <div className="glass-card border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-emerald-glow">
                <div className="text-4xl mb-4">🎓</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent mb-2">
                    Student Dashboard
                </h1>
                <p className="text-white/50 mb-1">
                    Welcome back, <span className="text-emerald-400 font-medium">{user.name || user.email || 'Student'}</span>!
                </p>
                <p className="text-white/30 text-sm mb-8">Your personalized learning space.</p>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default HomePage;
