import { useState, useEffect } from 'react';
import {
  Library, Download, ListMusic, Heart, Clock, Lock, Play, Music2, Book,
  Trash2, Plus, X, Filter, SortAsc, HardDrive, Edit
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';

interface LibraryItem {
  id: string;
  title: string;
  artist?: string;
  book_name?: string;
  chapter_number?: number;
  content_type: 'bible' | 'music';
  duration_seconds: number;
  cover_image_url?: string;
  audio_url: string;
  quality_standard: string;
  quality_premium?: string;
  language: 'english' | 'spanish';
  album?: string | null;
  created_at?: string;
  downloaded_at?: string;
}

type Tab = 'downloads' | 'playlists' | 'favorites' | 'history';
type FilterType = 'all' | 'bible' | 'music';
type SortType = 'date' | 'alphabetical';

export function MyLibrary() {
  const [activeTab, setActiveTab] = useState<Tab>('downloads');
  const [downloads, setDownloads] = useState<LibraryItem[]>([]);
  const [favorites, setFavorites] = useState<LibraryItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const { profile } = useAuth();
  const { playTrack } = usePlayer();

  useEffect(() => {
    loadLibraryData();
  }, [activeTab, profile]);

  const loadLibraryData = async () => {
    if (!profile) return;

    setLoading(true);

    if (activeTab === 'downloads') {
      await loadDownloads();
    } else if (activeTab === 'favorites') {
      await loadFavorites();
    } else if (activeTab === 'history') {
      await loadHistory();
    }

    setLoading(false);
  };

  const loadDownloads = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('downloads')
      .select(`
        content_id,
        created_at,
        audio_content (
          id,
          title,
          artist,
          book_name,
          chapter_number,
          content_type,
          duration_seconds,
          cover_image_url,
          audio_url,
          quality_standard,
          quality_premium,
          language,
          album
        )
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading downloads:', error);
    } else {
      const items = data
        ?.map((d: any) => ({
          ...d.audio_content,
          downloaded_at: d.created_at
        }))
        .filter((item: any) => item !== null) as LibraryItem[];
      setDownloads(items || []);
    }
  };

  const loadFavorites = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        content_id,
        created_at,
        audio_content (
          id,
          title,
          artist,
          book_name,
          chapter_number,
          content_type,
          duration_seconds,
          cover_image_url,
          audio_url,
          quality_standard,
          quality_premium,
          language,
          album
        )
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading favorites:', error);
    } else {
      const items = data
        ?.map((d: any) => ({
          ...d.audio_content,
          created_at: d.created_at
        }))
        .filter((item: any) => item !== null) as LibraryItem[];
      setFavorites(items || []);
    }
  };

  const loadHistory = async () => {
    if (!profile) return;

    const { data, error } = await supabase
      .from('listening_sessions')
      .select(`
        content_id,
        duration_listened_seconds,
        created_at,
        audio_content (
          id,
          title,
          artist,
          book_name,
          chapter_number,
          content_type,
          duration_seconds,
          cover_image_url,
          audio_url,
          quality_standard,
          quality_premium,
          language,
          album
        )
      `)
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error loading history:', error);
    } else {
      setHistory(data || []);
    }
  };

  const handlePlayItem = (item: LibraryItem) => {
    playTrack({
      id: item.id,
      title: item.title,
      content_type: item.content_type,
      language: item.language,
      artist: item.artist || null,
      album: item.album || null,
      book_name: item.book_name || null,
      chapter_number: item.chapter_number || null,
      duration_seconds: item.duration_seconds,
      audio_url: item.audio_url,
      cover_image_url: item.cover_image_url || null,
      quality_standard: item.quality_standard,
      quality_premium: item.quality_premium || null,
    });
  };

  const handleDeleteDownload = async (itemId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('downloads')
      .delete()
      .eq('user_id', profile.id)
      .eq('content_id', itemId);

    if (!error) {
      setDownloads(downloads.filter(d => d.id !== itemId));
    }
  };

  const handleRemoveFavorite = async (itemId: string) => {
    if (!profile) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', profile.id)
      .eq('content_id', itemId);

    if (!error) {
      setFavorites(favorites.filter(f => f.id !== itemId));
    }
  };

  const handleClearHistory = async () => {
    if (!profile || !confirm('Are you sure you want to clear your listening history?')) return;

    const { error } = await supabase
      .from('listening_sessions')
      .delete()
      .eq('user_id', profile.id);

    if (!error) {
      setHistory([]);
    }
  };

  const handleClearAllDownloads = async () => {
    if (!profile || !confirm('Are you sure you want to delete all downloads?')) return;

    const { error } = await supabase
      .from('downloads')
      .delete()
      .eq('user_id', profile.id);

    if (!error) {
      setDownloads([]);
    }
  };

  const getFilteredAndSortedItems = (items: LibraryItem[]) => {
    let filtered = items;

    if (filter === 'bible') {
      filtered = items.filter(item => item.content_type === 'bible');
    } else if (filter === 'music') {
      filtered = items.filter(item => item.content_type === 'music');
    }

    if (sortBy === 'alphabetical') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const getStorageUsed = () => {
    const avgSizeMB = 5;
    const totalMB = downloads.length * avgSizeMB;
    return totalMB.toFixed(1);
  };

  const groupHistoryByTime = () => {
    const now = new Date();
    const groups: { [key: string]: any[] } = {
      Today: [],
      Yesterday: [],
      'This Week': [],
      Older: []
    };

    history.forEach((item) => {
      const itemDate = new Date(item.created_at);
      const diffTime = Math.abs(now.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        groups.Today.push(item);
      } else if (diffDays === 1) {
        groups.Yesterday.push(item);
      } else if (diffDays <= 7) {
        groups['This Week'].push(item);
      } else {
        groups.Older.push(item);
      }
    });

    return groups;
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    if (activeTab === 'downloads') {
      if (!profile?.is_premium) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Downloads Available with Premium</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get unlimited offline downloads for just $9.99
            </p>
            <button
              onClick={() => window.location.href = '/premium'}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition shadow-lg"
            >
              Upgrade to Premium - $9.99
            </button>
          </div>
        );
      }

      if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading downloads...</div>;
      }

      if (downloads.length === 0) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Download className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Downloads Yet</h3>
            <p className="text-gray-600">
              Download your favorite tracks and chapters for offline listening
            </p>
          </div>
        );
      }

      return (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <HardDrive className="w-5 h-5" />
              <span className="font-semibold">Storage used: {getStorageUsed()} MB</span>
            </div>
            <button
              onClick={handleClearAllDownloads}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Clear All Downloads
            </button>
          </div>

          <div className="space-y-2">
            {downloads.map((item) => (
              <DownloadItem
                key={item.id}
                item={item}
                onPlay={() => handlePlayItem(item)}
                onDelete={() => handleDeleteDownload(item.id)}
              />
            ))}
          </div>
        </>
      );
    }

    if (activeTab === 'playlists') {
      if (!profile?.is_premium) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Playlists Available with Premium</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create custom playlists for $9.99
            </p>
            <button
              onClick={() => window.location.href = '/premium'}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-700 transition shadow-lg"
            >
              Upgrade to Premium - $9.99
            </button>
          </div>
        );
      }

      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ListMusic className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Playlists Coming Soon</h3>
          <p className="text-gray-600 mb-6">
            Create and organize your favorite content into custom playlists
          </p>
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Playlist
          </button>
        </div>
      );
    }

    if (activeTab === 'favorites') {
      if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading favorites...</div>;
      }

      if (favorites.length === 0) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600">
              Tap the heart icon on any track or chapter to add it to your favorites
            </p>
          </div>
        );
      }

      const filteredAndSorted = getFilteredAndSortedItems(favorites);

      return (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('bible')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'bible' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Bible
              </button>
              <button
                onClick={() => setFilter('music')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'music' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Music
              </button>
            </div>
            <div className="flex items-center gap-2">
              <SortAsc className="w-5 h-5 text-gray-600" />
              <button
                onClick={() => setSortBy('date')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  sortBy === 'date' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Date Added
              </button>
              <button
                onClick={() => setSortBy('alphabetical')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  sortBy === 'alphabetical' ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Alphabetical
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredAndSorted.map((item) => (
              <FavoriteItem
                key={item.id}
                item={item}
                onPlay={() => handlePlayItem(item)}
                onRemove={() => handleRemoveFavorite(item.id)}
              />
            ))}
          </div>
        </>
      );
    }

    if (activeTab === 'history') {
      if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading history...</div>;
      }

      if (history.length === 0) {
        return (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Listening History</h3>
            <p className="text-gray-600">
              Your recently played tracks and chapters will appear here
            </p>
          </div>
        );
      }

      const groupedHistory = groupHistoryByTime();

      return (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-end">
            <button
              onClick={handleClearHistory}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
            >
              Clear History
            </button>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([period, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={period}>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{period}</h3>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <HistoryItem
                        key={`${item.content_id}-${index}`}
                        item={item}
                        onPlay={() => handlePlayItem(item.audio_content)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl flex items-center justify-center">
          <Library className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Library</h1>
          <p className="text-gray-600">Your personal collection</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('downloads')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'downloads'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Download className="w-5 h-5" />
            Downloads
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'playlists'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListMusic className="w-5 h-5" />
            Playlists
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${
              activeTab === 'history'
                ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Clock className="w-5 h-5" />
            History
          </button>
        </div>
      </div>

      {renderContent()}

      {showCreatePlaylist && (
        <CreatePlaylistModal onClose={() => setShowCreatePlaylist(false)} />
      )}
    </div>
  );
}

function DownloadItem({ item, onPlay, onDelete }: {
  item: LibraryItem;
  onPlay: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded-lg" />
        ) : item.content_type === 'bible' ? (
          <Book className="w-8 h-8 text-white" />
        ) : (
          <Music2 className="w-8 h-8 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
        <p className="text-sm text-gray-600 truncate">
          {item.content_type === 'bible'
            ? `${item.book_name} Chapter ${item.chapter_number}`
            : item.artist}
        </p>
        <p className="text-xs text-gray-500">
          Downloaded: {item.downloaded_at ? new Date(item.downloaded_at).toLocaleDateString() : 'Unknown'} • ~5 MB
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPlay}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium inline-flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function FavoriteItem({ item, onPlay, onRemove }: {
  item: LibraryItem;
  onPlay: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
        {item.cover_image_url ? (
          <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover rounded-lg" />
        ) : item.content_type === 'bible' ? (
          <Book className="w-8 h-8 text-white" />
        ) : (
          <Music2 className="w-8 h-8 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            item.content_type === 'bible' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
          }`}>
            {item.content_type === 'bible' ? 'BIBLE' : 'MUSIC'}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {item.content_type === 'bible'
            ? `${item.book_name} Chapter ${item.chapter_number}`
            : item.artist}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPlay}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium inline-flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Play
        </button>
        <button
          onClick={onRemove}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Remove from favorites"
        >
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
}

function HistoryItem({ item, onPlay }: {
  item: any;
  onPlay: () => void;
}) {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
  };

  const content = item.audio_content;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
        {content.cover_image_url ? (
          <img src={content.cover_image_url} alt={content.title} className="w-full h-full object-cover rounded-lg" />
        ) : content.content_type === 'bible' ? (
          <Book className="w-8 h-8 text-white" />
        ) : (
          <Music2 className="w-8 h-8 text-white" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 truncate">{content.title}</h4>
        <p className="text-sm text-gray-600 truncate">
          {content.content_type === 'bible'
            ? `${content.book_name} Chapter ${content.chapter_number}`
            : content.artist}
        </p>
        <p className="text-xs text-gray-500">{formatTimeAgo(item.created_at)}</p>
      </div>

      <button
        onClick={onPlay}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium inline-flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        Play Again
      </button>
    </div>
  );
}

function CreatePlaylistModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Playlist</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Playlist Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="My Awesome Playlist"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Add a description for your playlist"
            />
          </div>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition"
          >
            Save Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
