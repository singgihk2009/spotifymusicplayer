import { Play, Pause } from 'lucide-react';
import { Song } from '../types';
import { useAudio } from '../context/AudioContext';

interface SongItemProps {
  song: Song;
  index: number;
  showAlbum?: boolean;
}

export const SongItem = ({ song, index, showAlbum = true }: SongItemProps) => {
  const { currentSong, isPlaying, playSong, pauseSong } = useAudio();
  const isCurrentSong = currentSong?.id === song.id;

  const handleClick = () => {
    if (isCurrentSong && isPlaying) {
      pauseSong();
    } else {
      playSong(song);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 rounded-lg hover:bg-gray-800 transition group cursor-pointer ${
        isCurrentSong ? 'bg-gray-800' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center w-10">
        {isCurrentSong && isPlaying ? (
          <Pause size={16} className="text-green-400" />
        ) : (
          <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
        )}
        <Play size={16} className="text-white hidden group-hover:block" />
      </div>

      <div className="flex items-center gap-3">
        <img
          src={song.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=100'}
          alt={song.title}
          className="w-10 h-10 rounded object-cover"
        />
        <div>
          <p className={`font-medium ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>{song.title}</p>
          <p className="text-sm text-gray-400">{song.artist?.name || 'Unknown Artist'}</p>
        </div>
      </div>

      {showAlbum && (
        <div className="flex items-center">
          <p className="text-sm text-gray-400">{song.album?.title || 'Single'}</p>
        </div>
      )}

      <div className="flex items-center">
        <p className="text-sm text-gray-400">{formatDuration(song.duration)}</p>
      </div>
    </div>
  );
};
