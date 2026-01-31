import React from 'react';

const Sidebar = ({ activeRole }) => {
    const navigationLinks = {
        admin: [
            { name: 'Dashboard', icon: '📊', href: '#' },
            { name: 'Manage Users', icon: '👥', href: '#' },
            { name: 'Server Status', icon: '🖥️', href: '#' },
            { name: 'Settings', icon: '⚙️', href: '#' }
        ],
        teacher: [
            { name: 'Dashboard', icon: '📊', href: '#' },
            { name: 'Create Quest', icon: '✨', href: '#' },
            { name: 'Student Progress', icon: '📈', href: '#' },
            { name: 'Analytics', icon: '📉', href: '#' }
        ],
        student: [
            { name: 'Mission Map', icon: '🗺️', href: '#' },
            { name: 'Skill Tree', icon: '🌳', href: '#' },
            { name: 'My Progress', icon: '📊', href: '#' },
            { name: 'Achievements', icon: '🏆', href: '#' }
        ]
    };

    const roleInfo = {
        admin: { title: 'Guardian', subtitle: 'Admin Portal', color: 'emerald' },
        teacher: { title: 'Architect', subtitle: 'Teacher Portal', color: 'violet' },
        student: { title: 'Navigator', subtitle: 'Student Portal', color: 'emerald' }
    };

    const links = navigationLinks[activeRole] || navigationLinks.student;
    const info = roleInfo[activeRole] || roleInfo.student;

    return (
        <aside className="w-64 h-screen glass-card border-r border-white/10 flex flex-col">
            {/* Logo & Role */}
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                    SyncLearn
                </h1>
                <p className="text-sm text-white/60 mt-1">{info.subtitle}</p>
                <div className={`mt-3 px-3 py-1 rounded-full bg-${info.color}-500/20 text-${info.color}-400 text-xs font-medium inline-block`}>
                    {info.title}
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                            {link.icon}
                        </span>
                        <span className="font-medium">{link.name}</span>
                    </a>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center text-white font-bold">
                        {activeRole[0].toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Demo User</p>
                        <p className="text-xs text-white/60">{activeRole}@synclearn.ai</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
