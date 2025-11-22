/*
  # Create Initial Database Schema for AI Career Path Predictor

  ## Overview
  This migration creates the complete database schema for the AI Career Path Predictor application,
  including user management, assessments, progress tracking, and learning resources.

  ## Tables Created
  
  ### 1. users
  - Stores user profile information
  - Links to Supabase auth.users
  - Fields: id, email, full_name, timestamps
  
  ### 2. assessments
  - Stores career assessment results
  - Supports both standard and AI-powered assessments
  - Fields: user_id, career_path, assessment_type, responses, results, ai_analysis, questions, scores, timestamps
  
  ### 3. user_progress
  - Tracks user learning progress across career paths
  - Fields: user_id, career_path, skill_levels, learning_goals, completed_resources, timestamps
  
  ### 4. user_achievements
  - Stores unlocked achievements and gamification elements
  - Fields: user_id, achievement_id, title, description, category, points, unlock date
  
  ### 5. learning_sessions
  - Tracks individual learning sessions
  - Fields: user_id, resource_id, career_path, duration, progress, completion status, timestamps
  
  ### 6. skill_assessments
  - Detailed skill-by-skill assessment results
  - Fields: user_id, assessment_id, skill_name, levels, gap analysis, improvement suggestions, timestamps
  
  ### 7. career_recommendations
  - AI-generated personalized recommendations
  - Fields: user_id, assessment_id, career_path, recommendation details, priority, completion status, timestamps
  
  ### 8. learning_resources
  - Catalog of available learning resources
  - Fields: title, description, type, provider, url, metadata (duration, difficulty, rating, skills, career paths, pricing)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure users can only access their own data
  - Public read access on learning_resources table only
  - Authenticated users required for all personal data access

  ## Indexes
  - Optimized for common query patterns
  - GIN indexes for JSONB columns
  - B-tree indexes for foreign keys and frequently filtered columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- ASSESSMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('standard', 'ai')),
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  results jsonb NOT NULL DEFAULT '{}'::jsonb,
  ai_analysis jsonb DEFAULT NULL,
  questions jsonb DEFAULT NULL,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  readiness_level text NOT NULL CHECK (readiness_level IN ('Low', 'Medium', 'High')),
  completed_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessments
CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_career_path ON assessments(career_path);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_ai_analysis ON assessments USING gin (ai_analysis) WHERE ai_analysis IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_assessments_questions ON assessments USING gin (questions) WHERE questions IS NOT NULL;

-- ============================================================================
-- USER_PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  skill_levels jsonb NOT NULL DEFAULT '{}'::jsonb,
  learning_goals text[] DEFAULT ARRAY[]::text[],
  completed_resources text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, career_path)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_career_path ON user_progress(career_path);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id text NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  category text,
  points integer DEFAULT 0,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);

-- ============================================================================
-- LEARNING_SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resource_id text,
  career_path text NOT NULL,
  session_type text,
  duration_minutes integer,
  progress_percentage integer CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed boolean DEFAULT false,
  notes text,
  skills_practiced text[] DEFAULT ARRAY[]::text[],
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_sessions
CREATE POLICY "Users can view own sessions"
  ON learning_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON learning_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON learning_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_career_path ON learning_sessions(career_path);
CREATE INDEX IF NOT EXISTS idx_learning_sessions_created_at ON learning_sessions(created_at DESC);

-- ============================================================================
-- SKILL_ASSESSMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS skill_assessments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  skill_name text NOT NULL,
  current_level integer CHECK (current_level >= 1 AND current_level <= 5),
  target_level integer CHECK (target_level >= 1 AND target_level <= 5),
  gap_level integer CHECK (gap_level >= 0 AND gap_level <= 5),
  priority text CHECK (priority IN ('high', 'medium', 'low')),
  confidence_score integer CHECK (confidence_score >= 0 AND confidence_score <= 100),
  improvement_suggestions text[] DEFAULT ARRAY[]::text[],
  estimated_time_to_improve text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skill_assessments
CREATE POLICY "Users can view own skill assessments"
  ON skill_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skill assessments"
  ON skill_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skill assessments"
  ON skill_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_assessment_id ON skill_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_skill_assessments_skill_name ON skill_assessments(skill_name);

-- ============================================================================
-- CAREER_RECOMMENDATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS career_recommendations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
  career_path text NOT NULL,
  recommendation_type text,
  title text NOT NULL,
  description text,
  provider text,
  url text,
  priority text CHECK (priority IN ('high', 'medium', 'low')),
  estimated_duration text,
  cost_estimate text,
  ai_reasoning text,
  skills_addressed text[] DEFAULT ARRAY[]::text[],
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for career_recommendations
CREATE POLICY "Users can view own recommendations"
  ON career_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON career_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON career_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_career_recommendations_user_id ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_assessment_id ON career_recommendations(assessment_id);
CREATE INDEX IF NOT EXISTS idx_career_recommendations_priority ON career_recommendations(priority);

-- ============================================================================
-- LEARNING_RESOURCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('course', 'book', 'video', 'tutorial', 'certification')),
  provider text NOT NULL,
  url text,
  duration text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  rating numeric(2,1) CHECK (rating >= 0 AND rating <= 5),
  skills text[] DEFAULT ARRAY[]::text[],
  career_paths text[] DEFAULT ARRAY[]::text[],
  price numeric(10,2),
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_resources (public read, admin write)
CREATE POLICY "Anyone can view learning resources"
  ON learning_resources FOR SELECT
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_difficulty ON learning_resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_resources_skills ON learning_resources USING gin (skills);
CREATE INDEX IF NOT EXISTS idx_learning_resources_career_paths ON learning_resources USING gin (career_paths);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_assessments_updated_at
  BEFORE UPDATE ON skill_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_recommendations_updated_at
  BEFORE UPDATE ON career_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at
  BEFORE UPDATE ON learning_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
