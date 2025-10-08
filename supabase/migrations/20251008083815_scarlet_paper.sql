/*
  # Create skill assessments table

  1. New Tables
    - `skill_assessments`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `assessment_id` (uuid, foreign key to assessments)
      - `skill_name` (text, not null)
      - `current_level` (integer, 1-5)
      - `target_level` (integer, 1-5)
      - `gap_level` (integer, calculated gap)
      - `priority` (text, high/medium/low)
      - `confidence_score` (decimal, 0-1)
      - `improvement_suggestions` (text array)
      - `estimated_time_to_improve` (text)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `skill_assessments` table
    - Add policies for authenticated users to manage their own skill assessments

  3. Constraints
    - Check constraints for skill levels and priority
    - Confidence score validation
*/

-- Create skill_assessments table
CREATE TABLE IF NOT EXISTS skill_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  current_level integer CHECK (current_level >= 1 AND current_level <= 5),
  target_level integer CHECK (target_level >= 1 AND target_level <= 5),
  gap_level integer GENERATED ALWAYS AS (target_level - current_level) STORED,
  priority text CHECK (priority IN ('high', 'medium', 'low')),
  confidence_score decimal(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  improvement_suggestions text[] DEFAULT '{}',
  estimated_time_to_improve text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own skill assessments"
  ON skill_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill assessments"
  ON skill_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill assessments"
  ON skill_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_assessment_id ON skill_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill_name ON skill_assessments(skill_name);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_priority ON skill_assessments(priority);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_gap_level ON skill_assessments(gap_level DESC);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_created_at ON skill_assessments(created_at DESC);