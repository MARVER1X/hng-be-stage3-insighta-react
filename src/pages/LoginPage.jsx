import React from 'react';
import { Github } from 'lucide-react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const handleLogin = () => {
    // Redirect to backend OAuth flow
    window.location.href = 'http://localhost:8000/auth/github';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Insighta Labs+</h1>
          <p>Secure Access & Multi-Interface Integration</p>
        </div>
        
        <div className="login-content">
          <button className="github-btn" onClick={handleLogin}>
            <Github size={20} />
            <span>Continue with GitHub</span>
          </button>
          
          <p className="login-footer">
            Analyst or Admin access required.
          </p>
        </div>
      </div>
      
      {/* Background Blobs for depth */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
    </div>
  );
};

export default LoginPage;
