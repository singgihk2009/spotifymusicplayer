import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useState } from 'react';

export const Player = () => {
  const { currentSong, isPlaying, currentTime, duration, volume, togglePlayPause, seekTo, setVolume, playNext, playPrevious } = useAudio();
  const [isMuted, setIsMuted] = useState(false);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  if (!currentSong) {
    return (
      <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center text-gray-400">
        Select a song to play
      </div>
    );
  }

  return (
    <div className="h-24 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/4">
        <img
          src={currentSong.cover_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=100'}
          alt={currentSong.title}
          className="w-14 h-14 rounded object-cover"
        />
        <div>
          <p className="text-white font-medium text-sm">{currentSong.title}</p>
          <p className="text-gray-400 text-xs">{currentSong.artist?.name || 'Unknown Artist'}</p>
        </div>
      </div>

      <div className="flex flex-col items-center w-2/4 max-w-2xl">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={playPrevious} className="text-gray-400 hover:text-white transition">
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlayPause}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition"
          >
            {isPlaying ? <Pause size={20} fill="black" color="black" /> : <Play size={20} fill="black" color="black" className="ml-0.5" />}
          </button>

          <button onClick={playNext} className="text-gray-400 hover:text-white transition">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-1/4 justify-end">
        <button onClick={toggleMute} className="text-gray-400 hover:text-white transition">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>
  );
};
