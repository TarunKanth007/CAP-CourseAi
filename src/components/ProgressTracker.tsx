import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { TrendingUp, Calendar, Award, Target, BookOpen, Clock, Star } from 'lucide-react';

interface ProgressData {
  totalAssessments: number;
  averageScore: number;
  skillsImproved: number;
  learningStreak: number;
  completedResources: number;
  timeSpent: number; // in hours
  achievements: Achievement[];
  weeklyProgress: { week: string; score: number }[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'assessment' | 'learning' | 'streak' | 'skill';
}

const ProgressTracker: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    if (!user) return;

    try {
      // Load assessment history
      const assessmentsResult = await assessmentService.getUserAssessments(user.id);
      const assessments = assessmentsResult.data || [];

      // Load achievements
      const achievementsResult = await assessmentService.getUserAchievements(user.id);
      const achievements = achievementsResult.data || [];

      // Load skill assessments
      const skillAssessmentsResult = await assessmentService.getUserSkillAssessments(user.id);
      const skillAssessments = skillAssessmentsResult.data || [];

      // Load progress data
      const progressResult = await assessmentService.getUserProgress(user.id);
      const progress = progressResult.data || [];

      // Calculate progress metrics
      const totalAssessments = assessments.length;
      const averageScore = assessments.length > 0 
        ? Math.round(assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length)
        : 0;

      // Calculate real progress data
      const skillsImproved = skillAssessments.filter(sa => sa.current_level >= sa.target_level).length;
      const totalSkillsTracked = skillAssessments.length;
      const completedResources = progress.reduce((sum, p) => sum + (p.completed_resources?.length || 0), 0);
      
      // Calculate learning streak (days with assessments in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentAssessments = assessments.filter(a => new Date(a.created_at) >= thirtyDaysAgo);
      const uniqueDays = new Set(recentAssessments.map(a => new Date(a.created_at).toDateString()));
      const learningStreak = uniqueDays.size;

      // Generate weekly progress from actual assessments
      const weeklyProgress = generateWeeklyProgressFromData(assessments);
      
      // Generate skill progress from skill assessments
      const skillProgress = generateSkillProgressFromData(skillAssessments);

      const mockProgressData: ProgressData = {
        totalAssessments,
        averageScore,
        skillsImproved,
        learningStreak,
        completedResources,
        timeSpent: Math.floor(totalAssessments * 2.5), // Estimated based on assessments
        achievements: achievements.map(a => ({
          id: a.achievement_id,
          title: a.title,
          description: a.description || '',
          icon: a.icon || '🏆',
          unlockedAt: a.unlocked_at || a.created_at || '',
          category: a.category as 'assessment' | 'learning' | 'streak' | 'skill' || 'assessment'
        })),
        weeklyProgress,
        skillProgress,
        recentAssessments: assessments.slice(0, 5)
      };

      setProgressData(mockProgressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateWeeklyProgressFromData = (assessments: any[]) => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekAssessments = assessments.filter(a => {
        const assessmentDate = new Date(a.created_at);
        return assessmentDate >= weekStart && assessmentDate <= weekEnd;
      });
      
      const avgScore = weekAssessments.length > 0 
        ? Math.round(weekAssessments.reduce((sum, a) => sum + a.overall_score, 0) / weekAssessments.length)
        : 0;
      
      weeks.push({
        week: `W${i === 0 ? 'Now' : i}`,
        score: avgScore
      });
    }
    
    return weeks;
  };

