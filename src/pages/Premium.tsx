import { useEffect, useRef } from 'react';
import {
  Crown, Check, X, Download, ListMusic, Music, Volume, Zap, Heart, Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from '../hooks/useNavigate';

declare global {
  interface Window {
    paypal?: any;
  }
}

export function Premium() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const paypalButtonRef = useRef<HTMLDivElement>(null);
  const paypalScriptLoaded = useRef(false);

  const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'PLACEHOLDER_PAYPAL_CLIENT_ID';

  useEffect(() => {
    if (profile?.is_premium || paypalScriptLoaded.current) return;

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = () => {
      paypalScriptLoaded.current = true;
      renderPayPalButton();
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [profile?.is_premium, PAYPAL_CLIENT_ID]);

  const updateUserToPremium = async (paymentId: string, payerEmail: string) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          is_premium: true,
          premium_purchased_at: new Date().toISOString(),
          paypal_payment_id: paymentId,
          paypal_payer_email: payerEmail
        })
        .eq('id', user.id);

      if (error) throw error;

      console.log('User upgraded to premium:', paymentId);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const renderPayPalButton = () => {
    if (!window.paypal || !paypalButtonRef.current) return;

    window.paypal.Buttons({
      createOrder: function(_data: any, actions: any) {
        return actions.order.create({
          purchase_units: [{
            description: 'The Bible In Music - Premium Lifetime Access',
            amount: {
              currency_code: 'USD',
              value: '9.99'
            }
          }]
        });
      },

      onApprove: async function(_data: any, actions: any) {
        try {
          const orderData = await actions.order.capture();
          console.log('Payment completed:', orderData);

          const success = await updateUserToPremium(
            orderData.id,
            orderData.payer.email_address
          );

          if (success) {
            navigate('success', `payment_id=${orderData.id}`);
          } else {
            alert('Payment successful, but there was an issue activating premium. Please contact support with order ID: ' + orderData.id);
          }
        } catch (error) {
          console.error('Payment capture error:', error);
          alert('Payment processing failed. Please try again or contact support.');
        }
      },

      onError: function(err: any) {
        console.error('PayPal Error:', err);
        alert('Payment failed. Please try again.');
      },

      onCancel: function() {
        console.log('Payment cancelled by user');
      },

      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      }
    }).render(paypalButtonRef.current);
  };

  if (profile?.is_premium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">You are Premium!</h2>
          <p className="text-lg text-gray-700 mb-2">
            Thank you for supporting our Christian ministry.
          </p>
          <p className="text-gray-600">
            Enjoy unlimited ad-free listening, downloads, and all premium features forever.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Unlock Premium - Lifetime Access</h1>
        <p className="text-2xl text-gray-600 mb-6">
          One-time payment • No subscription • Yours forever
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 mb-8">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            <span className="font-medium">We give 10% of our sales back to local churches!</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Secure payment via PayPal</span>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-600" />
            <span className="font-medium">Works on all your devices</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <div className="payment-section bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-2xl border-2 border-amber-400 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Crown className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-900">Premium Lifetime Access</h2>
          </div>

          <div className="mb-6">
            <div className="text-6xl font-bold text-amber-700 mb-2">$9.99</div>
            <p className="text-lg text-gray-700 font-semibold">One-time payment</p>
            <p className="text-gray-600">Never pay again</p>
          </div>

          <div id="paypal-button-container" ref={paypalButtonRef}></div>

          <p className="text-sm text-gray-600 mt-4">
            Secure checkout via PayPal
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-5 text-left">
                  <span className="text-2xl font-bold text-gray-900">Feature</span>
                </th>
                <th className="px-6 py-5 text-center">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">FREE</span>
                    <p className="text-sm text-gray-600 mt-1">Current Plan</p>
                  </div>
                </th>
                <th className="px-6 py-5 text-center bg-gradient-to-br from-amber-50 to-yellow-50">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Crown className="w-6 h-6 text-amber-600" />
                    <span className="text-2xl font-bold text-gray-900">PREMIUM</span>
                  </div>
                  <p className="text-sm text-amber-700 font-semibold">Best Value</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Complete Bible</td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-6 h-6 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">All Music</td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-6 h-6 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Unlimited Hours</td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-6 h-6 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-200 bg-red-50">
                <td className="px-6 py-4 font-medium text-gray-900">Advertisements</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    3 per hour
                  </span>
                </td>
                <td className="px-6 py-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
                  <span className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    ZERO
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200 bg-amber-50/20">
                <td className="px-6 py-4 font-medium text-gray-900">Offline Downloads</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-6 h-6 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-gradient-to-br from-amber-50 to-yellow-50">
                  <span className="inline-block bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    UNLIMITED
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Create Playlists</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-6 h-6 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Audio Quality</td>
                <td className="px-6 py-4 text-center">
                  <span className="text-gray-600">128kbps</span>
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <span className="font-bold text-amber-700">320kbps</span>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Early Music Access</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-6 h-6 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-6 py-4 font-medium text-gray-900">Support Ministry</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-6 h-6 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center bg-amber-50/30">
                  <Check className="w-6 h-6 text-amber-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-6">
                  <span className="text-xl font-bold text-gray-900">PRICE</span>
                </td>
                <td className="px-6 py-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-3">FREE</div>
                  <button
                    disabled
                    className="w-32 bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Continue
                  </button>
                </td>
                <td className="px-6 py-6 text-center bg-gradient-to-br from-amber-50 to-yellow-50">
                  <div className="text-4xl font-bold text-amber-700 mb-3">$9.99</div>
                  <p className="text-sm text-gray-600">See PayPal button above</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Premium Benefits</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4">
              <Volume className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ad-Free Forever</h3>
            <p className="text-gray-600">
              Never hear another ad. Enjoy uninterrupted listening experience for life.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Download className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unlimited Downloads</h3>
            <p className="text-gray-600">
              Download as many tracks and chapters as you want for offline listening anytime, anywhere.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <ListMusic className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create Playlists</h3>
            <p className="text-gray-600">
              Organize your favorite content into custom playlists for any mood or occasion.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
              <Music className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Experience crystal clear 320kbps audio quality for the best listening experience.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Early Access</h3>
            <p className="text-gray-600">
              Get new music and content before everyone else. Be the first to experience new releases.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lifetime Access</h3>
            <p className="text-gray-600">
              Pay once, own forever. No subscriptions, no recurring fees. Simple and honest.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Support Ministry</h3>
            <p className="text-gray-600">
              Help us spread God's Word through music and continue creating inspiring content.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600">
              Your payment is processed securely through PayPal. Your data is always protected.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Upgrade?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of believers enjoying ad-free, premium content
        </p>
        <p className="text-lg font-semibold mb-4">
          Scroll up to purchase with PayPal
        </p>
        <p className="text-sm mt-6 opacity-75">
          Secure payment powered by PayPal • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
