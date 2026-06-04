import { createContext, useContext, useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [track, setTrack] = useState(null);

  function play({ title, artist, color }) {
    setTrack({ title, artist, color: color || '#7c3aed' });
  }

  function stop() {
    setTrack(null);
  }

  return (
    <PlayerContext.Provider value={{ play, stop }}>
      {children}
      {track && <AudioPlayer track={track} onClose={stop} />}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
