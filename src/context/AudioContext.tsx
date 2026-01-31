import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song } from '../types';
import { api } from '../lib/api';

interface AudioContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  playSong: (song: Song) => void;
  pauseSong: () => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (song: Song) => void;
  setQueue: (songs: Song[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Song[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const currentSongRef = useRef<Song | null>(null);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      const current = currentSongRef.current;
      const queueList = queueRef.current;

      if (!current || queueList.length === 0) return;

      const currentIndex = queueList.findIndex(song => song.id === current.id);
      const nextIndex = (currentIndex + 1) % queueList.length;

      if (audioRef.current && queueList[nextIndex]) {
        audioRef.current.src = queueList[nextIndex].audio_url;
        audioRef.current.play()
          .then(() => {
            api.songs.play(queueList[nextIndex].id).catch(err => {
              console.error('Error updating play count:', err);
            });
          })
          .catch(err => {
            console.error('Error playing next song:', err);
            setIsPlaying(false);
          });
        setCurrentSong(queueList[nextIndex]);
        setIsPlaying(true);
      }
    };

    const handleError = (e: ErrorEvent) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as any);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as any);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.src = song.audio_url;
      audioRef.current.play()
        .then(() => {
          setCurrentSong(song);
          setIsPlaying(true);
          api.songs.play(song.id).catch(err => {
            console.error('Error updating play count:', err);
          });
        })
        .catch(err => {
          console.error('Error playing song:', err);
          setIsPlaying(false);
        });
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!currentSong) return;

    if (isPlaying) {
      pauseSong();
    } else {
      audioRef.current?.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error toggling play:', err);
          setIsPlaying(false);
        });
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const playNext = () => {
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playSong(queue[nextIndex]);
  };

  const playPrevious = () => {
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex(song => song.id === currentSong.id);
    const previousIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    playSong(queue[previousIndex]);
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        playSong,
        pauseSong,
        togglePlayPause,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        addToQueue,
        setQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
