import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import RoleSwitcher from './components/RoleSwitcher';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const App = () => {
  const [activeRole, setActiveRole] = useState('student');

  const renderDashboard = () => {
    switch (activeRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <Sidebar activeRole={activeRole} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderDashboard()}
      </main>

      {/* Role Switcher */}
      <RoleSwitcher activeRole={activeRole} onRoleChange={setActiveRole} />
    </div>
  );
};

export default App;