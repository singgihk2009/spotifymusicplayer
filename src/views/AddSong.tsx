import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Music } from 'lucide-react';
import { api } from '../lib/api';
import { Artist, Album } from '../types';

interface AddSongProps {
  onBack: () => void;
}

export const AddSong = ({ onBack }: AddSongProps) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    artist_id: '',
    album_id: '',
    duration: '',
    audio_url: '',
    cover_url: '',
  });

  useEffect(() => {
    fetchArtistsAndAlbums();
  }, []);

  const fetchArtistsAndAlbums = async () => {
    try {
      const [artistsData, albumsData] = await Promise.all([
        api.artists.getAll(),
        api.albums.getAll(),
      ]);
      setArtists(artistsData);
      setAlbums(albumsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await api.songs.create({
        title: formData.title,
        artist_id: formData.artist_id,
        album_id: formData.album_id || null,
        duration: parseInt(formData.duration),
        audio_url: formData.audio_url,
        cover_url: formData.cover_url || null,
      });

      setSuccess(true);
      setFormData({
        title: '',
        artist_id: '',
        album_id: '',
        duration: '',
        audio_url: '',
        cover_url: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating song:', error);
      alert('Failed to create song. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-8 overflow-y-auto h-full">
      <button onClick={onBack} className="text-white mb-6 hover:scale-110 transition flex items-center gap-2">
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>

      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Music size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Add New Song</h1>
            <p className="text-gray-400 mt-1">Upload a new song to the library</p>
          </div>
        </div>

        {success && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 flex items-center gap-2">
            <Plus size={20} />
            <span>Song added successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Song Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter song title"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Artist *</label>
            <select
              name="artist_id"
              value={formData.artist_id}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select an artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Album (Optional)</label>
            <select
              name="album_id"
              value={formData.album_id}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">No album (Single)</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Duration (seconds) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              min="1"
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 180 for 3 minutes"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Audio URL *</label>
            <input
              type="url"
              name="audio_url"
              value={formData.audio_url}
              onChange={handleChange}
              required
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com/audio.mp3"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Cover Image URL (Optional)</label>
            <input
              type="url"
              name="cover_url"
              value={formData.cover_url}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              'Adding Song...'
            ) : (
              <>
                <Plus size={20} />
                Add Song
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
