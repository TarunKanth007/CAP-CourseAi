import React from 'react';
import { CareerPath, SkillGap, LearningResource } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { learningResources } from '../data/resources';
import { companyHiringData, marketInsights } from '../data/industryData';
import MarketInsights from './MarketInsights';
import { TrendingUp, TrendingDown, Target, BookOpen, Clock, Star, ExternalLink, Award } from 'lucide-react';

interface ResultsProps {
  career: CareerPath;
  responses: Record<string, any>;
  onStartOver: () => void;
}

const Results: React.FC<ResultsProps> = ({ career, responses, onStartOver }) => {
  const { isDarkMode } = useTheme();

  // Calculate skill levels and gaps
  const calculateSkillGaps = (): SkillGap[] => {
    const gaps: SkillGap[] = [];
    const requiredLevel = 4; // Industry standard level

    career.skills.forEach(skill => {
      // Find response for this skill
      const questionWithSkill = Object.entries(responses).find(([_, value]) => 
        typeof value === 'number' || typeof value === 'string'
      );
      
      let currentLevel = 0;
      if (questionWithSkill) {
        const [_, response] = questionWithSkill;
        if (typeof response === 'number') {
          currentLevel = response;
        } else if (typeof response === 'string') {
          // Convert text responses to numeric levels
          const levelMap: Record<string, number> = {
            'Never used it': 1,
            'No experience': 1,
            'Not familiar': 1,
            'Never used any': 1,
            'Beginner': 1,
            'Basic understanding': 2,
            'Basic knowledge': 2,
            'Basic commands': 2,
            'Some experience': 2,
            'Built several projects': 3,
            'Comfortable with branching': 3,
            'Managed campaigns': 3,
            'Expert level': 4,
            'Advanced workflows': 4,
            'Expert in ML': 4,
            'Advanced expert': 4
          };
          currentLevel = levelMap[response] || Math.floor(Math.random() * 3) + 2;
        }
      } else {
        // Random level for demo purposes
        currentLevel = Math.floor(Math.random() * 4) + 1;
      }

      const gap = Math.max(0, requiredLevel - currentLevel);
      gaps.push({
        skill,
        currentLevel,
        requiredLevel,
        gap,
        priority: gap >= 2 ? 'high' : gap >= 1 ? 'medium' : 'low'
      });
    });

    return gaps.sort((a, b) => b.gap - a.gap);
  };

  const skillGaps = calculateSkillGaps();
  const overallScore = Math.round((skillGaps.reduce((sum, gap) => sum + gap.currentLevel, 0) / skillGaps.length) * 20);
  const strongSkills = skillGaps.filter(gap => gap.gap === 0).length;
  const improvementAreas = skillGaps.filter(gap => gap.gap > 0).length;

  // Filter resources based on skill gaps
  const recommendedResources = learningResources.filter(resource =>
    resource.skills.some(skill => skillGaps.some(gap => gap.skill === skill && gap.gap > 0))
  ).slice(0, 6);

  // Get market insights and company data
  const careerInsights = marketInsights[career.id];
  const hiringCompanies = companyHiringData[career.id] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment Results
        </h2>
        <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Your personalized learning path for {career.title}
        </p>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="liquid-card bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white floating-element">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Overall Score</p>
              <p className="text-3xl font-bold">{overallScore}%</p>
            </div>
            <Award className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="liquid-card bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white floating-element">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Strong Skills</p>
              <p className="text-3xl font-bold">{strongSkills}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="liquid-card bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white floating-element">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Improvement Areas</p>
              <p className="text-3xl font-bold">{improvementAreas}</p>
            </div>
            <Target className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="liquid-card bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white floating-element">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Readiness Level</p>
              <p className="text-3xl font-bold">
                {overallScore >= 80 ? 'High' : overallScore >= 60 ? 'Medium' : 'Low'}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Analysis */}
        <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Skill Analysis
          </h3>
          <div className="space-y-4">
            {skillGaps.map((gap, index) => (
              <div key={index} className="liquid-card border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {gap.skill}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    gap.priority === 'high' ? 'bg-red-100 text-red-800' :
                    gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {gap.priority === 'low' ? 'Strong' : gap.priority} priority
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className={`flex justify-between text-sm mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    <span>Current Level: {gap.currentLevel}/5</span>
                    <span>Target: {gap.requiredLevel}/5</span>
                  </div>
                  <div className="liquid-progress w-full rounded-full h-3">
                    <div 
                      className={`liquid-progress-fill h-3 rounded-full ${
                        gap.gap === 0 ? 'bg-green-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
                      }`}
                      style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {gap.gap > 0 && (
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    Recommended improvement: {gap.gap} level{gap.gap > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recommended Learning Resources
          </h3>
          <div className="space-y-4">
            {recommendedResources.map((resource) => (
              <div key={resource.id} className="liquid-card border rounded-lg p-4 ripple-effect">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {resource.title}
                    </h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {resource.provider}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    resource.type === 'certification' ? 'bg-purple-100 text-purple-800' :
                    resource.type === 'course' ? 'bg-blue-100 text-blue-800' :
                    resource.type === 'book' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.type}
                  </span>
                </div>

                <div className={`flex items-center space-x-4 mb-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{resource.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{resource.rating}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs ${
                    resource.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                    resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {resource.skills.slice(0, 2).map((skill, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-md ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {skill}
                      </span>
                    ))}
                    {resource.skills.length > 2 && (
                      <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        +{resource.skills.length - 2}
                      </span>
                    )}
                  </div>
                  <button className={`flex items-center space-x-1 text-sm font-medium liquid-button px-3 py-1 rounded-md ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300 bg-blue-900/50' 
                      : 'text-blue-600 hover:text-blue-700 bg-blue-50'
                  }`}>
                    <span>View Resource</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Insights Section */}
      {careerInsights && (
        <MarketInsights 
          insights={careerInsights}
          companies={hiringCompanies}
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={onStartOver}
          className={`liquid-button px-6 py-3 border rounded-lg ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-slate-300' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}
        >
          Start Over
        </button>
        <button className="liquid-button px-6 py-3 text-white rounded-lg">
          Download Learning Plan
        </button>
      </div>
    </div>
  );
};

export default Results;