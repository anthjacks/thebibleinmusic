import { Navigation } from './Navigation';
import { AudioPlayer } from './AudioPlayer';
import { InstallPrompt } from './InstallPrompt';
import { IOSInstallPrompt } from './IOSInstallPrompt';
import { Home } from '../pages/Home';
import { Bible } from '../pages/Bible';
import { Music } from '../pages/Music';
import { MyLibrary } from '../pages/MyLibrary';
import { Playlists } from '../pages/Playlists';
import { Premium } from '../pages/Premium';
import { Profile } from '../pages/Profile';
import { Account } from '../pages/Account';
import { Success } from '../pages/Success';
import Help from '../pages/Help';
import { useCurrentPage } from '../hooks/useNavigate';

export function Dashboard() {
  const currentPage = useCurrentPage();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navigation />
      <main>
        {currentPage === 'home' && <Home />}
        {currentPage === 'bible' && <Bible />}
        {currentPage === 'music' && <Music />}
        {currentPage === 'my-library' && <MyLibrary />}
        {currentPage === 'playlists' && <Playlists />}
        {currentPage === 'premium' && <Premium />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'account' && <Account />}
        {currentPage === 'success' && <Success />}
        {currentPage === 'help' && <Help />}
      </main>
      <AudioPlayer />
      <InstallPrompt />
      <IOSInstallPrompt />
    </div>
  );
}
