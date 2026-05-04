import React from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/AccountPage.css';

const AccountPage = () => {
  const { user, logout } = useAuth();

  const infoItems = [
    { label: 'System Role', value: user?.role, icon: <Shield size={18} /> },
    { label: 'Account ID', value: user?.sub || user?.id, icon: <User size={18} /> },
    { label: 'Session Type', value: 'Secure HTTP-only Cookie', icon: <Calendar size={18} /> },
  ];

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        <p>Manage your identity and session settings.</p>
      </div>

      <div className="account-grid">
        <div className="profile-card">
          <div className="profile-banner"></div>
          <div className="profile-main">
            <div className="profile-avatar-large">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info-header">
              <h2>{user?.username}</h2>
              <span className="profile-badge">{user?.role}</span>
            </div>
          </div>

          <div className="profile-details">
            {infoItems.map((item, i) => (
              <div key={i} className="detail-item">
                <div className="detail-icon">{item.icon}</div>
                <div className="detail-text">
                  <span className="detail-label">{item.label}</span>
                  <span className="detail-value">{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-actions">
            <button className="secondary-btn" onClick={() => window.open('https://github.com/settings/profile', '_blank')}>
              <ExternalLink size={16} />
              <span>Edit on GitHub</span>
            </button>
            <button className="danger-btn" onClick={logout}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="security-info">
          <h3>Security & Compliance</h3>
          <div className="security-card">
            <p>Your session is protected by <strong>Insighta Labs+</strong> multi-interface authentication protocol.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
