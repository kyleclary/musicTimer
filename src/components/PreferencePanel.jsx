import React, { useState, useEffect } from 'react';

function PreferencePanel({ preferences, onPreferencesChange, token }) {
  const [availableGenres, setAvailableGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && preferences.source === 'genre') {
      fetchAvailableGenres();
    }
  }, [token, preferences.source]);

  const fetchAvailableGenres = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAvailableGenres(data.genres || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceChange = (source) => {
    onPreferencesChange({
      ...preferences,
      source: source
    });
  };

  const handleGenreChange = (e) => {
    onPreferencesChange({
      ...preferences,
      genre: e.target.value
    });
  };

  const handleMoodChange = (mood) => {
    onPreferencesChange({
      ...preferences,
      mood: mood
    });
  };

  return (
    <div className="preference-panel">
      <h3>
        <span>🎨</span>
        <span>Customize Your Playlist</span>
      </h3>

      <div className="preference-section">
        <h4>Music Source</h4>
        <div className="source-options">
          <button
            className={`option-btn ${preferences.source === 'top-tracks' ? 'active' : ''}`}
            onClick={() => handleSourceChange('top-tracks')}
          >
            🔥 My Top Tracks
          </button>
          <button
            className={`option-btn ${preferences.source === 'genre' ? 'active' : ''}`}
            onClick={() => handleSourceChange('genre')}
          >
            🎭 By Genre
          </button>
        </div>

        {preferences.source === 'genre' && (
          <select 
            className="genre-select" 
            value={preferences.genre || ''} 
            onChange={handleGenreChange}
            disabled={loading}
          >
            <option value="">Select a genre...</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>
                {genre.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="preference-section">
        <h4>Playlist Mood</h4>
        <div className="mood-options">
          <button
            className={`option-btn ${preferences.mood === 'energetic' ? 'active' : ''}`}
            onClick={() => handleMoodChange('energetic')}
          >
            ⚡ Energetic
          </button>
          <button
            className={`option-btn ${preferences.mood === 'balanced' ? 'active' : ''}`}
            onClick={() => handleMoodChange('balanced')}
          >
            ⚖️ Balanced
          </button>
          <button
            className={`option-btn ${preferences.mood === 'chill' ? 'active' : ''}`}
            onClick={() => handleMoodChange('chill')}
          >
            😌 Chill
          </button>
          <button
            className={`option-btn ${preferences.mood === 'focused' ? 'active' : ''}`}
            onClick={() => handleMoodChange('focused')}
          >
            🎯 Focused
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreferencePanel;
