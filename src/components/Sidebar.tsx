import { Home, Search, Library, Plus, Heart } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar = ({ currentView, onViewChange }: SidebarProps) => {
  return (
    <div className="w-64 bg-black text-white flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"></div>
          <span className="text-xl font-bold">MusicStream</span>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => onViewChange('home')}
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition ${
              currentView === 'home' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <Home size={24} />
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => onViewChange('search')}
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition ${
              currentView === 'search' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <Search size={24} />
            <span className="font-medium">Search</span>
          </button>

          <button
            onClick={() => onViewChange('library')}
            className={`flex items-center gap-3 w-full p-2 rounded-lg transition ${
              currentView === 'library' ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <Library size={24} />
            <span className="font-medium">Your Library</span>
          </button>
        </nav>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => onViewChange('create-playlist')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <div className="w-6 h-6 bg-gray-700 flex items-center justify-center rounded">
              <Plus size={16} />
            </div>
            <span className="font-medium">Create Playlist</span>
          </button>

          <button
            onClick={() => onViewChange('liked')}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-800 transition"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center rounded">
              <Heart size={16} fill="white" />
            </div>
            <span className="font-medium">Liked Songs</span>
          </button>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          <p>Music Streaming Platform</p>
          <p className="mt-1">Discover and enjoy music</p>
        </div>
      </div>
    </div>
  );
};
