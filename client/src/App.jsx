import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes — accessible only when NOT logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Private routes — accessible only when logged in */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;