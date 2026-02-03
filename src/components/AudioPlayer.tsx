import { useState } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward,
  Heart, Download, Shuffle, Repeat, X, RotateCcw, RotateCw, Lock
} from 'lucide-react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAuth } from '../contexts/AuthContext';

export function AudioPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isPlayingAd,
    adProgress,
    canSkipAd,
    togglePlayPause,
    seek,
    changeVolume,
    skipForward,
    skipBackward,
    skipAd,
  } = useAudioPlayer();

  const { profile } = useAuth();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPlayingAd) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(duration * percentage);
  };

  const toggleRepeat = () => {
    setRepeatMode((mode) => {
      if (mode === 'off') return 'one';
      if (mode === 'one') return 'all';
      return 'off';
    });
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {isPlayingAd && (
        <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-3 text-center z-50 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <p className="font-semibold mb-1">Advertisement {adProgress > 0 ? `- ${Math.ceil(30 - adProgress)}s remaining` : ''}</p>
            <p className="text-sm opacity-90">Listening to ads supports free access to The Bible In Music</p>
            {canSkipAd && (
              <button
                onClick={skipAd}
                className="mt-2 px-4 py-1 bg-white text-orange-600 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
              >
                Skip Ad
              </button>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:opacity-80 transition"
              onClick={() => setIsExpanded(true)}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                {currentTrack.cover_image_url ? (
                  <img
                    src={currentTrack.cover_image_url}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Music className="w-7 h-7 text-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">{currentTrack.title}</h4>
                <p className="text-sm text-slate-300 truncate">
                  {currentTrack.content_type === 'bible'
                    ? `${currentTrack.book_name} ${currentTrack.chapter_number}`
                    : currentTrack.artist}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => skipBackward()}
                disabled={isPlayingAd}
                className="text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition p-2"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlayPause}
                disabled={isPlayingAd}
                className="w-12 h-12 bg-white hover:bg-blue-50 disabled:bg-gray-400 text-slate-900 rounded-full flex items-center justify-center transition shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={() => skipForward()}
                disabled={isPlayingAd}
                className="text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition p-2"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={togglePlayPause}
                disabled={isPlayingAd}
                className="w-10 h-10 bg-white hover:bg-blue-50 disabled:bg-gray-400 text-slate-900 rounded-full flex items-center justify-center transition"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`transition p-2 ${isShuffle ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                title="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button className="text-slate-400 hover:text-red-400 transition p-2" title="Favorite">
                <Heart className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 w-28">
                <button onClick={() => changeVolume(volume > 0 ? 0 : 1)} className="text-slate-300 hover:text-white">
                  {volume > 0 ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
              </div>

              <div className="text-sm text-slate-300 w-24 text-right tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          <div className="mt-2">
            <div
              className="relative h-1 bg-slate-700 rounded-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-4 right-4 text-white hover:text-blue-400 transition z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-2xl w-full">
            <div className="flex flex-col items-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                {currentTrack.cover_image_url ? (
                  <img
                    src={currentTrack.cover_image_url}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <Music className="w-32 h-32 text-white opacity-50" />
                )}
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-2">{currentTrack.title}</h2>
              <p className="text-xl text-slate-300 text-center mb-8">
                {currentTrack.content_type === 'bible'
                  ? `${currentTrack.book_name} Chapter ${currentTrack.chapter_number}`
                  : currentTrack.artist}
              </p>

              <div className="w-full mb-6">
                <div
                  className="relative h-2 bg-slate-700 rounded-full cursor-pointer group mb-2"
                  onClick={handleSeek}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                    style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                  />
                </div>
                <div className="flex justify-between text-sm text-slate-300 tabular-nums">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mb-8">
                <button
                  onClick={() => seek(Math.max(0, currentTime - 15))}
                  disabled={isPlayingAd}
                  className="text-white hover:text-blue-400 disabled:opacity-50 transition"
                  title="Rewind 15s"
                >
                  <RotateCcw className="w-8 h-8" />
                </button>

                <button
                  onClick={() => skipBackward()}
                  disabled={isPlayingAd}
                  className="text-white hover:text-blue-400 disabled:opacity-50 transition"
                  title="Previous"
                >
                  <SkipBack className="w-8 h-8" />
                </button>

                <button
                  onClick={togglePlayPause}
                  disabled={isPlayingAd}
                  className="w-20 h-20 bg-white hover:bg-blue-50 disabled:bg-gray-400 text-slate-900 rounded-full flex items-center justify-center transition shadow-2xl"
                >
                  {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
                </button>

                <button
                  onClick={() => skipForward()}
                  disabled={isPlayingAd}
                  className="text-white hover:text-blue-400 disabled:opacity-50 transition"
                  title="Next"
                >
                  <SkipForward className="w-8 h-8" />
                </button>

                <button
                  onClick={() => seek(Math.min(duration, currentTime + 15))}
                  disabled={isPlayingAd}
                  className="text-white hover:text-blue-400 disabled:opacity-50 transition"
                  title="Forward 15s"
                >
                  <RotateCw className="w-8 h-8" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 flex-wrap">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isShuffle ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />
                  <span className="text-sm font-medium">Shuffle</span>
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    repeatMode !== 'off' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Repeat className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {repeatMode === 'off' ? 'Repeat' : repeatMode === 'one' ? 'One' : 'All'}
                  </span>
                </button>

                <button
                  onClick={cycleSpeed}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  <span className="text-sm font-medium">{playbackSpeed}x</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-red-400 transition">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Favorite</span>
                </button>

                <button
                  disabled={!profile?.is_premium}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    profile?.is_premium
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  {profile?.is_premium ? (
                    <Download className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium">Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
