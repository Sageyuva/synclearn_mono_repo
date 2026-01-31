import React from 'react';
import Card from './Card';
import Button from './Button';
import { adminStats, usersData } from '../mockData';

const AdminDashboard = () => {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Guardian Dashboard</h1>
                <p className="text-white/60">Monitor and manage your SyncLearn ecosystem</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Total Schools</p>
                            <h3 className="text-4xl font-bold text-white">{adminStats.totalSchools}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                            🏫
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-emerald-400 text-sm">↑ 12%</span>
                        <span className="text-white/40 text-sm">vs last month</span>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Server Health</p>
                            <h3 className="text-2xl font-bold text-emerald-400">{adminStats.serverHealth}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">
                            🖥️
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            <span className="text-white/60 text-sm">{adminStats.raspberryPiStatus}</span>
                        </div>
                    </div>
                </Card>

                <Card hover>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Active Users</p>
                            <h3 className="text-4xl font-bold text-white">{adminStats.activeUsers}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">
                            👥
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-emerald-400 text-sm">Uptime: {adminStats.uptime}</span>
                    </div>
                </Card>
            </div>

            {/* Manage Users Table */}
            <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Manage Users</h2>
                    <Button variant="primary">
                        + Add User
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Name</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Email</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Role</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Status</th>
                                <th className="text-left py-3 px-4 text-white/60 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-4 text-white font-medium">{user.name}</td>
                                    <td className="py-4 px-4 text-white/60">{user.email}</td>
                                    <td className="py-4 px-4">
                                        <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${user.role === 'Admin' ? 'bg-violet-500/20 text-violet-400' : ''}
                      ${user.role === 'Teacher' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                      ${user.role === 'Student' ? 'bg-blue-500/20 text-blue-400' : ''}
                    `}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${user.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}
                    `}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2">
                                            <Button variant="ghost" className="text-xs px-3 py-1">Edit</Button>
                                            <Button variant="ghost" className="text-xs px-3 py-1 text-red-400 hover:text-red-300">Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
