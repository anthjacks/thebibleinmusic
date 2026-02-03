/*
  # Add Favorites Table and Genre Column

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `content_id` (uuid, references audio_content)
      - `created_at` (timestamptz)
      - Unique constraint on (user_id, content_id)

  2. Schema Changes
    - Add `genre` column to `audio_content` table for music categorization

  3. Security
    - Enable RLS on `favorites` table
    - Users can view, create, and delete own favorites
*/

-- Add genre column to audio_content
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'audio_content' AND column_name = 'genre'
  ) THEN
    ALTER TABLE audio_content ADD COLUMN genre text;
  END IF;
END $$;

-- Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id uuid NOT NULL REFERENCES audio_content(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_content ON favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_audio_content_genre ON audio_content(genre);

-- Update listening_sessions table to add created_at if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listening_sessions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE listening_sessions ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Rename started_at to created_at for consistency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listening_sessions' AND column_name = 'started_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listening_sessions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE listening_sessions RENAME COLUMN started_at TO created_at;
  END IF;
END $$;

-- Rename downloaded_at to created_at for consistency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'downloads' AND column_name = 'downloaded_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'downloads' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE downloads RENAME COLUMN downloaded_at TO created_at;
  END IF;
END $$;
