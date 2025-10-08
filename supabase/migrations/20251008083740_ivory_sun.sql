/*
  # Create assessments table

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `career_path` (text, not null)
      - `assessment_type` (text, 'standard' or 'ai')
      - `questions` (jsonb, stores AI-generated questions)
      - `responses` (jsonb, stores user responses)
      - `results` (jsonb, stores assessment results)
      - `ai_analysis` (jsonb, stores detailed AI analysis)
      - `overall_score` (integer, 0-100)
      - `readiness_level` (text, 'Low', 'Medium', 'High')
      - `completed_at` (timestamp with timezone)
      - `created_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `assessments` table
    - Add policies for authenticated users to manage their own assessments

  3. Constraints
    - Check constraints for score range and readiness levels
    - Assessment type validation
*/

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  assessment_type text DEFAULT 'standard' CHECK (assessment_type IN ('standard', 'ai')),
  questions jsonb DEFAULT NULL,
  responses jsonb DEFAULT '{}',
  results jsonb DEFAULT '{}',
  ai_analysis jsonb DEFAULT NULL,
  overall_score integer CHECK (overall_score >= 0 AND overall_score <= 100),
  readiness_level text CHECK (readiness_level IN ('Low', 'Medium', 'High')),
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_career_path ON assessments(career_path);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_questions ON assessments USING gin(questions) WHERE questions IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assessments_ai_analysis ON assessments USING gin(ai_analysis) WHERE ai_analysis IS NOT NULL;