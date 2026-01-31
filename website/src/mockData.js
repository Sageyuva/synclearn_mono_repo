// Mock Data for SyncLearn Dashboard

export const adminStats = {
    totalSchools: 42,
    serverHealth: 'Excellent',
    raspberryPiStatus: 'Online',
    activeUsers: 1247,
    uptime: '99.8%'
};

export const usersData = [
    { id: 1, name: 'Alice Johnson', email: 'alice@school.edu', role: 'Teacher', status: 'Active' },
    { id: 2, name: 'Bob Smith', email: 'bob@school.edu', role: 'Student', status: 'Active' },
    { id: 3, name: 'Carol Williams', email: 'carol@school.edu', role: 'Teacher', status: 'Active' },
    { id: 4, name: 'David Brown', email: 'david@school.edu', role: 'Student', status: 'Inactive' },
    { id: 5, name: 'Emma Davis', email: 'emma@school.edu', role: 'Admin', status: 'Active' },
    { id: 6, name: 'Frank Miller', email: 'frank@school.edu', role: 'Student', status: 'Active' },
    { id: 7, name: 'Grace Wilson', email: 'grace@school.edu', role: 'Teacher', status: 'Active' },
    { id: 8, name: 'Henry Moore', email: 'henry@school.edu', role: 'Student', status: 'Active' }
];

export const teacherQuests = [
    { id: 1, title: 'Introduction to Algebra', videoLink: 'https://youtube.com/watch?v=abc123', aiText: 'Learn basic algebraic concepts', status: 'Published' },
    { id: 2, title: 'Physics: Newton\'s Laws', videoLink: 'https://youtube.com/watch?v=def456', aiText: 'Understanding motion and forces', status: 'Draft' },
    { id: 3, title: 'World War II History', videoLink: 'https://youtube.com/watch?v=ghi789', aiText: 'Major events of WWII', status: 'Published' }
];

export const studentProgress = [
    { id: 1, name: 'Bob Smith', avatar: '👨‍🎓', completion: 85, status: 'in-progress', questsCompleted: 12, totalQuests: 15 },
    { id: 2, name: 'Frank Miller', avatar: '👨‍💼', completion: 100, status: 'completed', questsCompleted: 15, totalQuests: 15 },
    { id: 3, name: 'Sarah Parker', avatar: '👩‍🎓', completion: 60, status: 'in-progress', questsCompleted: 9, totalQuests: 15 },
    { id: 4, name: 'Mike Chen', avatar: '👨‍🔬', completion: 40, status: 'in-progress', questsCompleted: 6, totalQuests: 15 },
    { id: 5, name: 'Lisa Anderson', avatar: '👩‍💻', completion: 95, status: 'in-progress', questsCompleted: 14, totalQuests: 15 },
    { id: 6, name: 'David Brown', avatar: '👨‍🎨', completion: 20, status: 'not-started', questsCompleted: 3, totalQuests: 15 }
];

export const classAnalytics = [
    { label: 'Week 1', engagement: 75, completion: 60 },
    { label: 'Week 2', engagement: 82, completion: 70 },
    { label: 'Week 3', engagement: 88, completion: 78 },
    { label: 'Week 4', engagement: 85, completion: 82 },
    { label: 'Week 5', engagement: 92, completion: 88 }
];

export const studentMissions = [
    { id: 1, title: 'Master Algebra Basics', difficulty: 'Easy', status: 'completed', progress: 100, points: 150, icon: '🔢' },
    { id: 2, title: 'Physics Challenge', difficulty: 'Medium', status: 'active', progress: 65, points: 200, icon: '⚛️' },
    { id: 3, title: 'History Explorer', difficulty: 'Easy', status: 'active', progress: 40, points: 150, icon: '📚' },
    { id: 4, title: 'Chemistry Lab', difficulty: 'Hard', status: 'locked', progress: 0, points: 300, icon: '🧪' },
    { id: 5, title: 'Biology Quest', difficulty: 'Medium', status: 'locked', progress: 0, points: 200, icon: '🧬' },
    { id: 6, title: 'Literature Journey', difficulty: 'Easy', status: 'completed', progress: 100, points: 150, icon: '📖' }
];

export const skillTree = [
    { id: 1, name: 'Math Basics', category: 'math', unlocked: true, level: 3, x: 50, y: 20, connections: [2, 3] },
    { id: 2, name: 'Algebra', category: 'math', unlocked: true, level: 2, x: 30, y: 50, connections: [4] },
    { id: 3, name: 'Geometry', category: 'math', unlocked: true, level: 2, x: 70, y: 50, connections: [5] },
    { id: 4, name: 'Calculus', category: 'math', unlocked: false, level: 0, x: 30, y: 80, connections: [] },
    { id: 5, name: 'Trigonometry', category: 'math', unlocked: false, level: 0, x: 70, y: 80, connections: [] }
];

export const studentStats = {
    totalPoints: 1850,
    level: 12,
    currentStreak: 7,
    badges: [
        { id: 1, name: 'Quick Learner', icon: '⚡', earned: true, date: '2026-01-15' },
        { id: 2, name: 'Math Master', icon: '🎯', earned: true, date: '2026-01-20' },
        { id: 3, name: 'Perfect Week', icon: '🔥', earned: true, date: '2026-01-25' },
        { id: 4, name: 'Team Player', icon: '🤝', earned: false, date: null },
        { id: 5, name: 'Science Guru', icon: '🔬', earned: false, date: null }
    ],
    recentBadges: [
        { id: 3, name: 'Perfect Week', icon: '🔥', date: '2026-01-25' },
        { id: 2, name: 'Math Master', icon: '🎯', date: '2026-01-20' }
    ]
};
