import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AudioProvider } from './context/AudioContext';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Library } from './views/Library';
import { PlaylistDetail } from './views/PlaylistDetail';
import { AddSong } from './views/AddSong';
import { Playlist } from './types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentView('playlist-detail');
  };

  const handleBackFromPlaylist = () => {
    setSelectedPlaylist(null);
    setCurrentView('home');
  };

  const renderView = () => {
    if (currentView === 'playlist-detail' && selectedPlaylist) {
      return <PlaylistDetail playlist={selectedPlaylist} onBack={handleBackFromPlaylist} />;
    }

    switch (currentView) {
      case 'home':
        return <Home onPlaylistClick={handlePlaylistClick} />;
      case 'search':
        return <Search />;
      case 'library':
        return <Library onPlaylistClick={handlePlaylistClick} />;
      case 'add-song':
        return <AddSong onBack={() => setCurrentView('home')} />;
      default:
        return <Home onPlaylistClick={handlePlaylistClick} />;
    }
  };

  return (
    <AudioProvider>
      <div className="h-screen flex flex-col bg-black">
        <div className="flex flex-1 overflow-hidden">
          {isSidebarOpen && (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 md:hidden"
              aria-label="Close sidebar overlay"
            />
          )}
          <Sidebar
            currentView={currentView}
            onViewChange={setCurrentView}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 overflow-hidden bg-gradient-to-b from-gray-900 to-black flex flex-col">
            <div className="flex items-center justify-between p-4 md:hidden border-b border-gray-800">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="text-white"
                aria-label="Open sidebar"
              >
                <Menu size={24} />
              </button>
              <span className="text-sm font-semibold text-white">MusicStream</span>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="text-white"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{renderView()}</div>
          </main>
        </div>
        <Player />
      </div>
    </AudioProvider>
  );
}

export default App;
