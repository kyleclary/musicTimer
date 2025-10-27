import React, { useState } from 'react';

function PlaylistDisplay({ playlist, onSave }) {
  const [playlistName, setPlaylistName] = useState('');
  
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (ms) => {
    const totalMinutes = Math.floor(ms / 1000 / 60);
    if (totalMinutes < 60) {
      return `${totalMinutes} minutes`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateAccuracy = () => {
    const diff = Math.abs(playlist.totalDuration - playlist.targetDuration);
    const percentDiff = (diff / playlist.targetDuration) * 100;
    
    if (percentDiff < 2) return { text: 'Perfect fit!', class: '' };
    if (percentDiff < 5) return { text: 'Great match!', class: '' };
    return { text: 'Good enough!', class: 'warning' };
  };

  const accuracy = calculateAccuracy();
  
  const handleSave = () => {
    const name = playlistName || `SpotiFill ${formatTotalTime(playlist.totalDuration)} Mix`;
    onSave(name);
    setPlaylistName('');
  };

  return (
    <div className="playlist-display">
      <div className="playlist-header">
        <div className="playlist-stats">
          <div className="stat">
            <div className="stat-value">{playlist.tracks.length}</div>
            <div className="stat-label">Tracks</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatTotalTime(playlist.totalDuration)}</div>
            <div className="stat-label">Actual Duration</div>
          </div>
          <div className="stat">
            <div className="stat-value">{formatTotalTime(playlist.targetDuration)}</div>
            <div className="stat-label">Target Duration</div>
          </div>
        </div>
        <div className={`duration-accuracy ${accuracy.class}`}>
          {accuracy.text}
        </div>
      </div>

      <div className="tracks-list">
        {playlist.tracks.map((track, index) => (
          <div key={track.id} className="track-item">
            <div className="track-number">{index + 1}</div>
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">
                {track.artists.map(artist => artist.name).join(', ')}
              </div>
            </div>
            <div className="track-duration">{formatTime(track.duration_ms)}</div>
          </div>
        ))}
      </div>

      <div className="save-section">
        <input
          type="text"
          className="playlist-name-input"
          placeholder="Enter playlist name (optional)"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <button onClick={handleSave} className="save-to-spotify-btn">
          💚 Save to Spotify
        </button>
      </div>
    </div>
  );
}

export default PlaylistDisplay;
