/*
  # Create learning sessions table

  1. New Tables
    - `learning_sessions`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `resource_id` (uuid, foreign key to learning_resources)
      - `career_path` (text, not null)
      - `session_type` (text, study/practice/assessment/review)
      - `duration_minutes` (integer, session duration)
      - `progress_percentage` (integer, 0-100)
      - `completed` (boolean, default false)
      - `notes` (text, user notes)
      - `skills_practiced` (text array, skills worked on)
      - `started_at` (timestamp with timezone, default now())
      - `completed_at` (timestamp with timezone)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `learning_sessions` table
    - Add policies for authenticated users to manage their own sessions

  3. Constraints
    - Check constraints for progress percentage
    - Session type validation
*/

-- Create learning_sessions table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id uuid REFERENCES learning_resources(id) ON DELETE SET NULL,
  career_path text NOT NULL,
  session_type text CHECK (session_type IN ('study', 'practice', 'assessment', 'review', 'project')),
  duration_minutes integer DEFAULT 0,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed boolean DEFAULT false,
  notes text,
  skills_practiced text[] DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own learning sessions"
  ON learning_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning sessions"
  ON learning_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning sessions"
  ON learning_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_career_path ON learning_sessions(career_path);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_session_type ON learning_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_completed ON learning_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_started_at ON learning_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_skills ON learning_sessions USING gin(skills_practiced);