import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Dashboard } from './components/Dashboard';
import { useCurrentPage, useNavigate } from './hooks/useNavigate';
import { useEffect } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const currentPage = useCurrentPage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'register')) {
      navigate('home');
    }
  }, [user, currentPage, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'register') {
      return <Register onToggleLogin={() => navigate('login')} />;
    }
    if (currentPage === 'login') {
      return <Login onToggleRegister={() => navigate('register')} />;
    }
    return <Landing />;
  }

  return (
    <PlayerProvider>
      <Dashboard />
    </PlayerProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
