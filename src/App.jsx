import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import ProfilesPage from './pages/ProfilesPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import ProfileDetailPage from './pages/ProfileDetailPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main Application Root Component
 * Orchestrates global providers, routing logic, and layout gating.
 */
function App() {
  return (
    /* Global Authentication State Provider */
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes: Accessible without an active session */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 
              Protected Internal Area
              Uses the 'MainLayout' structural shell and the 'ProtectedRoute' guard
              to ensure only verified users can access the dashboard and analytics.
          */}
          <Route 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/profiles/:id" element={<ProfileDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          
          {/* Intelligent Fallback Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
