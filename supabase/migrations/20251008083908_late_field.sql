/*
  # Create database functions and triggers

  1. Functions
    - Update timestamp function for updated_at columns
    - Calculate skill gap function
    - Generate achievement function

  2. Triggers
    - Auto-update timestamps on record updates
    - Auto-calculate skill gaps
    - Auto-generate achievements based on progress

  3. Views
    - User progress summary view
    - Assessment analytics view
*/

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_sessions_updated_at BEFORE UPDATE ON learning_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_assessments_updated_at BEFORE UPDATE ON skill_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_recommendations_updated_at BEFORE UPDATE ON career_recommendations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements()
RETURNS TRIGGER AS $$
DECLARE
    assessment_count INTEGER;
    avg_score DECIMAL;
BEGIN
    -- Count total assessments for user
    SELECT COUNT(*) INTO assessment_count
    FROM assessments
    WHERE user_id = NEW.user_id;

    -- Calculate average score
    SELECT AVG(overall_score) INTO avg_score
    FROM assessments
    WHERE user_id = NEW.user_id;

    -- Award "First Assessment" achievement
    IF assessment_count = 1 THEN
        INSERT INTO user_achievements (user_id, achievement_id, title, description, icon, category, points)
        VALUES (NEW.user_id, 'first-assessment', 'First Steps', 'Completed your first career assessment', '🎯', 'assessment', 10)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;

    -- Award "Assessment Explorer" achievement
    IF assessment_count = 5 THEN
        INSERT INTO user_achievements (user_id, achievement_id, title, description, icon, category, points)
        VALUES (NEW.user_id, 'assessment-explorer', 'Assessment Explorer', 'Completed 5 career assessments', '🔍', 'assessment', 25)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;

    -- Award "High Achiever" achievement
    IF avg_score >= 80 THEN
        INSERT INTO user_achievements (user_id, achievement_id, title, description, icon, category, points)
        VALUES (NEW.user_id, 'high-achiever', 'High Achiever', 'Maintained an average score above 80%', '⭐', 'skill', 50)
        ON CONFLICT (user_id, achievement_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for achievement checking
CREATE TRIGGER check_achievements_on_assessment AFTER INSERT ON assessments
    FOR EACH ROW EXECUTE FUNCTION check_and_award_achievements();

-- Create view for user progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.email,
    COUNT(DISTINCT a.id) as total_assessments,
    ROUND(AVG(a.overall_score), 2) as average_score,
    COUNT(DISTINCT a.career_path) as career_paths_explored,
    COUNT(DISTINCT ua.id) as total_achievements,
    SUM(ua.points) as total_points,
    MAX(a.created_at) as last_assessment_date,
    COUNT(CASE WHEN a.assessment_type = 'ai' THEN 1 END) as ai_assessments,
    COUNT(CASE WHEN a.assessment_type = 'standard' THEN 1 END) as standard_assessments
FROM users u
LEFT JOIN assessments a ON u.id = a.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.full_name, u.email;

-- Create view for assessment analytics
CREATE OR REPLACE VIEW assessment_analytics AS
SELECT 
    career_path,
    assessment_type,
    COUNT(*) as total_assessments,
    ROUND(AVG(overall_score), 2) as average_score,
    MIN(overall_score) as min_score,
    MAX(overall_score) as max_score,
    COUNT(CASE WHEN readiness_level = 'High' THEN 1 END) as high_readiness_count,
    COUNT(CASE WHEN readiness_level = 'Medium' THEN 1 END) as medium_readiness_count,
    COUNT(CASE WHEN readiness_level = 'Low' THEN 1 END) as low_readiness_count,
    DATE_TRUNC('month', created_at) as month
FROM assessments
GROUP BY career_path, assessment_type, DATE_TRUNC('month', created_at)
ORDER BY month DESC, career_path, assessment_type;