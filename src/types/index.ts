export interface Artist {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Album {
  id: string;
  title: string;
  artist_id: string;
  cover_url: string | null;
  release_year: number | null;
  created_at: string;
  artist?: Artist;
}

export interface Song {
  id: string;
  title: string;
  artist_id: string;
  album_id: string | null;
  duration: number;
  audio_url: string;
  cover_url: string | null;
  play_count: number;
  created_at: string;
  artist?: Artist;
  album?: Album;
}

export interface Playlist {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  is_public: boolean;
  created_at: string;
}

export interface PlaylistSong {
  id: string;
  playlist_id: string;
  song_id: string;
  position: number;
  added_at: string;
  song?: Song;
}
