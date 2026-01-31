import React from 'react';
import Card from './Card';
import { studentMissions, skillTree, studentStats } from '../mockData';

const StudentDashboard = () => {
    return (
        <div className="p-8">
            <div className="flex gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Navigator Dashboard</h1>
                        <p className="text-white/60">Embark on your learning journey</p>
                    </div>

                    {/* Mission Map */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Mission Map</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {studentMissions.map((mission) => (
                                <Card
                                    key={mission.id}
                                    hover
                                    className={`
                    ${mission.status === 'locked' ? 'opacity-50' : ''}
                    ${mission.status === 'completed' ? 'border-emerald-500/30' : ''}
                    ${mission.status === 'active' ? 'border-violet-500/30' : ''}
                  `}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 flex items-center justify-center text-2xl">
                                                {mission.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-bold">{mission.title}</h3>
                                                <p className="text-white/60 text-sm">{mission.difficulty}</p>
                                            </div>
                                        </div>
                                        <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${mission.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      ${mission.status === 'active' ? 'bg-violet-500/20 text-violet-400' : ''}
                      ${mission.status === 'locked' ? 'bg-white/10 text-white/40' : ''}
                    `}>
                                            {mission.status === 'completed' ? '✓ Complete' :
                                                mission.status === 'active' ? '⏳ Active' : '🔒 Locked'}
                                        </span>
                                    </div>

                                    {mission.status !== 'locked' && (
                                        <>
                                            <div className="mb-2">
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-white/60">Progress</span>
                                                    <span className="text-emerald-400 font-medium">{mission.progress}%</span>
                                                </div>
                                                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-violet-500"
                                                        style={{ width: `${mission.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/60 text-sm">Reward: {mission.points} pts</span>
                                                {mission.status === 'active' && (
                                                    <button className="text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors">
                                                        Continue →
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Skill Tree */}
                    <Card>
                        <h2 className="text-2xl font-bold text-white mb-6">Skill Tree</h2>
                        <div className="relative h-96 bg-white/5 rounded-lg p-8">
                            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                                {skillTree.map((skill) =>
                                    skill.connections.map((connId) => {
                                        const connectedSkill = skillTree.find(s => s.id === connId);
                                        if (!connectedSkill) return null;
                                        return (
                                            <line
                                                key={`${skill.id}-${connId}`}
                                                x1={`${skill.x}%`}
                                                y1={`${skill.y}%`}
                                                x2={`${connectedSkill.x}%`}
                                                y2={`${connectedSkill.y}%`}
                                                stroke={skill.unlocked ? '#10B981' : '#ffffff20'}
                                                strokeWidth="2"
                                                strokeDasharray={skill.unlocked ? '0' : '5,5'}
                                            />
                                        );
                                    })
                                )}
                            </svg>

                            {skillTree.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: `${skill.x}%`, top: `${skill.y}%`, zIndex: 1 }}
                                >
                                    <div
                                        className={`
                      w-20 h-20 rounded-full flex flex-col items-center justify-center
                      transition-all duration-300 cursor-pointer
                      ${skill.unlocked
                                                ? 'bg-gradient-to-br from-emerald-500 to-violet-500 hover:scale-110 shadow-lg'
                                                : 'bg-white/10 border-2 border-white/20'
                                            }
                    `}
                                    >
                                        <span className="text-2xl">{skill.unlocked ? '⭐' : '🔒'}</span>
                                        {skill.unlocked && (
                                            <span className="text-white text-xs font-bold">Lv {skill.level}</span>
                                        )}
                                    </div>
                                    <p className="text-white text-xs text-center mt-2 font-medium">{skill.name}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Points & Badges Sidebar */}
                <div className="w-80 space-y-6">
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">Your Stats</h3>

                        {/* Total Points */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/60 text-sm">Total Points</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-violet-500 bg-clip-text text-transparent">
                                    {studentStats.totalPoints}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-violet-500" />
                                </div>
                                <span className="text-white/60 text-xs">Lv {studentStats.level}</span>
                            </div>
                        </div>

                        {/* Current Streak */}
                        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-violet-500/10 border border-emerald-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center text-2xl">
                                    🔥
                                </div>
                                <div>
                                    <p className="text-white font-bold text-2xl">{studentStats.currentStreak} Days</p>
                                    <p className="text-white/60 text-sm">Current Streak</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recent Badges */}
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">Recent Badges</h3>
                        <div className="space-y-3">
                            {studentStats.recentBadges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-violet-500/20 flex items-center justify-center text-xl">
                                        {badge.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium text-sm">{badge.name}</p>
                                        <p className="text-white/40 text-xs">{badge.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* All Badges */}
                    <Card>
                        <h3 className="text-xl font-bold text-white mb-4">All Badges</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {studentStats.badges.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={`
                    aspect-square rounded-lg flex items-center justify-center text-3xl
                    transition-all duration-300 cursor-pointer hover:scale-110
                    ${badge.earned
                                            ? 'bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/30'
                                            : 'bg-white/5 border border-white/10 opacity-40'
                                        }
                  `}
                                    title={badge.name}
                                >
                                    {badge.icon}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
