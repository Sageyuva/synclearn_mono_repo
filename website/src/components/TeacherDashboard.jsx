import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { studentProgress, classAnalytics } from '../mockData';

const TeacherDashboard = () => {
    const [questForm, setQuestForm] = useState({
        title: '',
        videoLink: '',
        aiText: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Quest created:', questForm);
        // Reset form
        setQuestForm({ title: '', videoLink: '', aiText: '' });
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Architect Dashboard</h1>
                <p className="text-white/60">Create quests and track student progress</p>
            </div>

            {/* Quest Creation Form */}
            <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Create New Quest</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Quest Title</label>
                        <input
                            type="text"
                            value={questForm.title}
                            onChange={(e) => setQuestForm({ ...questForm, title: e.target.value })}
                            placeholder="e.g., Introduction to Quantum Physics"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Video Link</label>
                        <input
                            type="url"
                            value={questForm.videoLink}
                            onChange={(e) => setQuestForm({ ...questForm, videoLink: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">AI Simplified Text</label>
                        <textarea
                            value={questForm.aiText}
                            onChange={(e) => setQuestForm({ ...questForm, aiText: e.target.value })}
                            placeholder="Enter the simplified explanation for students..."
                            rows="4"
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                        ✨ Create Quest
                    </Button>
                </form>
            </Card>

            {/* Student Progress */}
            <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Student Progress Tracking</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentProgress.map((student) => (
                        <div
                            key={student.id}
                            className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center text-2xl">
                                    {student.avatar}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{student.name}</h3>
                                    <p className="text-white/60 text-sm">{student.questsCompleted}/{student.totalQuests} quests</p>
                                </div>
                                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${student.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                  ${student.status === 'in-progress' ? 'bg-violet-500/20 text-violet-400' : ''}
                  ${student.status === 'not-started' ? 'bg-red-500/20 text-red-400' : ''}
                `}>
                                    {student.status === 'completed' ? '✓ Complete' :
                                        student.status === 'in-progress' ? '⏳ In Progress' : '🔒 Not Started'}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/60">Progress</span>
                                    <span className="text-emerald-400 font-medium">{student.completion}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-violet-500 transition-all duration-500"
                                        style={{ width: `${student.completion}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Class Analytics */}
            <Card>
                <h2 className="text-2xl font-bold text-white mb-6">Class Analytics</h2>
                <div className="space-y-4">
                    {classAnalytics.map((week, index) => (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-white/80 text-sm font-medium">{week.label}</span>
                                <div className="flex gap-4 text-sm">
                                    <span className="text-emerald-400">Engagement: {week.engagement}%</span>
                                    <span className="text-violet-400">Completion: {week.completion}%</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1 h-8 rounded-lg bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500/50 transition-all duration-500"
                                        style={{ width: `${week.engagement}%` }}
                                    />
                                </div>
                                <div className="flex-1 h-8 rounded-lg bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full bg-violet-500/50 transition-all duration-500"
                                        style={{ width: `${week.completion}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default TeacherDashboard;