  const generateSkillProgressFromData = (skillAssessments: any[]) => {
    const skillMap = new Map();
    
    skillAssessments.forEach(sa => {
      const existing = skillMap.get(sa.skill_name);
      if (!existing || new Date(sa.created_at) > new Date(existing.created_at)) {
        skillMap.set(sa.skill_name, sa);
      }
    });
    
    return Array.from(skillMap.values()).map(sa => ({
      skill: sa.skill_name,
      currentLevel: sa.current_level || 1,
      targetLevel: sa.target_level || 5,
      progress: ((sa.current_level || 1) / (sa.target_level || 5)) * 100
    }));
  };
  const generateAchievements = (assessments: number, avgScore: number): Achievement[] => {
    const achievements: Achievement[] = [];

    if (assessments >= 1) {
      achievements.push({
        id: 'first-assessment',
        title: 'First Steps',
        description: 'Completed your first career assessment',
        icon: '🎯',
        unlockedAt: new Date().toISOString(),
        category: 'assessment'
      });
    }

    if (assessments >= 5) {
      achievements.push({
        id: 'assessment-explorer',
        title: 'Assessment Explorer',
        description: 'Completed 5 career assessments',
        icon: '🔍',
        unlockedAt: new Date().toISOString(),
        category: 'assessment'
      });
    }

    if (avgScore >= 80) {
      achievements.push({
        id: 'high-achiever',
        title: 'High Achiever',
        description: 'Maintained an average score above 80%',
        icon: '⭐',
        unlockedAt: new Date().toISOString(),
        category: 'skill'
      });
    }

    achievements.push({
      id: 'learning-streak',
      title: 'Learning Streak',
      description: '7-day learning streak',
      icon: '🔥',
      unlockedAt: new Date().toISOString(),
      category: 'streak'
    });

    return achievements;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className={`liquid-card rounded-xl shadow-lg p-6 text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <BookOpen className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
        <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
          No progress data available yet. Complete an assessment to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Learning Progress
          </h3>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className={`liquid-input px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'border-slate-600 bg-slate-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`liquid-card p-4 rounded-lg text-center floating-element ${
            isDarkMode ? 'bg-slate-700' : 'bg-blue-50'
          }`}>
            <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {progressData.averageScore}%
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Average Score
            </div>
          </div>

          <div className={`liquid-card p-4 rounded-lg text-center floating-element ${
            isDarkMode ? 'bg-slate-700' : 'bg-green-50'
          }`}>
            <Target className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {progressData.skillsImproved}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Skills Improved
            </div>
          </div>

          <div className={`liquid-card p-4 rounded-lg text-center floating-element ${
            isDarkMode ? 'bg-slate-700' : 'bg-orange-50'
          }`}>
            <Clock className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {progressData.timeSpent}h
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Time Spent
            </div>
          </div>

          <div className={`liquid-card p-4 rounded-lg text-center floating-element ${
            isDarkMode ? 'bg-slate-700' : 'bg-purple-50'
          }`}>
            <Star className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {progressData.learningStreak}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Day Streak
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className={`glass-morphism p-4 rounded-lg border ${
          isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Weekly Progress Trend
          </h4>
          <div className="flex items-end justify-between h-32 space-x-1">
            {progressData.weeklyProgress.map((week, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    week.score > 0 
                      ? 'bg-gradient-to-t from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ 
                    height: week.score > 0 ? `${Math.max((week.score / 100) * 100, 10)}%` : '5%',
                    minHeight: '8px'
                  }}
                  title={week.score > 0 ? `Score: ${week.score}%` : 'No assessments this week'}
                ></div>
                <span className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {week.week}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Based on your actual assessment scores over the past 8 weeks
            </p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Award className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
          Achievements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progressData.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`liquid-card border rounded-lg p-4 floating-element ${
                isDarkMode ? 'border-yellow-400/30 bg-yellow-900/20' : 'border-yellow-300 bg-yellow-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      achievement.category === 'assessment' ? 'bg-blue-100 text-blue-800' :
                      achievement.category === 'learning' ? 'bg-green-100 text-green-800' :
                      achievement.category === 'streak' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {achievement.category}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {progressData.achievements.length === 0 && (
          <div className="text-center py-8">
            <Award className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              Complete more assessments and learning activities to unlock achievements!
            </p>
          </div>
        )}
      </div>

      {/* Learning Goals */}
      <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Calendar className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          Skill Progress Tracking
        </h3>

        {progressData.skillProgress.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressData.skillProgress.map((skill, index) => (
              <div key={index} className={`liquid-card border-l-4 p-4 rounded-lg ${
                skill.progress >= 80 ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                skill.progress >= 60 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-red-500 bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {skill.skill}
                  </h4>
                  <span className={`text-sm font-medium ${
                    skill.progress >= 80 ? 'text-green-600' :
                    skill.progress >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {skill.currentLevel}/{skill.targetLevel}
                  </span>
                </div>
                <div className="liquid-progress w-full rounded-full h-2 mb-1">
                  <div 
                    className={`liquid-progress-fill h-2 rounded-full ${
                      skill.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                      skill.progress >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}
                    style={{ width: `${Math.max(skill.progress, 5)}%` }}
                  ></div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {Math.round(skill.progress)}% progress to target level
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              Complete assessments to track your skill progress across different areas.
            </p>
          </div>
        )}
      </div>

      {/* Recent Assessments */}
      {progressData.recentAssessments.length > 0 && (
        <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <BookOpen className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            Recent Assessment Performance
          </h3>
          <div className="space-y-3">
            {progressData.recentAssessments.map((assessment, index) => (
              <div key={index} className={`liquid-card border rounded-lg p-4 ${
                isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {assessment.career_path.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {new Date(assessment.created_at).toLocaleDateString()} • {assessment.assessment_type === 'ai' ? 'AI Assessment' : 'Standard Assessment'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      assessment.overall_score >= 80 ? 'text-green-600' :
                      assessment.overall_score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {assessment.overall_score}%
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                      {assessment.readiness_level} Readiness
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;