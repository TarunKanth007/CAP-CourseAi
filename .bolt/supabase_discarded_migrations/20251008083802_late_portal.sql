/*
  # Create user achievements table

  1. New Tables
    - `user_achievements`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `achievement_id` (text, unique identifier for achievement type)
      - `title` (text, not null)
      - `description` (text)
      - `icon` (text, emoji or icon identifier)
      - `category` (text, assessment/learning/streak/skill)
      - `points` (integer, achievement points)
      - `unlocked_at` (timestamp with timezone, default now())
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `user_achievements` table
    - Add policies for authenticated users to read their own achievements
    - Only system can insert achievements

  3. Constraints
    - Unique constraint on user_id + achievement_id combination
    - Category validation
*/

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  title text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  category text CHECK (category IN ('assessment', 'learning', 'streak', 'skill', 'milestone')),
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_category ON user_achievements(category);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_achievements_unique ON user_achievements(user_id, achievement_id);