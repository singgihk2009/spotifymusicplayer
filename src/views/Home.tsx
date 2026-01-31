import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Song, Playlist } from '../types';
import { PlaylistCard } from '../components/PlaylistCard';
import { SongItem } from '../components/SongItem';
import { useAudio } from '../context/AudioContext';

interface HomeProps {
  onPlaylistClick: (playlist: Playlist) => void;
}

export const Home = ({ onPlaylistClick }: HomeProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [popularSongs, setPopularSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue } = useAudio();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playlistsData, songsData] = await Promise.all([
        api.playlists.getAll(),
        api.songs.getAll(),
      ]);

      setPlaylists(playlistsData.slice(0, 6));

      const sortedSongs = songsData.sort((a, b) => b.play_count - a.play_count).slice(0, 10);
      setPopularSongs(sortedSongs);
      setQueue(sortedSongs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full">
      <h1 className="text-4xl font-bold text-white mb-8">Good evening</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Popular Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onClick={() => onPlaylistClick(playlist)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Popular Songs</h2>
        <div className="bg-gray-900 rounded-lg p-4">
          {popularSongs.map((song, index) => (
            <SongItem key={song.id} song={song} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};
