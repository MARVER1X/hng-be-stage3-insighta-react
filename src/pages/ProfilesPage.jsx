import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import client from '../api/client';
import '../styles/ProfilesPage.css';

/**
 * Profiles Intelligence Gallery
 * A data-intensive view displaying all intelligence profiles in a tabular format.
 * Supports natural language filtering and server-side pagination.
 */
const ProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetches profile data based on current page and active search filters.
   * Switches between the standard list and NLP search endpoints as needed.
   */
  const fetchProfiles = async (currentPage = 1, query = '') => {
    setLoading(true);
    try {
      let endpoint = `/api/profiles?page=${currentPage}&limit=10`;
      
      // If a natural language query is present, switch to the intelligence search route
      if (query) {
        endpoint = `/api/profiles/search?q=${encodeURIComponent(query)}&page=${currentPage}&limit=10`;
      }

      const response = await client.get(endpoint);
      setProfiles(response.data.data);
      
      // Synchronize pagination state with backend metadata
      const total = response.data?.total_pages || 1;
      setTotalPages(total);
    } catch (error) {
      console.error('Failed to fetch profiles', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch data whenever the page number changes
  useEffect(() => {
    fetchProfiles(page, searchQuery);
  }, [page]);

  /**
   * Handles the search form submission.
   * Resets the page to 1 to ensure the user sees the top of the filtered results.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchProfiles(1, searchQuery);
  };

  return (
    <div className="profiles-container">
      {/* Page Header and Intelligence Filter */}
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

      {/* Main Intelligence Table */}
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

            {/* Pagination Controls */}
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
