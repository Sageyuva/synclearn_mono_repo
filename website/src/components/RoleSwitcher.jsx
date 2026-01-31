import React, { useState } from 'react';
import Button from './Button';

const RoleSwitcher = ({ activeRole, onRoleChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const roles = [
        { id: 'admin', name: 'Admin (Guardian)', icon: '👑' },
        { id: 'teacher', name: 'Teacher (Architect)', icon: '🎓' },
        { id: 'student', name: 'Student (Navigator)', icon: '🚀' }
    ];

    const currentRole = roles.find(r => r.id === activeRole);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 glass-card rounded-xl p-2 min-w-[200px] border border-white/10 animate-fade-in">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => {
                                onRoleChange(role.id);
                                setIsOpen(false);
                            }}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-300
                ${activeRole === role.id
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }
              `}
                        >
                            <span className="text-xl">{role.icon}</span>
                            <span className="font-medium text-sm">{role.name}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="glass-card px-5 py-3 rounded-full border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-emerald-glow"
            >
                <span className="text-xl">{currentRole?.icon}</span>
                <span className="font-medium text-white">Switch Role</span>
                <span className={`text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
        </div>
    );
};

export default RoleSwitcher;
