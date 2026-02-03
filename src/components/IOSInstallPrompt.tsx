import { useState, useEffect } from 'react';
import { Share, X, Smartphone } from 'lucide-react';

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenPrompt = localStorage.getItem('iosInstallPromptDismissed');

    if (isIOS && !isStandalone && !hasSeenPrompt) {
      setTimeout(() => setShowPrompt(true), 5000);
    }
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('iosInstallPromptDismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('iosInstallPromptDismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 animate-slide-up">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl p-4 border-2 border-gray-700">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">
              Install on iPhone
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Tap <Share className="w-4 h-4 inline mx-1" /> then "Add to Home Screen"
            </p>

            <div className="bg-gray-800 rounded-lg p-3 text-xs text-gray-300 space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 rounded px-2 py-1">1</span>
                <span>Tap the Share button below</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 rounded px-2 py-1">2</span>
                <span>Scroll and tap "Add to Home Screen"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-gray-700 rounded px-2 py-1">3</span>
                <span>Tap "Add" to install</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
