import { useEffect, useState } from 'react';
import { Crown, Check, Music, Download, ListMusic, Volume, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from '../hooks/useNavigate';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function Success() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const validatePayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get('payment_id');

      if (!paymentId) {
        setError('No payment confirmation found. Please try purchasing again.');
        setLoading(false);
        return;
      }

      if (!user) {
        setError('User not authenticated. Please log in and try again.');
        setLoading(false);
        return;
      }

      try {
        await refreshProfile();
        setLoading(false);
      } catch (err) {
        console.error('Payment validation error:', err);
        setError('An error occurred. Please contact support with your payment ID: ' + paymentId);
        setLoading(false);
      }
    };

    validatePayment();
  }, [user, refreshProfile]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming your payment...</h2>
        <p className="text-gray-600">Please wait while we verify your premium access.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Error</h2>
          <p className="text-lg text-gray-700 mb-8">{error}</p>
          <button
            onClick={() => navigate('premium')}
            className="px-8 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition"
          >
            Return to Premium Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-12 text-center shadow-2xl">
        <div className="text-6xl mb-6">🎉</div>

        <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Premium!</h1>

        <p className="text-xl text-gray-700 mb-8">
          You now have lifetime access to The Bible In Music
        </p>

        <div className="bg-white rounded-xl p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Benefits Unlocked:</h2>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <Volume className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Ads removed forever</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Downloads unlocked</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <ListMusic className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Playlists enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">Premium quality active (320kbps)</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('home')}
          className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl rounded-xl hover:from-amber-600 hover:to-orange-700 transition shadow-lg hover:shadow-xl"
        >
          Start Listening
        </button>

        <p className="text-gray-600 mt-6">
          Thank you for supporting our ministry!
        </p>
      </div>
    </div>
  );
}
