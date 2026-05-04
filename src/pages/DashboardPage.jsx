import React, { useState, useEffect } from 'react';
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

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    countries: 0,
    recentCount: 0
  });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Parallel fetch for efficiency
      const [profilesRes, recentRes] = await Promise.all([
        client.get('/api/profiles?limit=1'), // Just to get the total count from pagination
        client.get('/api/profiles?limit=5&sort_by=created_at&order=desc')
      ]);

      setStats({
        total: profilesRes.data.pagination?.total_items || 0,
        countries: 12, // In a real app, we'd have a specific stats endpoint
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
      <header className="dashboard-header">
        <h1>Welcome back, {user?.username}</h1>
        <p>Here is an overview of the Insighta intelligence network.</p>
      </header>

      <div className="stats-grid">
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

        <div className="stat-card">
          <div className="stat-icon green">
            <Globe size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Locations</span>
            <span className="stat-value">{stats.countries}</span>
          </div>
        </div>

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
        <section className="recent-section">
          <div className="section-header">
            <h2>Recent Detections</h2>
            <button className="view-all-btn">View All</button>
          </div>

          <div className="recent-list">
            {loading ? (
              <div className="recent-loading">Loading...</div>
            ) : (
              recentProfiles.map(profile => (
                <div key={profile.id} className="recent-item">
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
