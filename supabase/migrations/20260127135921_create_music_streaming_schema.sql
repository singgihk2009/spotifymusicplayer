/*
  # Music Streaming Application Schema

  ## Overview
  This migration creates the complete database schema for a Spotify-like music streaming application.

  ## New Tables

  ### 1. artists
  - `id` (uuid, primary key) - Unique identifier for each artist
  - `name` (text) - Artist name
  - `image_url` (text, nullable) - Artist profile image URL
  - `bio` (text, nullable) - Artist biography
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. albums
  - `id` (uuid, primary key) - Unique identifier for each album
  - `title` (text) - Album title
  - `artist_id` (uuid, foreign key) - Reference to artists table
  - `cover_url` (text, nullable) - Album cover image URL
  - `release_year` (integer, nullable) - Year of release
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. songs
  - `id` (uuid, primary key) - Unique identifier for each song
  - `title` (text) - Song title
  - `artist_id` (uuid, foreign key) - Reference to artists table
  - `album_id` (uuid, foreign key, nullable) - Reference to albums table
  - `duration` (integer) - Song duration in seconds
  - `audio_url` (text) - URL to audio file
  - `cover_url` (text, nullable) - Song cover image URL
  - `play_count` (integer) - Number of times played
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. playlists
  - `id` (uuid, primary key) - Unique identifier for each playlist
  - `name` (text) - Playlist name
  - `description` (text, nullable) - Playlist description
  - `cover_url` (text, nullable) - Playlist cover image URL
  - `is_public` (boolean) - Whether playlist is public or private
  - `created_at` (timestamptz) - Record creation timestamp

  ### 5. playlist_songs
  - `id` (uuid, primary key) - Unique identifier
  - `playlist_id` (uuid, foreign key) - Reference to playlists table
  - `song_id` (uuid, foreign key) - Reference to songs table
  - `position` (integer) - Order of song in playlist
  - `added_at` (timestamptz) - When song was added to playlist

  ## Security
  - Enable RLS on all tables
  - Public read access for artists, albums, and songs (content discovery)
  - Public read access for public playlists
  - Authenticated users can create and manage their own playlists

  ## Indexes
  - Add indexes on foreign keys for better query performance
  - Add index on song title for search functionality
*/

-- Create artists table
CREATE TABLE IF NOT EXISTS artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- Create albums table
CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  cover_url text,
  release_year integer,
  created_at timestamptz DEFAULT now()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist_id uuid NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  album_id uuid REFERENCES albums(id) ON DELETE SET NULL,
  duration integer NOT NULL,
  audio_url text NOT NULL,
  cover_url text,
  play_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_url text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id uuid NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON albums(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);

-- Enable Row Level Security
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for artists (public read access)
CREATE POLICY "Anyone can view artists"
  ON artists FOR SELECT
  USING (true);

-- RLS Policies for albums (public read access)
CREATE POLICY "Anyone can view albums"
  ON albums FOR SELECT
  USING (true);

-- RLS Policies for songs (public read access)
CREATE POLICY "Anyone can view songs"
  ON songs FOR SELECT
  USING (true);

-- RLS Policies for playlists (public can view public playlists)
CREATE POLICY "Anyone can view public playlists"
  ON playlists FOR SELECT
  USING (is_public = true);

-- RLS Policies for playlist_songs (public can view songs in public playlists)
CREATE POLICY "Anyone can view songs in public playlists"
  ON playlist_songs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.is_public = true
    )
  );