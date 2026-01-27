import { Play } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistCardProps {
  playlist: Playlist;
  onClick: () => void;
}

export const PlaylistCard = ({ playlist, onClick }: PlaylistCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition cursor-pointer group"
    >
      <div className="relative mb-4">
        <img
          src={playlist.cover_url || 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300'}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
          <Play size={24} fill="black" color="black" className="ml-1" />
        </button>
      </div>
      <h3 className="font-bold text-white mb-1">{playlist.name}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">{playlist.description || 'Playlist'}</p>
    </div>
  );
};
