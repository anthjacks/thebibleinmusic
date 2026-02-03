import { createContext, useContext, ReactNode } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioContent {
  id: string;
  title: string;
  content_type: 'bible' | 'music';
  language: 'english' | 'spanish';
  artist: string | null;
  album: string | null;
  book_name: string | null;
  chapter_number: number | null;
  duration_seconds: number;
  audio_url: string;
  cover_image_url: string | null;
  quality_standard: string;
  quality_premium: string | null;
}

interface PlayerContextType {
  currentTrack: AudioContent | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isPlayingAd: boolean;
  adProgress: number;
  playTrack: (track: AudioContent) => Promise<void>;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  changeVolume: (volume: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer();

  return <PlayerContext.Provider value={player}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
