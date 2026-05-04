import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../api/client';
import '../styles/ProfilesPage.css';

const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfiles = async (currentPage = 1, query = '') => {
    setLoading(true);
    try {
      let endpoint = `/api/profiles?page=${currentPage}&limit=10`;
      
      // If there is a query, we use the search endpoint instead
      if (query) {
        endpoint = `/api/profiles/search?query=${encodeURIComponent(query)}&page=${currentPage}&limit=10`;
      }

      const response = await client.get(endpoint);
      setProfiles(response.data.data);
      
      // Calculate total pages from backend metadata
      const total = response.data.pagination?.total_pages || 1;
      setTotalPages(total);
    } catch (error) {
      console.error('Failed to fetch profiles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles(page, searchQuery);
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchProfiles(1, searchQuery);
  };

  return (
    <div className="profiles-container">
      <div className="page-header">
        <div>
          <h1>Profile Intelligence</h1>
          <p>Global identity data and profile demographics.</p>
        </div>
        
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search naturally (e.g. 'Men in Nigeria')..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="table-loader">
            <div className="spinner"></div>
            <p>Syncing profile data...</p>
          </div>
        ) : (
          <>
            <table className="profiles-table">
              <thead>
                <tr>
                  <th>Profile Name</th>
                  <th>Gender</th>
                  <th>Age (Group)</th>
                  <th>Location</th>
                  <th>Detected On</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {profile.name?.charAt(0) || 'P'}
                        </div>
                        <span className="user-name">{profile.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="gender-info">
                        <span className="badge-gender">{profile.gender}</span>
                        <small className="prob-text">{(profile.gender_probability * 100).toFixed(0)}% accuracy</small>
                      </div>
                    </td>
                    <td>
                      <div className="age-info">
                        <span>{profile.age} yrs</span>
                        <span className="age-tag">{profile.age_group}</span>
                      </div>
                    </td>
                    <td>
                      <div className="country-info">
                        <span>{profile.country_name}</span>
                        <small className="country-id">{profile.country_id}</small>
                      </div>
                    </td>
                    <td>{new Date(profile.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                disabled={page <= 1} 
                onClick={() => setPage(p => p - 1)}
                className="pag-btn"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="pag-info">Page {page} of {totalPages}</span>
              <button 
                disabled={page >= totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="pag-btn"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilesPage;
