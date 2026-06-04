import { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

export default function AudioPlayer({ track, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(p => p >= 100 ? 0 : p + 0.3);
      }, 300);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  const initials = track.title
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="audio-player">
      <div className="audio-art" style={{ background: track.color || '#7c3aed' }}>
        {initials}
      </div>
      <div className="audio-info">
        <div className="audio-title">{track.title}</div>
        <div className="audio-artist">{track.artist}</div>
      </div>
      <div className="audio-controls">
        <button className="audio-playpause" onClick={() => setIsPlaying(p => !p)}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
      <div className="audio-progress-wrap">
        <div className="audio-progress-bar">
          <div className="audio-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="audio-time">{Math.floor(progress * 3.5 / 100)}:{String(Math.floor((progress * 3.5 / 100 % 1) * 60)).padStart(2,'0')} / 3:30</div>
      </div>
      <button className="audio-close" onClick={onClose}>✕</button>
    </div>
  );
}
