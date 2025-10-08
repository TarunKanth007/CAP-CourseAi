/*
  # Update assessments table for AI analysis storage

  1. Changes
    - Add ai_analysis column to store detailed AI analysis results
    - Add questions column to store the questions asked during assessment
    - Update existing policies to handle new columns

  2. Security
    - Maintain existing RLS policies
    - Ensure users can only access their own AI analysis data
*/

-- Add new columns to assessments table
ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS ai_analysis jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS questions jsonb DEFAULT NULL;

-- Add index for better query performance on AI analysis
CREATE INDEX IF NOT EXISTS idx_assessments_ai_analysis 
ON assessments USING gin (ai_analysis) 
WHERE ai_analysis IS NOT NULL;

-- Add index for questions
CREATE INDEX IF NOT EXISTS idx_assessments_questions 
ON assessments USING gin (questions) 
WHERE questions IS NOT NULL;

-- Update the existing policies to include new columns (policies already exist, just ensuring they work with new columns)
-- The existing RLS policies will automatically apply to the new columns since they use user_id filtering