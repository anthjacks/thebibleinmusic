import { useState, useEffect } from 'react';
import { User, Mail, Lock, Crown, Trash2, LogOut, Bell, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from '../hooks/useNavigate';

export function Account() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstallation();
  }, []);

  const handleEmailChange = async () => {
    if (!newEmail) {
      alert('Please enter a new email address');
      return;
    }

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      alert('Error updating email: ' + error.message);
    } else {
      alert('Email update initiated. Please check your new email for confirmation.');
      setShowEmailChange(false);
      setNewEmail('');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert('Error updating password: ' + error.message);
    } else {
      alert('Password updated successfully');
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      'This will permanently delete all your data including favorites, playlists, and listening history. Continue?'
    );

    if (!doubleConfirm) return;

    alert('Account deletion would be implemented here. Please contact support to delete your account.');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('landing');
  };

  const getPremiumDate = () => {
    if (profile?.created_at) {
      return new Date(profile.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Recently';
  };

  const handleInstallApp = () => {
    alert('To install the app:\n\niOS: Tap the Share button, then "Add to Home Screen"\n\nAndroid: Tap the menu (⋮) and select "Install app" or "Add to Home screen"');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Section
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
                <button
                  onClick={() => setShowEmailChange(!showEmailChange)}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
                >
                  Change Email
                </button>
              </div>

              {showEmailChange && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEmailChange}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Update Email
                    </button>
                    <button
                      onClick={() => {
                        setShowEmailChange(false);
                        setNewEmail('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>

              {showPasswordChange && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min. 6 characters)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handlePasswordChange}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordChange(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Subscription Section
          </h2>

          {profile?.is_premium ? (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-xl font-bold text-gray-900">Premium Member</span>
                  </div>
                  <p className="text-sm text-gray-600">Premium since {getPremiumDate()}</p>
                </div>
              </div>
              <p className="text-gray-700 font-medium mb-2">
                Thank you for supporting our ministry!
              </p>
              <p className="text-sm text-gray-600">
                You have lifetime access to all premium features including ad-free listening, unlimited downloads, and playlists.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">Free Account</span>
                  <p className="text-sm text-gray-600">Limited features</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Upgrade to Premium for just $9.99 and unlock:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Ad-free listening</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Unlimited downloads</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Create playlists</span>
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Premium audio quality</span>
                </li>
              </ul>
              <button
                onClick={() => navigate('premium')}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 transition"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">App Installation Status</h2>

          {isInstalled ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">App Installed</p>
                <p className="text-sm text-gray-600">You can access the app from your home screen</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-700 mb-3">
                Install our app for easier access and offline functionality
              </p>
              <button
                onClick={handleInstallApp}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Install App
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive updates about new content</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-7 rounded-full transition ${
                  emailNotifications ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium w-full justify-center"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
