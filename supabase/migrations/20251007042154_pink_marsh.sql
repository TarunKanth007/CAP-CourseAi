/*
  # Create assessments table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `career_path` (text)
      - `assessment_type` (enum: standard, ai)
      - `responses` (jsonb)
      - `results` (jsonb)
      - `overall_score` (integer)
      - `readiness_level` (text)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `assessments` table
    - Add policies for users to manage their own assessments
*/

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  career_path text NOT NULL,
  assessment_type text CHECK (assessment_type IN ('standard', 'ai')) DEFAULT 'standard',
  responses jsonb DEFAULT '{}',
  results jsonb DEFAULT '{}',
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  readiness_level text CHECK (readiness_level IN ('Low', 'Medium', 'High')),
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Users can read their own assessments
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own assessments
CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own assessments
CREATE POLICY "Users can update own assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_career_path ON assessments(career_path);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);