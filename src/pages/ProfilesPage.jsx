import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../styles/ProfilesPage.css';

/**
 * Profiles Intelligence Gallery
 * A data-intensive view displaying all intelligence profiles in a tabular format.
 * Supports natural language filtering and server-side pagination.
 */
const ProfilesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Sorting and Ordering State
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');
  
  /**
   * Admin-only Intelligence Orchestration
   * manages the state for profile generation and UI visibility.
   */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  /**
   * Fetches profile data based on current page and active search filters.
   * Switches between the standard list and NLP search endpoints as needed.
   */
  const fetchProfiles = async (currentPage = 1, query = '', currentSort = sortBy, currentOrder = order) => {
    setLoading(true);
    try {
      let endpoint = `/api/profiles?page=${currentPage}&limit=10&sort_by=${currentSort}&order=${currentOrder}`;
      
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
      // Identity check complete: allows profile gallery to render
      setLoading(false);
    }
  };

  // Re-fetch data whenever page, sorting, or ordering changes
  useEffect(() => {
    fetchProfiles(page, searchQuery, sortBy, order);
  }, [page, sortBy, order]);

  /**
   * Handles the search form submission.
   * Resets the page to 1 to ensure the user sees the top of the filtered results.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchProfiles(1, searchQuery, sortBy, order);
  };

  /**
   * Triggers the backend profile generation sequence.
   * Leverages the multi-API enrichment protocol (Genderize/Agify/Nationalize).
   * Restricted to Admin roles only.
   */
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      await client.post('/api/profiles', { name: newName.trim() });
      setNewName('');
      setIsModalOpen(false);
      
      // Refresh the list to reflect the new intelligence data
      fetchProfiles(1, searchQuery, sortBy, order);
    } catch (error) {
      console.error('Failed to generate profile', error);
      alert(error.response?.data?.message || 'Failed to generate profile intelligence.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="profiles-container">
      {/* Page Header and Intelligence Filter */}
      <div className="page-header">
        <div>
          <h1>Profile Intelligence</h1>
          <p>Global identity data and profile demographics.</p>
        </div>
        
        <div className="header-actions">
          {/* Sorting and Ordering Controls */}
          <div className="filter-group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="created_at">Date</option>
              <option value="age">Age</option>
              <option value="gender_probability">Confidence</option>
            </select>
            <select 
              value={order} 
              onChange={(e) => setOrder(e.target.value)}
              className="filter-select"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>

          {/* Natural Language Query Interface */}
          <form className="search-bar" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">Go</button>
          </form>

          {/* Admin Action: Manual Profile Generation Trigger */}
          {user?.role === 'admin' && (
            <button className="add-profile-btn" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} />
              <span className="btn-text">Add</span>
            </button>
          )}
        </div>
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
                  <tr 
                    key={profile.id} 
                    onClick={() => navigate(`/profiles/${profile.id}`, { state: { from: 'profiles' } })}
                    className="clickable-row"
                  >
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
              {/* stopPropagation prevents row-click navigation when using paging controls */}
              <button 
                disabled={page <= 1} 
                onClick={(e) => { e.stopPropagation(); setPage(p => p - 1); }}
                className="pag-btn"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="pag-info">Page {page} of {totalPages}</span>
              <button 
                disabled={page >= totalPages} 
                onClick={(e) => { e.stopPropagation(); setPage(p => p + 1); }}
                className="pag-btn"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Admin-only Profile Creation Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Initialize New Profile</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="modal-desc">
              Enter a name to trigger the intelligence enrichment process across connected APIs.
            </p>
            <form onSubmit={handleCreateProfile}>
              <div className="input-group">
                <label>Subject Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="confirm-btn"
                  disabled={creating}
                >
                  {creating ? 'Enriching...' : 'Generate Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;
