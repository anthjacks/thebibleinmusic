import { useState, useEffect } from 'react';
import { Music2, Play, Download, Heart, Lock, Search, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';

interface MusicContent {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  genre: string | null;
  duration_seconds: number;
  language: 'english' | 'spanish';
  audio_url: string;
  quality_standard: string;
  quality_premium: string | null;
  cover_image_url: string | null;
  created_at: string;
}

type Tab = 'all' | 'genre' | 'new';
type SortBy = 'recent' | 'alphabetical' | 'popular';

const GENRES = [
  'Mariachi Worship',
  'Contemporary Christian',
  'Gospel',
  'Instrumental/Meditation',
  'Traditional Hymns',
  'Spanish Worship',
  'Acoustic Worship',
];

export function Music() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [tracks, setTracks] = useState<MusicContent[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<MusicContent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();
  const { profile } = useAuth();

  useEffect(() => {
    loadMusic();
  }, []);

  useEffect(() => {
    filterAndSortTracks();
  }, [tracks, activeTab, searchQuery, sortBy, selectedGenre]);

  const loadMusic = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audio_content')
      .select('*')
      .eq('content_type', 'music')
      .order('order_index');

    if (error) {
      console.error('Error loading music:', error);
    } else {
      setTracks(data as MusicContent[]);
    }
    setLoading(false);
  };

  const filterAndSortTracks = () => {
    let result = [...tracks];

    if (searchQuery) {
      result = result.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === 'genre' && selectedGenre) {
      result = result.filter((track) => track.genre === selectedGenre);
    }

    if (activeTab === 'new') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      result = result.filter(
        (track) => new Date(track.created_at) >= thirtyDaysAgo
      );
    }

    switch (sortBy) {
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popular':
        result.sort((a, b) => (b.id > a.id ? 1 : -1));
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredTracks(result);
  };

  const handlePlayTrack = (track: MusicContent) => {
    playTrack({
      id: track.id,
      title: track.title,
      content_type: 'music',
      language: track.language,
      artist: track.artist,
      album: track.album,
      book_name: null,
      chapter_number: null,
      duration_seconds: track.duration_seconds,
      audio_url: track.audio_url,
      cover_image_url: track.cover_image_url,
      quality_standard: track.quality_standard,
      quality_premium: track.quality_premium,
    });
  };

  const handleDownload = async (track: MusicContent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile?.is_premium) {
      alert('Downloads are available for Premium members only. Upgrade to download tracks!');
      return;
    }

    const { error } = await supabase.from('downloads').insert({
      user_id: profile.id,
      content_id: track.id,
    });

    if (error && error.code !== '23505') {
      console.error('Error saving download:', error);
    } else {
      const audioUrl = track.quality_premium || track.quality_standard;
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${track.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
            <Music2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Music Library</h1>
            <p className="text-gray-600">Christian worship music & more</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('all');
              setSelectedGenre(null);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'all'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Songs
          </button>
          <button
            onClick={() => setActiveTab('genre')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'genre'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            By Genre
          </button>
          <button
            onClick={() => {
              setActiveTab('new');
              setSelectedGenre(null);
            }}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'new'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            New This Month
          </button>
        </div>
      </div>

      {activeTab === 'genre' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`p-6 rounded-xl border-2 transition text-left ${
                selectedGenre === genre
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{genre}</h3>
              <p className="text-sm text-gray-600">
                {tracks.filter((t) => t.genre === genre).length} songs
              </p>
            </button>
          ))}
        </div>
      ) : null}

      {(activeTab === 'all' || activeTab === 'new' || (activeTab === 'genre' && selectedGenre)) && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="appearance-none px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-white font-medium text-gray-700 cursor-pointer"
              >
                <option value="recent">Recent</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="popular">Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading music library...</div>
          ) : filteredTracks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Music2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Music Found</h3>
              <p className="text-gray-600">
                {tracks.length === 0
                  ? 'Music content is being added regularly. Check back soon!'
                  : 'Try adjusting your search or filters.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={() => handlePlayTrack(track)}
                  onDownload={(e) => handleDownload(track, e)}
                  isPremium={profile?.is_premium || false}
                  showNewBadge={activeTab === 'new'}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TrackCard({
  track,
  onPlay,
  onDownload,
  isPremium,
  showNewBadge,
}: {
  track: MusicContent;
  onPlay: () => void;
  onDownload: (e: React.MouseEvent) => void;
  isPremium: boolean;
  showNewBadge: boolean;
}) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition group cursor-pointer">
      <div
        className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center relative overflow-hidden"
        onClick={onPlay}
      >
        {track.cover_image_url ? (
          <img
            src={track.cover_image_url}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Music2 className="w-16 h-16 text-white opacity-50" />
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition">
            <Play className="w-8 h-8 text-purple-600 ml-1" />
          </div>
        </div>
        {showNewBadge && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
            NEW
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate mb-1">{track.title}</h3>
        <p className="text-sm text-gray-600 truncate mb-2">{track.artist}</p>
        <div className="flex items-center justify-between mb-3">
          {track.genre && (
            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              {track.genre}
            </span>
          )}
          <span className="text-sm text-gray-500">{formatTime(track.duration_seconds)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPlay}
            className="flex-1 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Play
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onDownload}
            className={`p-2 rounded-lg transition ${
              isPremium
                ? 'bg-gray-100 hover:bg-gray-200'
                : 'bg-gray-100 opacity-50 cursor-not-allowed'
            }`}
            disabled={!isPremium}
          >
            {isPremium ? (
              <Download className="w-5 h-5 text-gray-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
