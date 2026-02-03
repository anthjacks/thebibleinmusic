import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const hasSeenPrompt = localStorage.getItem('installPromptDismissed');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowBanner(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      setShowBanner(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User installed the app');
    }

    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('installPromptDismissed', 'true');
    setTimeout(() => {
      localStorage.removeItem('installPromptDismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-40 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-2xl p-4 border-2 border-blue-500">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">
              Install The Bible In Music
            </h3>
            <p className="text-blue-100 text-sm mb-3">
              Get quick access from your home screen. Works offline!
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
