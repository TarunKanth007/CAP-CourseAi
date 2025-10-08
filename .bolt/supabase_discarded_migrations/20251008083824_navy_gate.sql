/*
  # Create career recommendations table

  1. New Tables
    - `career_recommendations`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `assessment_id` (uuid, foreign key to assessments)
      - `career_path` (text, not null)
      - `recommendation_type` (text, course/resource/skill/pathway)
      - `title` (text, not null)
      - `description` (text)
      - `provider` (text)
      - `url` (text)
      - `priority` (text, high/medium/low)
      - `estimated_duration` (text)
      - `cost_estimate` (text)
      - `ai_reasoning` (text, why this was recommended)
      - `skills_addressed` (text array)
      - `is_completed` (boolean, default false)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `career_recommendations` table
    - Add policies for authenticated users to manage their own recommendations

  3. Constraints
    - Priority and recommendation type validation
*/

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  recommendation_type text CHECK (recommendation_type IN ('course', 'resource', 'skill', 'pathway', 'certification', 'project')),
  title text NOT NULL,
  description text,
  provider text,
  url text,
  priority text CHECK (priority IN ('high', 'medium', 'low')),
  estimated_duration text,
  cost_estimate text,
  ai_reasoning text,
  skills_addressed text[] DEFAULT '{}',
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own career recommendations"
  ON career_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career recommendations"
  ON career_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career recommendations"
  ON career_recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_assessment_id ON career_recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_career_path ON career_recommendations(career_path);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_type ON career_recommendations(recommendation_type);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_priority ON career_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_completed ON career_recommendations(is_completed);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_skills ON career_recommendations USING gin(skills_addressed);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_created_at ON career_recommendations(created_at DESC);