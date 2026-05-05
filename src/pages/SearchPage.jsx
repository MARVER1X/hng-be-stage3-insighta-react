import React, { useState } from 'react';
import { Search, Info, UserCheck, MapPin, Zap } from 'lucide-react';
import client from '../api/client';
import '../styles/SearchPage.css';

/**
 * Intelligence Command Center
 * A dedicated interface for Natural Language processing and exploratory search.
 * Designed for rapid analysis of global profile demographics.
 */
const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Executes the NLP-powered search request.
   * Maps the human-readable string to structured database filters on the backend.
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      // Backend interprets 'q' parameter using a specialized NLP token parser
      const response = await client.get(`/api/profiles/search?q=${encodeURIComponent(query)}&limit=20`);
      setResults(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Intelligence search failed', error);
    } finally {
      setLoading(false);
    }
  };

  // Example patterns to guide users on how to interact with the NLP engine
  const examples = [
    { text: "Adult men in Nigeria", icon: <MapPin size={16} /> },
    { text: "Teenagers in United Kingdom", icon: <Zap size={16} /> },
    { text: "Seniors detected in France", icon: <UserCheck size={16} /> },
  ];

  return (
    <div className="search-page-container">
      {/* Hero Search Section */}
      <div className="search-hero">
        <h1>Intelligence Command</h1>
        <p>Use Natural Language to query the global profile database.</p>
        
        <form className="hero-search-form" onSubmit={handleSearch}>
          <Search className="hero-search-icon" size={24} />
          <input 
            type="text" 
            placeholder="E.g. 'Show me all adults in Lagos'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="hero-search-btn">
            {loading ? 'Searching...' : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Conditional View: Suggestions vs. Results */}
      {!hasSearched ? (
        <div className="search-suggestions">
          <div className="suggestion-header">
            <Info size={18} />
            <span>Try these search patterns</span>
          </div>
          <div className="suggestion-grid">
            {examples.map((ex, i) => (
              <div 
                key={i} 
                className="suggestion-card" 
                onClick={() => setQuery(ex.text)}
              >
                {ex.icon}
                <span>{ex.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="search-results-section">
          {/* Search Metadata Overview */}
          <div className="results-meta">
            Found {results.length} intelligence matches for "{query}"
          </div>
          
          {loading ? (
            <div className="results-loading">
              <div className="spinner"></div>
            </div>
          ) : results.length > 0 ? (
            /* Results Grid: Interactive Profile Cards */
            <div className="results-grid">
              {results.map(profile => (
                <div key={profile.id} className="result-card">
                  <div className="result-header">
                    <div className="result-avatar">{profile.name[0]}</div>
                    <div className="result-titles">
                      <h3>{profile.name}</h3>
                      <span>{profile.country_name}</span>
                    </div>
                  </div>
                  <div className="result-body">
                    <div className="result-tag">{profile.gender}</div>
                    <div className="result-tag">{profile.age} yrs</div>
                    <div className="result-tag">{profile.age_group}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State for failed queries */
            <div className="no-results">
              <h3>No intelligence matches found.</h3>
              <p>Try refining your query with different age groups or countries.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
