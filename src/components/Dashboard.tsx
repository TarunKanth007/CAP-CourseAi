import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { assessmentService } from '../services/assessmentService';
import { BarChart3, Clock, Target, TrendingUp, LogOut, User } from 'lucide-react';

interface AssessmentHistory {
  id: string;
  career_path: string;
  assessment_type: 'standard' | 'ai';
  overall_score: number;
  readiness_level: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode } = useTheme();
  const [assessments, setAssessments] = useState<AssessmentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAssessments();
    }
  }, [user]);

  const loadAssessments = async () => {
    if (!user) return;

    const result = await assessmentService.getUserAssessments(user.id);
    if (result.success && result.data) {
      setAssessments(result.data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  const averageScore = assessments.length > 0 
    ? Math.round(assessments.reduce((sum, a) => sum + a.overall_score, 0) / assessments.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`liquid-card rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="glass-morphism p-3 rounded-xl liquid-glow floating-element">
              <User className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </h1>
              <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                Track your learning progress and career development
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-300 hover:text-white hover:bg-slate-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`liquid-card p-6 rounded-xl floating-element ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Total Assessments
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {assessments.length}
              </p>
            </div>
            <BarChart3 className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
        </div>

        <div className={`liquid-card p-6 rounded-xl floating-element ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Average Score
              </p>
              <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore}%
              </p>
            </div>
            <Target className={`h-8 w-8 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          </div>
        </div>

        <div className={`liquid-card p-6 rounded-xl floating-element ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                AI Assessments
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                {assessments.filter(a => a.assessment_type === 'ai').length}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
        </div>

        <div className={`liquid-card p-6 rounded-xl floating-element ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Last Assessment
              </p>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {assessments.length > 0 ? formatDate(assessments[0].created_at) : 'None'}
              </p>
            </div>
            <Clock className={`h-8 w-8 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>

      {/* Assessment History */}
      <div className={`liquid-card rounded-xl p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment History
        </h2>

        {assessments.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className={`h-12 w-12 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              No assessments completed yet. Take your first assessment to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div
                key={assessment.id}
                className={`liquid-card border rounded-lg p-4 ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {assessment.career_path.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.assessment_type === 'ai'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {assessment.assessment_type === 'ai' ? 'AI Assessment' : 'Standard'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        {formatDate(assessment.created_at)}
                      </span>
                      <span className={`font-medium ${getScoreColor(assessment.overall_score)}`}>
                        Score: {assessment.overall_score}%
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs ${
                        assessment.readiness_level === 'High' ? 'bg-green-100 text-green-800' :
                        assessment.readiness_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assessment.readiness_level} Readiness
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;