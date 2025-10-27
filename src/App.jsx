import React, { useState, useEffect } from 'react';
import SpotifyAuth from './components/SpotifyAuth.jsx';
import TimeSelector from './components/TimeSelector.jsx';
import PreferencePanel from './components/PreferencePanel.jsx';
import PlaylistGenerator from './components/PlaylistGenerator.jsx';
import PlaylistDisplay from './components/PlaylistDisplay.jsx';

// Spotify API configuration
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // You'll need to replace this

// IMPORTANT: This must match EXACTLY what you have in Spotify App Settings
// For HTTPS (secure):
const REDIRECT_URI = 'http://localhost:5173/'; 

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'playlist-modify-public',
  'playlist-modify-private'
].join(' ');

function App() {
  const [token, setToken] = useState(null);
  const [targetDuration, setTargetDuration] = useState(30); // in minutes
  const [preferences, setPreferences] = useState({
    source: 'top-tracks', // 'top-tracks', 'genre', 'mood'
    genre: null,
    mood: 'balanced',
    discoveryLevel: 0.3 // 0 = all familiar, 1 = all new
  });
  const [generatedPlaylist, setGeneratedPlaylist] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check for token in URL hash (Spotify redirects back with token)
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("spotify_token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("spotify_token", token);
    }

    if (token) {
      setToken(token);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        // Token expired
        handleLogout();
        return;
      }

      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&response_type=token&show_dialog=true`;
    window.location = authUrl;
  };

  const handleLogout = () => {
    setToken(null);
    setUserData(null);
    setGeneratedPlaylist(null);
    window.localStorage.removeItem("spotify_token");
  };

  const handleGeneratePlaylist = async () => {
    if (!token) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // This will be handled by the PlaylistGenerator component
      const targetDurationMs = targetDuration * 60 * 1000;
      
      // Fetch seed tracks based on preferences
      let seedTracks = [];
      let seedGenres = [];
      
      if (preferences.source === 'top-tracks') {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=short_term', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        seedTracks = data.items.map(track => track.id);
      } else if (preferences.source === 'genre' && preferences.genre) {
        seedGenres = [preferences.genre];
      }
      
      // Get recommendations
      let recommendationsUrl = 'https://api.spotify.com/v1/recommendations?limit=50';
      if (seedTracks.length > 0) {
        recommendationsUrl += `&seed_tracks=${seedTracks.slice(0, 5).join(',')}`;
      }
      if (seedGenres.length > 0) {
        recommendationsUrl += `&seed_genres=${seedGenres.join(',')}`;
      }
      
      // Add mood-based parameters
      if (preferences.mood === 'energetic') {
        recommendationsUrl += '&min_energy=0.6&min_valence=0.5';
      } else if (preferences.mood === 'chill') {
        recommendationsUrl += '&max_energy=0.5&max_valence=0.6';
      } else if (preferences.mood === 'focused') {
        recommendationsUrl += '&max_speechiness=0.3&min_instrumentalness=0.3';
      }
      
      const recResponse = await fetch(recommendationsUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const recommendations = await recResponse.json();
      
      // Build playlist to match target duration
      const playlist = buildPlaylistForDuration(recommendations.tracks, targetDurationMs);
      setGeneratedPlaylist(playlist);
      
    } catch (err) {
      setError('Failed to generate playlist. Please try again.');
      console.error('Error generating playlist:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const buildPlaylistForDuration = (tracks, targetDurationMs) => {
    const playlist = [];
    let currentDuration = 0;
    const tolerance = 60000; // 1 minute tolerance
    
    // Sort tracks to try different combinations
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    
    for (const track of shuffled) {
      if (currentDuration + track.duration_ms <= targetDurationMs + tolerance) {
        playlist.push(track);
        currentDuration += track.duration_ms;
        
        // If we're within tolerance of target, stop
        if (currentDuration >= targetDurationMs - tolerance) {
          break;
        }
      }
    }
    
    return {
      tracks: playlist,
      totalDuration: currentDuration,
      targetDuration: targetDurationMs
    };
  };

  const handleSavePlaylist = async (playlistName) => {
    if (!token || !userData || !generatedPlaylist) return;
    
    try {
      // Create new playlist
      const createResponse = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: playlistName,
          description: `Generated ${targetDuration}-minute playlist by SpotiFill`,
          public: false
        })
      });
      
      const newPlaylist = await createResponse.json();
      
      // Add tracks to playlist
      const trackUris = generatedPlaylist.tracks.map(track => track.uri);
      await fetch(`https://api.spotify.com/v1/playlists/${newPlaylist.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });
      
      // Open playlist in Spotify
      window.open(newPlaylist.external_urls.spotify, '_blank');
      
    } catch (err) {
      setError('Failed to save playlist to Spotify.');
      console.error('Error saving playlist:', err);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎵 SpotiFill</h1>
        <p>Generate perfect playlists for any duration</p>
      </header>

      {!token ? (
        <SpotifyAuth onLogin={handleLogin} />
      ) : (
        <div className="app-content">
          <div className="user-info">
            <span>Logged in as: {userData?.display_name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>

          <div className="controls-section">
            <TimeSelector 
              duration={targetDuration} 
              onDurationChange={setTargetDuration} 
            />
            
            <PreferencePanel 
              preferences={preferences}
              onPreferencesChange={setPreferences}
              token={token}
            />
            
            <button 
              onClick={handleGeneratePlaylist}
              disabled={isGenerating}
              className="generate-btn"
            >
              {isGenerating ? 'Generating...' : 'Generate Playlist'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {generatedPlaylist && (
            <PlaylistDisplay 
              playlist={generatedPlaylist}
              onSave={handleSavePlaylist}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;