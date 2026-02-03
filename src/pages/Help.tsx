import { Smartphone, Monitor, Share2, Menu, Download, CheckCircle2 } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-6 shadow-lg">
            <Download className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Install The Bible In Music
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get the full app experience with offline access, faster loading, and easy home screen access
          </p>
        </div>

        <div className="space-y-8">
          {/* iPhone/iPad Instructions */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">iPhone & iPad</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r">
                <p className="text-blue-900 font-semibold">
                  Important: You must use Safari browser (not Chrome)
                </p>
              </div>

              <div className="space-y-6">
                <Step
                  number={1}
                  icon={<Monitor className="w-5 h-5" />}
                  title="Open Safari"
                  description="Open this website (www.thebibleinmusic.com) in Safari browser"
                />

                <Step
                  number={2}
                  icon={<Share2 className="w-5 h-5" />}
                  title="Tap the Share button"
                  description="Look for the Share icon (square with arrow pointing up) at the bottom or top of your screen"
                />

                <Step
                  number={3}
                  icon={<Download className="w-5 h-5" />}
                  title="Select 'Add to Home Screen'"
                  description="Scroll down in the share menu and tap 'Add to Home Screen'"
                />

                <Step
                  number={4}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Tap 'Add'"
                  description="Confirm by tapping 'Add' in the top right corner"
                />
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">Success!</p>
                    <p className="text-green-800 text-sm">
                      The Bible In Music icon will appear on your home screen. Tap it to launch the app anytime!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Android Instructions */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Android Phone & Tablet</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r">
                <p className="text-green-900 font-semibold">
                  Works best with Chrome browser
                </p>
              </div>

              <div className="space-y-6">
                <Step
                  number={1}
                  icon={<Monitor className="w-5 h-5" />}
                  title="Open Chrome"
                  description="Visit www.thebibleinmusic.com in Chrome browser"
                />

                <Step
                  number={2}
                  icon={<Menu className="w-5 h-5" />}
                  title="Tap the menu"
                  description="Tap the three dots (⋮) in the top right corner"
                />

                <Step
                  number={3}
                  icon={<Download className="w-5 h-5" />}
                  title="Select 'Install app' or 'Add to Home screen'"
                  description="Look for 'Install app' or 'Add to Home screen' option"
                />

                <Step
                  number={4}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Tap 'Install' or 'Add'"
                  description="Confirm the installation"
                />
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <p className="font-semibold text-orange-900 mb-1">Quick Tip</p>
                    <p className="text-orange-800 text-sm">
                      You may see an automatic install banner at the bottom of the screen. Just tap "Install" for even faster setup!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">Success!</p>
                    <p className="text-green-800 text-sm">
                      The app will appear in your app drawer and home screen. Open it anytime!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Instructions */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <Monitor className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Desktop Computer</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-6 rounded-r">
                <p className="text-purple-900 font-semibold">
                  Works with Chrome, Edge, and Opera browsers
                </p>
              </div>

              <div className="space-y-6">
                <Step
                  number={1}
                  icon={<Monitor className="w-5 h-5" />}
                  title="Visit the website"
                  description="Go to www.thebibleinmusic.com in Chrome or Edge"
                />

                <Step
                  number={2}
                  icon={<Download className="w-5 h-5" />}
                  title="Look for the install icon"
                  description="Find the install icon (⊕ or computer icon) in the address bar"
                />

                <Step
                  number={3}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  title="Click 'Install'"
                  description="Click the icon and select 'Install' from the popup"
                />
              </div>

              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 mb-1">Success!</p>
                    <p className="text-green-800 text-sm">
                      The app will open in its own window. Find it in your Start Menu, Dock, or Desktop!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl overflow-hidden p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Install?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Benefit
                icon="⚡"
                title="Lightning Fast"
                description="Loads instantly, even on slow connections"
              />
              <Benefit
                icon="📡"
                title="Works Offline"
                description="Access your music without internet"
              />
              <Benefit
                icon="🎯"
                title="Easy Access"
                description="One tap from your home screen"
              />
              <Benefit
                icon="🔔"
                title="Notifications"
                description="Get updates about new content"
              />
              <Benefit
                icon="💾"
                title="Save Data"
                description="Uses less data after installation"
              />
              <Benefit
                icon="🎨"
                title="Native Feel"
                description="Looks and feels like a real app"
              />
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">❓</span>
              Troubleshooting
            </h2>

            <div className="space-y-4">
              <Troubleshoot
                question="I don't see the install option"
                answer="Make sure you're using the correct browser (Safari for iOS, Chrome for Android/Desktop). Also, you may have already installed the app - check your home screen or app drawer!"
              />
              <Troubleshoot
                question="The install button disappeared"
                answer="Once you dismiss the install prompt, it won't appear again for 7 days. You can still install manually using the browser menu options listed above."
              />
              <Troubleshoot
                question="Can I uninstall it?"
                answer="Yes! On mobile, long-press the app icon and select 'Remove App' or 'Uninstall'. On desktop, right-click the app icon and select 'Uninstall'."
              />
              <Troubleshoot
                question="Will it use a lot of storage?"
                answer="No! The app is very lightweight and uses minimal storage space (typically under 5MB)."
              />
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200">
            <p className="text-gray-700 mb-2">
              Need more help? Have questions?
            </p>
            <p className="text-gray-600 text-sm">
              Contact us at{' '}
              <a
                href="mailto:support@thebibleinmusic.com"
                className="text-orange-600 hover:text-orange-700 font-semibold underline"
              >
                support@thebibleinmusic.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, icon, title, description }: { number: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold flex items-center justify-center shadow-md">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-600">{icon}</span>
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function Benefit({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-white/90 text-sm">{description}</p>
    </div>
  );
}

function Troubleshoot({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-orange-600 font-bold text-xl group-open:rotate-90 transition-transform">›</span>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{question}</h3>
            <p className="text-gray-600 text-sm hidden group-open:block mt-2">{answer}</p>
          </div>
        </div>
      </summary>
    </details>
  );
}
