import React from 'react';

function TimeSelector({ duration, onDurationChange }) {
  const presets = [
    { label: '15 min', value: 15 },
    { label: '25 min', value: 25 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '90 min', value: 90 },
    { label: '2 hours', value: 120 }
  ];

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="time-selector">
      <h3>
        <span>⏱️</span>
        <span>How much time do you have?</span>
      </h3>
      
      <div className="duration-display">
        <div className="duration-value">{formatDuration(duration)}</div>
        <div className="duration-label">Target Duration</div>
      </div>

      <div className="duration-slider">
        <input
          type="range"
          min="5"
          max="180"
          step="5"
          value={duration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
        />
      </div>

      <div className="preset-buttons">
        {presets.map(preset => (
          <button
            key={preset.value}
            className={`preset-btn ${duration === preset.value ? 'active' : ''}`}
            onClick={() => onDurationChange(preset.value)}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSelector;