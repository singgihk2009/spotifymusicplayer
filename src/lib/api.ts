import { Artist, Album, Song, Playlist } from '../types';

const BASE_URL = 'https://apimusic.julianoo.work/api';

interface ApiResponse<T> {
  data: T;
}

interface PlaylistDetailResponse {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
  songs: Song[];
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

export const api = {
  artists: {
    getAll: async (): Promise<Artist[]> => {
      const response = await fetch(`${BASE_URL}/artists`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<Artist[]>>(response);
      return data.data;
    },

    getById: async (id: string): Promise<Artist> => {
      const response = await fetch(`${BASE_URL}/artists/${id}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<Artist>>(response);
      return data.data;
    },

    create: async (artist: Partial<Artist>): Promise<Artist> => {
      const response = await fetch(`${BASE_URL}/artists`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
      });
      const data = await handleResponse<ApiResponse<Artist>>(response);
      return data.data;
    },

    update: async (id: string, artist: Partial<Artist>): Promise<Artist> => {
      const response = await fetch(`${BASE_URL}/artists/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(artist),
      });
      const data = await handleResponse<ApiResponse<Artist>>(response);
      return data.data;
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/artists/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      await handleResponse<void>(response);
    },
  },

  albums: {
    getAll: async (): Promise<Album[]> => {
      const response = await fetch(`${BASE_URL}/albums`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<Album[]>>(response);
      return data.data;
    },

    create: async (album: Partial<Album>): Promise<Album> => {
      const response = await fetch(`${BASE_URL}/albums`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(album),
      });
      const data = await handleResponse<ApiResponse<Album>>(response);
      return data.data;
    },

    update: async (id: string, album: Partial<Album>): Promise<Album> => {
      const response = await fetch(`${BASE_URL}/albums/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(album),
      });
      const data = await handleResponse<ApiResponse<Album>>(response);
      return data.data;
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/albums/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
      });
      await handleResponse<void>(response);
    },
  },

  songs: {
    getAll: async (): Promise<Song[]> => {
      const response = await fetch(`${BASE_URL}/songs`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<Song[]>>(response);
      return data.data;
    },

    create: async (song: Partial<Song>): Promise<Song> => {
      const response = await fetch(`${BASE_URL}/songs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });
      const data = await handleResponse<ApiResponse<Song>>(response);
      return data.data;
    },

    play: async (id: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/songs/${id}/play`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      await handleResponse<void>(response);
    },

    search: async (query: string): Promise<Song[]> => {
      const songs = await api.songs.getAll();
      return songs.filter(song =>
        song.title.toLowerCase().includes(query.toLowerCase())
      );
    },
  },

  playlists: {
    getAll: async (): Promise<Playlist[]> => {
      const response = await fetch(`${BASE_URL}/playlists`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<Playlist[]>>(response);
      return data.data;
    },

    getById: async (id: string): Promise<PlaylistDetailResponse> => {
      const response = await fetch(`${BASE_URL}/playlists/${id}`, {
        headers: { Accept: 'application/json' },
      });
      const data = await handleResponse<ApiResponse<PlaylistDetailResponse>>(response);
      return data.data;
    },

    create: async (playlist: Partial<Playlist>, token: string): Promise<Playlist> => {
      const response = await fetch(`${BASE_URL}/playlists`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(playlist),
      });
      const data = await handleResponse<ApiResponse<Playlist>>(response);
      return data.data;
    },

    addSong: async (playlistId: string, songId: string, token: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ song_id: songId }),
      });
      await handleResponse<void>(response);
    },

    removeSong: async (playlistId: string, songId: string, token: string): Promise<void> => {
      const response = await fetch(`${BASE_URL}/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await handleResponse<void>(response);
    },
  },
};
