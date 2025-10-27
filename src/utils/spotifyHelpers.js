// Spotify API utility functions

export const SPOTIFY_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID',
  REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI || 'http://localhost:5173/',
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private'
  ]
};

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CONFIG.CLIENT_ID,
    redirect_uri: SPOTIFY_CONFIG.REDIRECT_URI,
    scope: SPOTIFY_CONFIG.SCOPES.join(' '),
    response_type: 'token',
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getTokenFromUrl = () => {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1));
  return params.get('access_token');
};

export const fetchWithToken = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (response.status === 401) {
    // Token expired
    throw new Error('TOKEN_EXPIRED');
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// Algorithm to optimize playlist duration
export const optimizePlaylistDuration = (tracks, targetDurationMs, tolerance = 60000) => {
  // Sort tracks by duration to try different combinations
  const sortedTracks = [...tracks].sort((a, b) => a.duration_ms - b.duration_ms);
  
  // Dynamic programming approach to find best combination
  const dp = new Map();
  dp.set(0, []);
  
  for (const track of sortedTracks) {
    const newEntries = [];
    
    for (const [duration, playlist] of dp.entries()) {
      const newDuration = duration + track.duration_ms;
      
      // Skip if we're way over target
      if (newDuration > targetDurationMs + tolerance * 2) continue;
      
      if (!dp.has(newDuration) || dp.get(newDuration).length > playlist.length + 1) {
        newEntries.push([newDuration, [...playlist, track]]);
      }
    }
    
    for (const [duration, playlist] of newEntries) {
      dp.set(duration, playlist);
    }
  }
  
  // Find the playlist closest to target duration
  let bestDuration = 0;
  let bestPlaylist = [];
  
  for (const [duration, playlist] of dp.entries()) {
    if (Math.abs(duration - targetDurationMs) < Math.abs(bestDuration - targetDurationMs)) {
      bestDuration = duration;
      bestPlaylist = playlist;
    }
  }
  
  return {
    tracks: bestPlaylist,
    totalDuration: bestDuration,
    targetDuration: targetDurationMs
  };
};

// Format milliseconds to readable time
export const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
