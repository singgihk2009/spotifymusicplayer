import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Playlist } from '../types';
import { PlaylistCard } from '../components/PlaylistCard';

interface LibraryProps {
  onPlaylistClick: (playlist: Playlist) => void;
}

export const Library = ({ onPlaylistClick }: LibraryProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const { data } = await supabase
        .from('playlists')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (data) setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
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
      <h1 className="text-4xl font-bold text-white mb-8">Your Library</h1>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No playlists yet</p>
          <p className="text-gray-500 text-sm mt-2">Create your first playlist to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onClick={() => onPlaylistClick(playlist)} />
          ))}
        </div>
      )}
    </div>
  );
};
