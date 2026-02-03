import { useState } from 'react';
import { User, Crown, LogOut, Globe, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Profile() {
  const { profile, user, signOut } = useAuth();
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || 'english');
  const [saving, setSaving] = useState(false);

  const handleSaveLanguage = async () => {
    if (!profile) return;

    setSaving(true);
    const { error } = await supabase
      .from('user_profiles')
      .update({ preferred_language: preferredLanguage })
      .eq('id', profile.id);

    if (error) {
      console.error('Error updating language:', error);
      alert('Failed to update language preference');
    } else {
      alert('Language preference updated!');
      window.location.reload();
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{profile?.username}</h1>
          {profile?.is_premium && (
            <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full font-semibold">
              <Crown className="w-5 h-5" />
              Premium Member
            </div>
          )}
        </div>

        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-medium text-gray-900">{profile?.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Crown className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Membership</p>
                  <p className="font-medium text-gray-900">
                    {profile?.is_premium ? 'Premium (Lifetime)' : 'Free'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Preferred Language</span>
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="english">English</option>
                  <option value="spanish">Español (Spanish)</option>
                </select>
                {preferredLanguage !== profile?.preferred_language && (
                  <button
                    onClick={handleSaveLanguage}
                    disabled={saving}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Language Preference'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {!profile?.is_premium && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Get lifetime access to ad-free listening, downloads, playlists, and more for just $9.99
                  </p>
                  <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200">
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
