/*
  # Create user progress table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `career_path` (text, not null)
      - `skill_levels` (jsonb, stores current skill levels)
      - `learning_goals` (text array, list of learning goals)
      - `completed_resources` (text array, completed learning resources)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for authenticated users to manage their own progress

  3. Constraints
    - Unique constraint on user_id + career_path combination
*/

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  skill_levels jsonb DEFAULT '{}',
  learning_goals text[] DEFAULT '{}',
  completed_resources text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can upsert own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_career_path ON user_progress(career_path);
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_unique ON user_progress(user_id, career_path);