import React from 'react';

const HomePage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4">
            <div
                className={`glass-card border rounded-2xl p-8 max-w-md w-full text-center transition-all duration-500 ${isAdmin ? 'border-violet-500/20 shadow-violet-glow' : 'border-emerald-500/20 shadow-emerald-glow'
                    }`}
            >
                <div className="text-4xl mb-4">{isAdmin ? '🛡️' : '🎓'}</div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent mb-2">
                    {isAdmin ? 'Admin Dashboard' : 'Teacher Dashboard'}
                </h1>
                <p className="text-white/50 mb-1">
                    Welcome,{' '}
                    <span className={`font-medium ${isAdmin ? 'text-violet-400' : 'text-emerald-400'}`}>
                        {user.name || user.email || (isAdmin ? 'Administrator' : 'Teacher')}
                    </span>
                    !
                </p>
                <p className="text-white/30 text-sm mb-8">
                    {isAdmin ? 'Manage your school from one place.' : 'Manage your classes and students.'}
                </p>
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
