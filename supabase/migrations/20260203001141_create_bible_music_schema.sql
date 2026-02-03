/*
  # The Bible In Music - Complete Database Schema
  
  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `is_premium` (boolean, default false)
      - `premium_purchased_at` (timestamptz, nullable)
      - `preferred_language` (text, default 'english')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `audio_content`
      - `id` (uuid, primary key)
      - `content_type` (text: 'bible' or 'music')
      - `language` (text: 'english' or 'spanish')
      - `title` (text)
      - `book_name` (text, nullable - for Bible)
      - `chapter_number` (integer, nullable - for Bible)
      - `artist` (text, nullable - for music)
      - `album` (text, nullable - for music)
      - `duration_seconds` (integer)
      - `audio_url` (text)
      - `cover_image_url` (text, nullable)
      - `quality_standard` (text - URL for 128kbps)
      - `quality_premium` (text - URL for 320kbps, nullable)
      - `order_index` (integer, default 0)
      - `created_at` (timestamptz)
    
    - `playlists`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `name` (text)
      - `description` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `playlist_items`
      - `id` (uuid, primary key)
      - `playlist_id` (uuid, references playlists)
      - `content_id` (uuid, references audio_content)
      - `order_index` (integer)
      - `added_at` (timestamptz)
    
    - `listening_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `content_id` (uuid, references audio_content)
      - `started_at` (timestamptz)
      - `duration_listened_seconds` (integer)
      - `completed` (boolean, default false)
    
    - `downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `content_id` (uuid, references audio_content)
      - `downloaded_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Users can read own profile, all users can read other profiles (for username display)
    - Users can update own profile only
    - All authenticated users can read audio_content (free tier has full access)
    - Only premium users can create/manage playlists
    - Users can only access own listening sessions and downloads
*/

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  is_premium boolean DEFAULT false,
  premium_purchased_at timestamptz,
  preferred_language text DEFAULT 'english',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Audio Content Table
CREATE TABLE IF NOT EXISTS audio_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL CHECK (content_type IN ('bible', 'music')),
  language text NOT NULL CHECK (language IN ('english', 'spanish')),
  title text NOT NULL,
  book_name text,
  chapter_number integer,
  artist text,
  album text,
  duration_seconds integer NOT NULL,
  audio_url text NOT NULL,
  cover_image_url text,
  quality_standard text NOT NULL,
  quality_premium text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audio_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view audio content"
  ON audio_content FOR SELECT
  TO authenticated
  USING (true);

-- Playlists Table (Premium Only)
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can view own playlists"
  ON playlists FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

CREATE POLICY "Premium users can create playlists"
  ON playlists FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

CREATE POLICY "Premium users can update own playlists"
  ON playlists FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  )
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

CREATE POLICY "Premium users can delete own playlists"
  ON playlists FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

-- Playlist Items Table
CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES audio_content(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, content_id)
);

ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can view own playlist items"
  ON playlist_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_items.playlist_id
      AND playlists.user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_premium = true
      )
    )
  );

CREATE POLICY "Premium users can add items to own playlists"
  ON playlist_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_items.playlist_id
      AND playlists.user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_premium = true
      )
    )
  );

CREATE POLICY "Premium users can delete items from own playlists"
  ON playlist_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_items.playlist_id
      AND playlists.user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid()
        AND user_profiles.is_premium = true
      )
    )
  );

-- Listening Sessions Table (for ad tracking)
CREATE TABLE IF NOT EXISTS listening_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES audio_content(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  duration_listened_seconds integer DEFAULT 0,
  completed boolean DEFAULT false
);

ALTER TABLE listening_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listening sessions"
  ON listening_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own listening sessions"
  ON listening_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listening sessions"
  ON listening_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Downloads Table (Premium Only)
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES audio_content(id) ON DELETE CASCADE,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Premium users can view own downloads"
  ON downloads FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

CREATE POLICY "Premium users can create downloads"
  ON downloads FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

CREATE POLICY "Premium users can delete own downloads"
  ON downloads FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_premium = true
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audio_content_type ON audio_content(content_type);
CREATE INDEX IF NOT EXISTS idx_audio_content_language ON audio_content(language);
CREATE INDEX IF NOT EXISTS idx_audio_content_book ON audio_content(book_name, chapter_number);
CREATE INDEX IF NOT EXISTS idx_playlists_user ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id);
CREATE INDEX IF NOT EXISTS idx_listening_sessions_user ON listening_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON downloads(user_id);
