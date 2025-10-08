/*
  # Create learning resources table

  1. New Tables
    - `learning_resources`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, not null)
      - `description` (text)
      - `type` (text, course/book/video/tutorial/certification)
      - `provider` (text, not null)
      - `url` (text)
      - `duration` (text)
      - `difficulty` (text, beginner/intermediate/advanced)
      - `rating` (decimal, 0-5)
      - `skills` (text array, related skills)
      - `career_paths` (text array, applicable career paths)
      - `price` (decimal, nullable)
      - `is_free` (boolean, default false)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `learning_resources` table
    - Allow public read access for all users
    - Restrict write access to authenticated users only

  3. Constraints
    - Check constraints for rating range and difficulty levels
    - Resource type validation
*/

-- Create learning_resources table
CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('course', 'book', 'video', 'tutorial', 'certification', 'article', 'workshop')),
  provider text NOT NULL,
  url text,
  duration text,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  rating decimal(2,1) CHECK (rating >= 0 AND rating <= 5),
  skills text[] DEFAULT '{}',
  career_paths text[] DEFAULT '{}',
  price decimal(10,2),
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read learning resources"
  ON learning_resources
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert learning resources"
  ON learning_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update learning resources"
  ON learning_resources
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_difficulty ON learning_resources(difficulty);
CREATE INDEX IF NOT EXISTS idx_learning_resources_rating ON learning_resources(rating DESC);
CREATE INDEX IF NOT EXISTS idx_learning_resources_skills ON learning_resources USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_learning_resources_career_paths ON learning_resources USING gin(career_paths);
CREATE INDEX IF NOT EXISTS idx_learning_resources_is_free ON learning_resources(is_free);
CREATE INDEX IF NOT EXISTS idx_learning_resources_created_at ON learning_resources(created_at DESC);