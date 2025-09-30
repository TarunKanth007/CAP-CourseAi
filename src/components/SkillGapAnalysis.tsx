import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SkillGap } from '../types';
import { Target, TrendingUp, AlertTriangle, CheckCircle, BookOpen, Clock } from 'lucide-react';

interface SkillGapAnalysisProps {
  skillGaps: SkillGap[];
  careerTitle: string;
}

const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ skillGaps, careerTitle }) => {
  const { isDarkMode } = useTheme();

  const criticalSkills = skillGaps.filter(gap => gap.priority === 'high');
  const moderateSkills = skillGaps.filter(gap => gap.priority === 'medium');
  const strongSkills = skillGaps.filter(gap => gap.priority === 'low' || gap.gap === 0);

  const getSkillIcon = (priority: string, gap: number) => {
    if (gap === 0) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (priority === 'high') return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (priority === 'medium') return <Target className="h-5 w-5 text-yellow-500" />;
    return <TrendingUp className="h-5 w-5 text-blue-500" />;
  };

  const getEstimatedTime = (gap: number) => {
    const timeMap = {
      0: '0 weeks',
      1: '2-4 weeks',
      2: '1-2 months',
      3: '2-3 months',
      4: '3-4 months',
      5: '4-6 months'
    };
    return timeMap[gap as keyof typeof timeMap] || '6+ months';
  };

  return (
    <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Detailed Skill Gap Analysis for {careerTitle}
      </h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="liquid-card bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Critical Skills</p>
              <p className="text-2xl font-bold">{criticalSkills.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="liquid-card bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Moderate Skills</p>
              <p className="text-2xl font-bold">{moderateSkills.length}</p>
            </div>
            <Target className="h-8 w-8 text-yellow-200" />
          </div>
        </div>

        <div className="liquid-card bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Strong Skills</p>
              <p className="text-2xl font-bold">{strongSkills.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>
      </div>

      {/* Detailed Skill Breakdown */}
      <div className="space-y-6">
        {criticalSkills.length > 0 && (
          <div>
            <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              <AlertTriangle className="h-5 w-5 mr-2" />
              Critical Skills (High Priority)
            </h4>
            <div className="space-y-3">
              {criticalSkills.map((skill, index) => (
                <div key={index} className={`liquid-card border-l-4 border-red-500 p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {skill.skill}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        {getEstimatedTime(skill.gap)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Current: {skill.currentLevel}/5 → Target: {skill.requiredLevel}/5
                    </span>
                    <span className="text-sm font-medium text-red-600">
                      Gap: {skill.gap} levels
                    </span>
                  </div>
                  <div className="liquid-progress w-full rounded-full h-2">
                    <div 
                      className="liquid-progress-fill h-2 rounded-full bg-gradient-to-r from-red-400 to-red-600"
                      style={{ width: `${(skill.currentLevel / skill.requiredLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {moderateSkills.length > 0 && (
          <div>
            <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              <Target className="h-5 w-5 mr-2" />
              Moderate Skills (Medium Priority)
            </h4>
            <div className="space-y-3">
              {moderateSkills.map((skill, index) => (
                <div key={index} className={`liquid-card border-l-4 border-yellow-500 p-4 rounded-lg ${
                  isDarkMode ? 'bg-slate-700' : 'bg-yellow-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {skill.skill}
                    </h5>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        {getEstimatedTime(skill.gap)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Current: {skill.currentLevel}/5 → Target: {skill.requiredLevel}/5
                    </span>
                    <span className="text-sm font-medium text-yellow-600">
                      Gap: {skill.gap} levels
                    </span>
                  </div>
                  <div className="liquid-progress w-full rounded-full h-2">
                    <div 
                      className="liquid-progress-fill h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"
                      style={{ width: `${(skill.currentLevel / skill.requiredLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {strongSkills.length > 0 && (
          <div>
            <h4 className={`text-lg font-semibold mb-4 flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              <CheckCircle className="h-5 w-5 mr-2" />
              Strong Skills (Your Strengths)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strongSkills.map((skill, index) => (
                <div key={index} className={`liquid-card border-l-4 border-green-500 p-3 rounded-lg ${
                  isDarkMode ? 'bg-slate-700' : 'bg-green-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <h5 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {skill.skill}
                    </h5>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Level: {skill.currentLevel}/5 ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Learning Path Recommendation */}
      <div className={`mt-8 p-4 glass-morphism rounded-lg border ${
        isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
      }`}>
        <h4 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          <BookOpen className="h-5 w-5 mr-2" />
          Recommended Learning Path
        </h4>
        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          Focus on critical skills first for maximum impact. Estimated total time to career readiness: {' '}
          <span className="font-semibold">
            {criticalSkills.length * 2 + moderateSkills.length * 1} months
          </span>
        </p>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;