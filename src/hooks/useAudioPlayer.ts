import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

interface AdConfig {
  url: string;
  duration: number;
}

const SAMPLE_ADS: AdConfig[] = [
  { url: 'https://example.com/ad1.mp3', duration: 15 },
  { url: 'https://example.com/ad2.mp3', duration: 20 },
  { url: 'https://example.com/ad3.mp3', duration: 15 },
];

const AD_INTERVAL_SECONDS = 1200;

export function useAudioPlayer() {
  const { profile } = useAuth();
  const [currentTrack, setCurrentTrack] = useState<AudioContent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [canSkipAd, setCanSkipAd] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const totalListeningTimeRef = useRef(0);
  const lastAdTimeRef = useRef(0);
  const trackingIntervalRef = useRef<number | null>(null);
  const adSkipTimerRef = useRef<number | null>(null);
  const savedTrackDataRef = useRef<{ src: string; time: number } | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleTrackEnded);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
    }

    // Keyboard controls
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleTrackEnded);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
      }
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isPlayingAd) {
      setCurrentTime(audioRef.current.currentTime);
    } else if (audioRef.current && isPlayingAd) {
      setAdProgress(audioRef.current.currentTime);
    }
  };

  const handlePlay = () => {
    updateMediaSession();
  };

  const handlePause = () => {
    updateMediaSession();
  };

  // Track listening time every second when audio is playing
  useEffect(() => {
    let interval: number | null = null;

    if (isPlaying && !isPlayingAd && !profile?.is_premium) {
      interval = window.setInterval(() => {
        totalListeningTimeRef.current += 1;

        if (totalListeningTimeRef.current - lastAdTimeRef.current >= AD_INTERVAL_SECONDS) {
          playAd();
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, isPlayingAd, profile?.is_premium]);

  const playAd = () => {
    if (!audioRef.current || !currentTrack) return;

    const savedTime = audioRef.current.currentTime;
    const savedSrc = audioRef.current.src;

    savedTrackDataRef.current = { src: savedSrc, time: savedTime };

    audioRef.current.pause();
    setIsPlayingAd(true);
    setAdProgress(0);
    setCanSkipAd(false);

    adSkipTimerRef.current = window.setTimeout(() => {
      setCanSkipAd(true);
    }, 5000);

    const ad = SAMPLE_ADS[Math.floor(Math.random() * SAMPLE_ADS.length)];
    audioRef.current.src = ad.url;
    audioRef.current.load();

    const handleAdEnded = () => {
      if (audioRef.current && savedTrackDataRef.current) {
        audioRef.current.src = savedTrackDataRef.current.src;
        audioRef.current.currentTime = savedTrackDataRef.current.time;
        audioRef.current.play().catch(console.error);
        audioRef.current.removeEventListener('ended', handleAdEnded);
      }
      setIsPlayingAd(false);
      setCanSkipAd(false);
      lastAdTimeRef.current = totalListeningTimeRef.current;
      if (adSkipTimerRef.current) {
        clearTimeout(adSkipTimerRef.current);
      }
    };

    audioRef.current.addEventListener('ended', handleAdEnded);
    audioRef.current.play().catch(console.error);
  };

  const skipAd = () => {
    if (!audioRef.current || !canSkipAd || !savedTrackDataRef.current) return;

    audioRef.current.pause();
    audioRef.current.src = savedTrackDataRef.current.src;
    audioRef.current.currentTime = savedTrackDataRef.current.time;
    audioRef.current.play().catch(console.error);

    setIsPlayingAd(false);
    setCanSkipAd(false);
    lastAdTimeRef.current = totalListeningTimeRef.current;

    if (adSkipTimerRef.current) {
      clearTimeout(adSkipTimerRef.current);
    }
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(duration, currentTime + 15);
    seek(newTime);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, currentTime - 15);
    seek(newTime);
  };

  const handleTrackEnded = async () => {
    setIsPlaying(false);
    setCurrentTime(0);

    if (sessionIdRef.current && currentTrack) {
      await supabase
        .from('listening_sessions')
        .update({ completed: true })
        .eq('id', sessionIdRef.current);
    }
  };

  const startSession = async (track: AudioContent) => {
    if (!profile) return;

    const { data } = await supabase
      .from('listening_sessions')
      .insert({
        user_id: profile.id,
        content_id: track.id,
        duration_listened_seconds: 0,
        completed: false,
      })
      .select()
      .single();

    if (data) {
      sessionIdRef.current = data.id;
      startTracking();
    }
  };

  const startTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }

    trackingIntervalRef.current = window.setInterval(async () => {
      if (sessionIdRef.current && isPlaying && !isPlayingAd) {
        await supabase
          .from('listening_sessions')
          .update({
            duration_listened_seconds: Math.floor(currentTime),
          })
          .eq('id', sessionIdRef.current);
      }
    }, 10000);
  };

  const updateMediaSession = () => {
    if ('mediaSession' in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: currentTrack.content_type === 'bible'
          ? `${currentTrack.book_name} Chapter ${currentTrack.chapter_number}`
          : currentTrack.artist || 'Unknown Artist',
        album: currentTrack.content_type === 'bible'
          ? 'The Bible In Music'
          : currentTrack.album || undefined,
        artwork: currentTrack.cover_image_url ? [
          { src: currentTrack.cover_image_url, sizes: '512x512', type: 'image/png' }
        ] : undefined,
      });

      navigator.mediaSession.setActionHandler('play', () => {
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        togglePlayPause();
      });

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        skipBackward();
      });

      navigator.mediaSession.setActionHandler('seekforward', () => {
        skipForward();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        skipBackward();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        skipForward();
      });
    }
  };

  const playTrack = async (track: AudioContent) => {
    if (!audioRef.current) return;

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(0);

    const audioUrl = profile?.is_premium && track.quality_premium
      ? track.quality_premium
      : track.quality_standard;

    audioRef.current.src = audioUrl;
    audioRef.current.load();

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      updateMediaSession();
      await startSession(track);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isPlayingAd,
    adProgress,
    canSkipAd,
    playTrack,
    togglePlayPause,
    seek,
    changeVolume,
    skipForward,
    skipBackward,
    skipAd,
  };
}
