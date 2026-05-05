import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  User, 
  MapPin, 
  Calendar, 
  Activity, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfileDetailPage.css';

/**
 * Profile Intelligence Detail View
 * Provides a granular deep-dive into a single identity profile.
 * Displays confidence metrics, demographic attributes, and system metadata.
 * Restricts destructive actions (Delete) to authenticated administrators.
 */
const ProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine the originating context for the back navigation
  const fromDashboard = location.state?.from === 'dashboard';
  const backPath = fromDashboard ? '/dashboard' : '/profiles';
  const backLabel = fromDashboard ? 'Back to Dashboard' : 'Back to Profiles';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /**
   * Fetches the complete profile record from the backend.
   * Utilizes the ID extracted from the URL parameters via useParams.
   */
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/api/profiles/${id}`);
      setProfile(response.data.data);
    } catch (err) {
      // Clear identity state if extraction fails
      setError(err.response?.data?.message || 'Failed to load profile intelligence.');
    } finally {
      // Identity check complete: allows detail view to render
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  /**
   * Handles the permanent deletion of a profile.
   * Restricted to admin accounts only via backend RBAC enforcement.
   */
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this intelligence profile? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await client.delete(`/api/profiles/${id}`);
      // Return to the previous list upon successful purge
      navigate(backPath);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete profile.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-loader">
        <div className="spinner"></div>
        <p>Deciphering profile intelligence...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="error-container">
        <ShieldAlert size={48} className="error-icon" />
        <h2>Intelligence Breach</h2>
        <p>{error || 'The requested profile could not be located in our secure database.'}</p>
        <Link to={backPath} className="back-link">
          <ArrowLeft size={18} />
          <span>{backLabel}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-detail-container">
      {/* Dynamic Navigation Header */}
      <div className="detail-header">
        <Link to={backPath} className="back-btn">
          <ArrowLeft size={20} />
          <span>{backLabel}</span>
        </Link>

        {/* Admin Action: Permanent Intelligence Purge */}

        {user?.role === 'admin' && (
          <button 
            className="delete-btn" 
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={18} />
            <span>{deleting ? 'Purging...' : 'Delete Profile'}</span>
          </button>
        )}
      </div>


      <div className="detail-grid">
        {/* Core Identity Card */}
        <div className="identity-section">
          <div className="detail-avatar">
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="detail-name">{profile.name}</h1>
          <div className="detail-status">
            <span className="status-badge">Active Intelligence</span>
          </div>

          <div className="id-row">
            <Clock size={14} />
            <span>ID: {profile.id}</span>
          </div>
        </div>

        {/* Intelligence Metrics */}
        <div className="metrics-section">
          <h3>Demographic Intelligence</h3>
          
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">
                <User size={16} />
                <span>Gender Detection</span>
              </div>
              <div className="metric-value">{profile.gender}</div>
              <div className="metric-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${profile.gender_probability * 100}%` }}
                ></div>
              </div>
              <div className="metric-sub">{(profile.gender_probability * 100).toFixed(1)}% Confidence Score</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">
                <Calendar size={16} />
                <span>Age Group Analysis</span>
              </div>
              <div className="metric-value">{profile.age_group}</div>
              <div className="metric-sub">Detected Age: {profile.age} Years</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">
                <MapPin size={16} />
                <span>Geographic Origin</span>
              </div>
              <div className="metric-value">{profile.country_name}</div>
              <div className="metric-sub">Region Code: {profile.country_id}</div>
            </div>

            <div className="metric-card">
              <div className="metric-label">
                <Activity size={16} />
                <span>Accuracy Metrics</span>
              </div>
              <div className="metric-value">{(profile.country_probability * 100).toFixed(1)}%</div>
              <div className="metric-sub">Geo-Localization Probability</div>
            </div>
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="metadata-footer">
          <div className="meta-item">
            <span className="meta-label">Intelligence Detected On:</span>
            <span className="meta-value">{new Date(profile.created_at).toLocaleString()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Protocol:</span>
            <span className="meta-value">Stateless Intelligence Extraction v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
