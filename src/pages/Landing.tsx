import { Music2, Play, Download, Crown } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useState, useRef } from 'react';

export function Landing() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">The Bible In Music</h1>
                <p className="text-xs text-gray-600">by Excellent Music</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <button
                onClick={() => navigate('login')}
                className="px-4 py-2 text-gray-700 font-medium hover:text-gray-900 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate('register')}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg"
              >
                Sign Up Free
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Listen to the Complete Bible
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              in English & Spanish
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-4">
            66 Books • 1,189 Chapters • 140+ Hours • Plus Christian Music
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Experience scripture through beautifully narrated audio. Stream anywhere, anytime, on any device.
          </p>
        </div>

        {/* Sample Audio Player */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Music2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Genesis Chapter 1 (English)
                </h3>
                <p className="text-gray-600">
                  Sample Audio - No Login Required
                </p>
              </div>
            </div>

            {/* Custom Audio Player */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <audio
                ref={audioRef}
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white hover:from-orange-600 hover:to-orange-700 transition shadow-lg hover:shadow-xl flex-shrink-0"
                >
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-5 bg-white rounded"></div>
                      <div className="w-1 h-5 bg-white rounded"></div>
                    </div>
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    {isPlaying ? 'Now Playing...' : 'Click Play to Listen'}
                  </div>
                  <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-0 transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-700 mt-4 text-center">
                This is a sample preview. Sign up for free to access the complete library!
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('register')}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Listening Free
          </button>
          <button
            onClick={() => navigate('register')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Go Premium - $9.99
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Free forever • No credit card required • Cancel anytime
        </p>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 md:py-24 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Everything You Need to Experience Scripture
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Feature
              emoji="📖"
              title="Complete Bible Audio"
              description="Every chapter in English and Spanish"
            />
            <Feature
              emoji="🎵"
              title="Christian Music Library"
              description="New worship music added monthly"
            />
            <Feature
              emoji="✅"
              title="Lifetime Access"
              description="One-time payment, own forever"
            />
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Free vs Premium
        </h2>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <div className="p-4 font-bold text-lg">Feature</div>
              <div className="p-4 font-bold text-lg text-center border-l border-gray-700">FREE</div>
              <div className="p-4 font-bold text-lg text-center border-l border-amber-600 bg-gradient-to-r from-amber-500 to-amber-600">
                PREMIUM
              </div>
            </div>

            {/* Table Rows */}
            <ComparisonRow feature="Bible Audio" free="✓" premium="✓" />
            <ComparisonRow feature="Music Library" free="✓" premium="✓" />
            <ComparisonRow feature="Listening Hours" free="∞" premium="∞" />
            <ComparisonRow feature="Ads" free="3/hr" premium="✗" isNegative />
            <ComparisonRow feature="Downloads" free="✗" premium="✓" />
            <ComparisonRow feature="Playlists" free="✗" premium="✓" />
            <ComparisonRow feature="Audio Quality" free="128kbps" premium="320kbps" />
            <ComparisonRow feature="Price" free="FREE" premium="$9.99" isLast />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <button
            onClick={() => navigate('register')}
            className="w-full sm:w-auto px-8 py-4 bg-gray-100 text-gray-900 text-lg font-bold rounded-xl hover:bg-gray-200 transition shadow-md"
          >
            Start Free
          </button>
          <button
            onClick={() => navigate('register')}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-lg font-bold rounded-xl hover:from-amber-600 hover:to-amber-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Get Premium - $9.99
          </button>
        </div>
      </section>

      {/* Install App Section (Mobile Focus) */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Phone Mockup */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-48 h-96 bg-white rounded-3xl shadow-2xl border-8 border-gray-800 overflow-hidden">
                  <div className="h-8 bg-gray-900 flex items-center justify-center">
                    <div className="w-20 h-5 bg-gray-800 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-white h-full">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <Music2 className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-xs font-bold text-gray-900">The Bible In Music</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-6xl">📱</div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Install Our App
              </h2>
              <p className="text-lg text-blue-100 mb-6 max-w-xl">
                Add The Bible In Music to your home screen for quick access. Works offline, loads faster, and feels like a native app.
              </p>
              <button
                onClick={() => navigate('help')}
                className="px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
              >
                Install Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands experiencing scripture and worship music daily
          </p>
          <button
            onClick={() => navigate('register')}
            className="px-12 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xl font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            Create Free Account
          </button>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Upgrade anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                <Music2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">The Bible In Music</div>
                <div className="text-sm text-gray-400">by Excellent Music</div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#about" className="text-gray-400 hover:text-white transition">
                About
              </a>
              <a href="#privacy" className="text-gray-400 hover:text-white transition">
                Privacy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-white transition">
                Terms
              </a>
              <a href="mailto:contact@excellentmusic.com" className="text-gray-400 hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © 2026 Excellent Music. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-6">{emoji}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-lg text-gray-600">{description}</p>
    </div>
  );
}

function ComparisonRow({
  feature,
  free,
  premium,
  isNegative = false,
  isLast = false,
}: {
  feature: string;
  free: string;
  premium: string;
  isNegative?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className={`grid grid-cols-3 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className="p-4 font-medium text-gray-900">{feature}</div>
      <div className={`p-4 text-center border-l border-gray-200 ${isNegative && free !== '✗' ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
        {free}
      </div>
      <div className="p-4 text-center border-l border-gray-200 bg-amber-50 text-gray-900 font-semibold">
        {premium}
      </div>
    </div>
  );
}
