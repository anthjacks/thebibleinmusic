import { useState } from 'react';
import { Music2, Book, ListMusic, Crown, User, Menu, X, HelpCircle, Home, Library, Settings } from 'lucide-react';
import { useCurrentPage, useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPage = useCurrentPage();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'bible' as const, label: 'Bible', icon: Book },
    { id: 'music' as const, label: 'Music', icon: Music2 },
    { id: 'my-library' as const, label: 'My Library', icon: Library },
    { id: 'playlists' as const, label: 'Playlists', icon: ListMusic, premiumOnly: true },
    { id: 'premium' as const, label: 'Premium', icon: Crown },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'account' as const, label: 'Settings', icon: Settings },
    { id: 'help' as const, label: 'Help', icon: HelpCircle },
  ];

  const handleNavigate = (page: typeof navItems[number]['id']) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">The Bible In Music</h1>
              <p className="text-xs text-gray-600">by Excellent Music</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const showPremiumBadge = item.premiumOnly && !profile?.is_premium;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {showPremiumBadge && <Crown className="w-4 h-4 text-amber-500" />}
                  {item.id === 'premium' && !profile?.is_premium && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      $9.99
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const showPremiumBadge = item.premiumOnly && !profile?.is_premium;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                    {showPremiumBadge && <Crown className="w-4 h-4 text-amber-500" />}
                    {item.id === 'premium' && !profile?.is_premium && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full ml-auto">
                        $9.99
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
