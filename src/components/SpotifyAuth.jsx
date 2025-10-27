import React from 'react';

function SpotifyAuth({ onLogin }) {
  return (
    <div className="auth-container">
      <h2>Welcome to SpotiFill</h2>
      <p>Create perfect playlists for any duration - workouts, commutes, study sessions, and more!</p>
      <button onClick={onLogin} className="spotify-login-btn">
        <span>🎵</span>
        <span>Connect with Spotify</span>
      </button>
      <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#999' }}>
        We'll need access to your top tracks and ability to create playlists
      </p>
    </div>
  );
}

export default SpotifyAuth;
