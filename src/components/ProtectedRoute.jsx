import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Authentication Guard Component
 * Ensures that nested routes are only accessible to authenticated users.
 * Redirects unauthenticated users to the login page while preserving
 * the application state during initial session verification.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Prevent UI flickering by showing a loading state while the session is being verified
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // If identity check completes and no user is found, force redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Session is active: allow the user to see the internal content
  return children;
};

export default ProtectedRoute;
