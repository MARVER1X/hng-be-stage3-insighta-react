import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

/**
 * Authentication Context
 * Manages global user state and provides identity verification methods.
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verifies the user session by calling the backend identity endpoint.
   * Relies on secure HttpOnly cookies automatically attached by the browser.
   */
  const checkAuth = async () => {
    try {
      const response = await client.get('/auth/me');
      setUser(response.data.data);
    } catch (error) {
      // Clear user state if verification fails or session is expired
      setUser(null);
    } finally {
      // Identity check complete: allows protected routes to render
      setLoading(false);
    }
  };

  /**
   * Signs the user out by blacklisting the session on the backend
   * and clearing the local application state.
   */
  const logout = async () => {
    try {
      // Trigger backend revocation and cookie clearing
      await client.post('/auth/logout', {});
    } finally {
      // Always reset local state and redirect regardless of API success
      setUser(null);
      window.location.href = '/login';
    }
  };

  // Run identity verification on application mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for consuming the Authentication state within components.
 */
export const useAuth = () => useContext(AuthContext);
