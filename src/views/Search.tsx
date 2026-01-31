import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { api } from '../lib/api';
import { Song } from '../types';
import { SongItem } from '../components/SongItem';
import { useAudio } from '../context/AudioContext';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const { setQueue } = useAudio();

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await api.songs.search(searchQuery);
      const limitedResults = data.slice(0, 20);

      setResults(limitedResults);
      setQueue(limitedResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 overflow-y-auto h-full">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold text-white mb-8">Search</h1>

        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white text-black rounded-full py-3 pl-14 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {loading && <p className="text-gray-400">Searching...</p>}

        {!loading && results.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-4">
            {results.map((song, index) => (
              <SongItem key={song.id} song={song} index={index} />
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className="text-gray-400">No results found for "{query}"</p>
        )}

        {!query && (
          <div className="text-center py-12">
            <SearchIcon size={64} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Start typing to search for songs</p>
          </div>
        )}
      </div>
    </div>
  );
};
