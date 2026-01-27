import { useEffect, useState } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Playlist, Song } from '../types';
import { SongItem } from '../components/SongItem';
import { useAudio } from '../context/AudioContext';

interface PlaylistDetailProps {
  playlist: Playlist;
  onBack: () => void;
}

export const PlaylistDetail = ({ playlist, onBack }: PlaylistDetailProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playSong, setQueue } = useAudio();

  useEffect(() => {
    fetchPlaylistSongs();
  }, [playlist.id]);

  const fetchPlaylistSongs = async () => {
    try {
      const { data } = await supabase
        .from('playlist_songs')
        .select(`
          *,
          song:songs(
            *,
            artist:artists(*),
            album:albums(*)
          )
        `)
        .eq('playlist_id', playlist.id)
        .order('position');

      if (data) {
        const playlistSongs = data.map((item) => item.song as Song).filter(Boolean);
        setSongs(playlistSongs);
        setQueue(playlistSongs);
      }
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-gradient-to-b from-blue-900 to-gray-900 p-8">
        <button onClick={onBack} className="text-white mb-6 hover:scale-110 transition">
          <ArrowLeft size={32} />
        </button>

        <div className="flex items-end gap-6">
          <img
            src={playlist.cover_url || 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300'}
            alt={playlist.name}
            className="w-52 h-52 rounded-lg shadow-2xl object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white mb-2">PLAYLIST</p>
            <h1 className="text-6xl font-bold text-white mb-4">{playlist.name}</h1>
            <p className="text-gray-300 mb-4">{playlist.description}</p>
            <p className="text-sm text-gray-400">{songs.length} songs</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 p-8">
        {loading ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-gray-400">No songs in this playlist</p>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={handlePlayAll}
                className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition shadow-lg"
              >
                <Play size={24} fill="black" color="black" className="ml-1" />
              </button>
            </div>

            <div className="space-y-1">
              {songs.map((song, index) => (
                <SongItem key={song.id} song={song} index={index} showAlbum={true} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
