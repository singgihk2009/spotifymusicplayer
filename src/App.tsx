import { useState } from 'react';
import { AudioProvider } from './context/AudioContext';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Home } from './views/Home';
import { Search } from './views/Search';
import { Library } from './views/Library';
import { PlaylistDetail } from './views/PlaylistDetail';
import { Playlist } from './types';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

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
      default:
        return <Home onPlaylistClick={handlePlaylistClick} />;
    }
  };

  return (
    <AudioProvider>
      <div className="h-screen flex flex-col bg-black">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentView={currentView} onViewChange={setCurrentView} />
          <main className="flex-1 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
            {renderView()}
          </main>
        </div>
        <Player />
      </div>
    </AudioProvider>
  );
}

export default App;
