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

      // Load progress data
      const progressResult = await assessmentService.getUserProgress(user.id);
      const progress = progressResult.data || [];

      // Calculate progress metrics
      const totalAssessments = assessments.length;
      const averageScore = assessments.length > 0 
        ? Math.round(assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length)
        : 0;

      // Mock data for demonstration
      const mockProgressData: ProgressData = {
        totalAssessments,
        averageScore,
        skillsImproved: Math.floor(totalAssessments * 2.5),
        learningStreak: 7, // days
        completedResources: Math.floor(totalAssessments * 1.8),
        timeSpent: Math.floor(totalAssessments * 3.2), // hours
        achievements: generateAchievements(totalAssessments, averageScore),
        weeklyProgress: generateWeeklyProgress()
      };

      setProgressData(mockProgressData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
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

  const generateWeeklyProgress = () => {
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      weeks.push({
        week: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.floor(Math.random() * 30) + 60
      });
    }
    return weeks;
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
          <div className="flex items-end justify-between h-32 space-x-2">
            {progressData.weeklyProgress.map((week, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-md transition-all duration-500 hover:from-blue-600 hover:to-purple-700"
                  style={{ height: `${(week.score / 100) * 100}%` }}
                ></div>
                <span className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {week.week}
                </span>
              </div>
            ))}
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
          Learning Goals
        </h3>

        <div className="space-y-4">
          <div className={`liquid-card border-l-4 border-blue-500 p-4 rounded-lg ${
            isDarkMode ? 'bg-slate-700' : 'bg-blue-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Complete 10 Assessments
              </h4>
              <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {progressData.totalAssessments}/10
              </span>
            </div>
            <div className="liquid-progress w-full rounded-full h-2">
              <div 
                className="liquid-progress-fill h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                style={{ width: `${Math.min((progressData.totalAssessments / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className={`liquid-card border-l-4 border-green-500 p-4 rounded-lg ${
            isDarkMode ? 'bg-slate-700' : 'bg-green-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Achieve 85% Average Score
              </h4>
              <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {progressData.averageScore}%/85%
              </span>
            </div>
            <div className="liquid-progress w-full rounded-full h-2">
              <div 
                className="liquid-progress-fill h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600"
                style={{ width: `${Math.min((progressData.averageScore / 85) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className={`liquid-card border-l-4 border-purple-500 p-4 rounded-lg ${
            isDarkMode ? 'bg-slate-700' : 'bg-purple-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                30-Day Learning Streak
              </h4>
              <span className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {progressData.learningStreak}/30 days
              </span>
            </div>
            <div className="liquid-progress w-full rounded-full h-2">
              <div 
                className="liquid-progress-fill h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                style={{ width: `${Math.min((progressData.learningStreak / 30) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;