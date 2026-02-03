import { Book, Music2, Crown, Download, ListMusic, Clock, Heart, X, Smartphone, Sparkles, Play, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from '../hooks/useNavigate';
import { useState } from 'react';

export function Home() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [showInstallBanner, setShowInstallBanner] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Install App Banner (Dismissible) */}
        {showInstallBanner && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 md:p-6 text-white shadow-lg relative">
            <button
              onClick={() => setShowInstallBanner(false)}
              className="absolute top-3 right-3 text-white hover:text-blue-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 pr-8">
              <Smartphone className="w-10 h-10 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Install The Bible In Music</h3>
                <p className="text-sm text-blue-100">
                  Add to your home screen for quick access from your home screen
                </p>
              </div>
              <button
                onClick={() => navigate('help')}
                className="hidden md:block px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-md whitespace-nowrap"
              >
                Install Now
              </button>
            </div>
            <button
              onClick={() => navigate('help')}
              className="md:hidden mt-3 w-full px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition shadow-md"
            >
              Install Now
            </button>
          </div>
        )}

        {/* Account Status Banner (Only for Free Users) */}
        {!profile?.is_premium && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">You're on the Free plan</h3>
                <p className="text-amber-100 text-sm">
                  Enjoying The Bible In Music? Remove ads and unlock downloads for just $9.99
                </p>
              </div>
              <button
                onClick={() => navigate('premium')}
                className="px-6 py-2.5 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition shadow-md whitespace-nowrap"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.username || 'Friend'}!
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-gray-600 text-lg">Your account:</p>
            {profile?.is_premium ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                <Crown className="w-4 h-4" />
                PREMIUM MEMBER
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full font-semibold text-sm">
                FREE
              </span>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <LargeActionCard
            icon={<Play className="w-10 h-10" />}
            title="Continue Listening"
            description="No recent tracks"
            gradient="from-orange-500 to-orange-600"
            onClick={() => {}}
            showResume={false}
          />
          <LargeActionCard
            icon={<Book className="w-10 h-10" />}
            title="Browse Bible"
            description="1,189 chapters in English & Spanish"
            gradient="from-blue-500 to-blue-600"
            onClick={() => navigate('bible')}
            actionLabel="Explore Bible"
          />
          <LargeActionCard
            icon={<Music2 className="w-10 h-10" />}
            title="Discover Music"
            description="New worship music added monthly"
            gradient="from-purple-500 to-purple-600"
            onClick={() => navigate('music')}
            actionLabel="Browse Music"
          />
          {profile?.is_premium && (
            <LargeActionCard
              icon={<ListMusic className="w-10 h-10" />}
              title="Your Library"
              description="0 downloads • 0 playlists"
              gradient="from-green-500 to-green-600"
              onClick={() => navigate('playlists')}
              actionLabel="View Library"
            />
          )}
        </div>

        {/* Recently Played Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-600" />
            Recently Played
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                Your last 10 tracks will appear here
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('bible')}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Bible
                </button>
                <button
                  onClick={() => navigate('music')}
                  className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                >
                  Browse Music
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Content - New This Month */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-600" />
            New This Month
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeaturedCard
              title="Blessed Assurance"
              artist="Worship Collective"
              type="Music"
              coverColor="from-pink-500 to-rose-600"
            />
            <FeaturedCard
              title="It Is Well"
              artist="Contemporary Hymns"
              type="Music"
              coverColor="from-blue-500 to-indigo-600"
            />
            <FeaturedCard
              title="In Christ Alone"
              artist="Modern Worship"
              type="Music"
              coverColor="from-emerald-500 to-teal-600"
            />
            <FeaturedCard
              title="10,000 Reasons"
              artist="Praise & Worship"
              type="Music"
              coverColor="from-amber-500 to-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LargeActionCard({
  icon,
  title,
  description,
  gradient,
  onClick,
  actionLabel,
  showResume = true,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  actionLabel?: string;
  showResume?: boolean;
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        {actionLabel && (
          <div className="flex items-center gap-1 text-sm font-semibold text-orange-600 group-hover:gap-2 transition-all">
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </div>
        )}
        {showResume && (
          <button className="mt-2 w-full py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition">
            Resume
          </button>
        )}
      </div>
    </div>
  );
}

function FeaturedCard({
  title,
  artist,
  type,
  coverColor,
}: {
  title: string;
  artist: string;
  type: string;
  coverColor: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100 overflow-hidden cursor-pointer group">
      <div className={`h-40 bg-gradient-to-br ${coverColor} flex items-center justify-center relative overflow-hidden`}>
        <Music2 className="w-16 h-16 text-white opacity-50" />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate mb-1">{title}</h3>
        <p className="text-sm text-gray-600 truncate mb-2">{artist}</p>
        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
          {type}
        </span>
      </div>
    </div>
  );
}
