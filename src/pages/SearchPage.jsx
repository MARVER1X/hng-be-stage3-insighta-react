import React, { useState } from 'react';
import { Search, Info, UserCheck, MapPin, Zap } from 'lucide-react';
import client from '../api/client';
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await client.get(`/api/profiles/search?query=${encodeURIComponent(query)}&limit=20`);
      setResults(response.data.data);
    } catch (error) {
      console.error('Intelligence search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    { text: "Adult men in Nigeria", icon: <MapPin size={16} /> },
    { text: "Teenagers in United Kingdom", icon: <Zap size={16} /> },
    { text: "Seniors detected in France", icon: <UserCheck size={16} /> },
  ];

  return (
    <div className="search-page-container">
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
                onClick={() => {
                  setQuery(ex.text);
                  // We don't trigger search automatically to allow user to edit
                }}
              >
                {ex.icon}
                <span>{ex.text}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="search-results-section">
          <div className="results-meta">
            Found {results.length} intelligence matches for "{query}"
          </div>
          
          {loading ? (
            <div className="results-loading">
              <div className="spinner"></div>
            </div>
          ) : results.length > 0 ? (
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
