import React, { useState, useEffect } from 'react';
import { 
  Link,
  useNavigate 
} from 'react-router-dom';
import { 
  Users, 
  Globe, 
  Activity, 
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../styles/DashboardPage.css';

/**
 * Executive Dashboard Page
 * Provides a high-level overview of intelligence metrics, recent profile detections,
 * and system activity status using data-driven summary cards.
 */
const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    countries: 0,
    recentCount: 0
  });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Aggregates dashboard data from multiple API endpoints.
   * Uses parallel requests to optimize initial load time.
   */
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profilesRes, recentRes] = await Promise.all([
        // Fetch base count for metrics
        client.get('/api/profiles?limit=1'), 
        // Fetch 5 most recent records for the activity feed
        client.get('/api/profiles?limit=5&sort_by=created_at&order=desc')
      ]);

      setStats({
        // Map keys according to the simplified pagination format
        total: profilesRes.data.total || 0,
        countries: 12, // Placeholder for geographic distribution stats
        recentCount: recentRes.data.data.length
      });
      setRecentProfiles(recentRes.data.data);
    } catch (error) {
      console.error('Dashboard data fetch failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Personalized Welcome Header */}
      <header className="dashboard-header">
        <h1>Welcome back, {user?.username}</h1>
        <p>Here is an overview of the Insighta intelligence network.</p>
      </header>

      {/* Primary Metrics Grid */}
      <div className="stats-grid">
        {/* Total Intelligence Reach */}
        <div className="stat-card">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Profiles</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-trend positive">
            <ArrowUpRight size={16} />
            <span>12%</span>
          </div>
        </div>

        {/* Global Distribution */}
        <div className="stat-card">
          <div className="stat-icon green">
            <Globe size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Locations</span>
            <span className="stat-value">{stats.countries}</span>
          </div>
        </div>

        {/* Intelligence Velocity */}
        <div className="stat-card">
          <div className="stat-icon purple">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Recent Activity</span>
            <span className="stat-value">{stats.recentCount}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Real-time Activity Feed */}
        <section className="recent-section">
          <div className="section-header">
            <h2>Recent Detections</h2>
            <Link to="/profiles" className="view-all-btn">View All</Link>
          </div>

          <div className="recent-list">
            {loading ? (
              <div className="recent-loading">Loading...</div>
            ) : (
              recentProfiles.map(profile => (
                <div 
                  key={profile.id} 
                  className="recent-item clickable"
                  onClick={() => navigate(`/profiles/${profile.id}`, { state: { from: 'dashboard' } })}
                >
                  <div className="item-avatar">
                    {profile.name?.charAt(0)}
                  </div>
                  <div className="item-info">
                    <span className="item-name">{profile.name}</span>
                    <span className="item-meta">{profile.country_name} • {profile.age} yrs</span>
                  </div>
                  <span className="item-time">
                    {new Date(profile.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Informational / CTA Section */}
        <section className="info-section">
          <div className="info-card gold">
            <UserPlus size={32} />
            <h3>Profile Enrichment</h3>
            <p>Our AI is currently processing 14 new profile requests from the CLI interface.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
