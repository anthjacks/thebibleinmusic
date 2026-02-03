import { useState, useEffect } from 'react';
import { ListMusic, Plus, Play, Trash2, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePlayer } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface PlaylistItem {
  id: string;
  content: {
    id: string;
    title: string;
    content_type: 'bible' | 'music';
    artist: string | null;
    book_name: string | null;
    chapter_number: number | null;
    duration_seconds: number;
    language: 'english' | 'spanish';
    audio_url: string;
    quality_standard: string;
    quality_premium: string | null;
    cover_image_url: string | null;
  };
}

export function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const { playTrack } = usePlayer();
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && !profile.is_premium) {
      return;
    }
    loadPlaylists();
  }, [profile]);

  useEffect(() => {
    if (selectedPlaylist) {
      loadPlaylistItems();
    }
  }, [selectedPlaylist]);

  const loadPlaylists = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading playlists:', error);
    } else {
      setPlaylists(data);
    }
    setLoading(false);
  };

  const loadPlaylistItems = async () => {
    if (!selectedPlaylist) return;

    const { data, error } = await supabase
      .from('playlist_items')
      .select(`
        id,
        content:audio_content(*)
      `)
      .eq('playlist_id', selectedPlaylist)
      .order('order_index');

    if (error) {
      console.error('Error loading playlist items:', error);
    } else {
      setPlaylistItems(data as unknown as PlaylistItem[]);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim() || !profile) return;

    const { error } = await supabase.from('playlists').insert({
      user_id: profile.id,
      name: newPlaylistName,
      description: newPlaylistDesc || null,
    });

    if (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist');
    } else {
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowCreateModal(false);
      loadPlaylists();
    }
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;

    const { error } = await supabase.from('playlists').delete().eq('id', playlistId);

    if (error) {
      console.error('Error deleting playlist:', error);
    } else {
      if (selectedPlaylist === playlistId) {
        setSelectedPlaylist(null);
        setPlaylistItems([]);
      }
      loadPlaylists();
    }
  };

  const removeFromPlaylist = async (itemId: string) => {
    const { error } = await supabase.from('playlist_items').delete().eq('id', itemId);

    if (error) {
      console.error('Error removing item:', error);
    } else {
      loadPlaylistItems();
    }
  };

  const handlePlayItem = (item: PlaylistItem) => {
    playTrack({
      id: item.content.id,
      title: item.content.title,
      content_type: item.content.content_type,
      language: item.content.language,
      artist: item.content.artist,
      album: null,
      book_name: item.content.book_name,
      chapter_number: item.content.chapter_number,
      duration_seconds: item.content.duration_seconds,
      audio_url: item.content.audio_url,
      cover_image_url: item.content.cover_image_url,
      quality_standard: item.content.quality_standard,
      quality_premium: item.content.quality_premium,
    });
  };

  if (!profile?.is_premium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premium Feature</h2>
          <p className="text-lg text-gray-700 mb-8">
            Create and manage custom playlists with Premium membership.
          </p>
          <button
            onClick={() => navigate('premium')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition"
          >
            Upgrade to Premium - $9.99
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
            <ListMusic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
            <p className="text-gray-600">Create and manage your custom playlists</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus className="w-5 h-5" />
          New Playlist
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading playlists...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Playlists</h2>
            {playlists.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ListMusic className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No playlists yet. Create your first playlist!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition ${
                      selectedPlaylist === playlist.id
                        ? 'bg-purple-50 border-purple-600'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedPlaylist(playlist.id)}
                      className="flex-1 text-left"
                    >
                      <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-600 mt-1">{playlist.description}</p>
                      )}
                    </button>
                    <button
                      onClick={() => deletePlaylist(playlist.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {!selectedPlaylist ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <ListMusic className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a playlist to view tracks</p>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tracks</h2>
                {playlistItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>This playlist is empty.</p>
                    <p className="text-sm mt-2">Add tracks from the Bible or Music pages.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {playlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.content.title}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {item.content.content_type === 'bible'
                              ? `${item.content.book_name} ${item.content.chapter_number}`
                              : item.content.artist}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromPlaylist(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePlayItem(item)}
                            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Playlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="My Favorite Worship Songs"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Add a description..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={createPlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
