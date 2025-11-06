import React from 'react';
import { useState, useEffect } from 'react';
import { Career, AssessmentResult } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { learningResources } from '../data/resources';
import { companyHiringData, marketInsights } from '../data/industryData';
import MarketInsights from './MarketInsights';
import { TrendingUp, Target, BookOpen, Clock, Star, ExternalLink, Award, Brain, Lightbulb, Sparkles, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface CareerDetailsProps {
  career: Career;
  result: AssessmentResult;
  onRestart: () => void;
  onStartAssessment: () => void;
}

export default function AIResults({ career, result, onRestart, onStartAssessment }: CareerDetailsProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      const recsResult = await assessmentService.getUserRecommendations(user.id);
      if (recsResult.success && recsResult.data) {
        setRecommendations(recsResult.data);
      }
      
      // Also load learning resources based on skill gaps
      const skills = result.skillGaps.map(gap => gap.skill);
      const resourcesResult = await assessmentService.getLearningResources(career.id, skills);
      if (resourcesResult.success && resourcesResult.data) {
        // Merge with existing recommendations
        const additionalRecs = resourcesResult.data.map(resource => ({
          id: resource.id,
          title: resource.title,
          provider: resource.provider,
          duration: resource.duration,
          difficulty: resource.difficulty,
          rating: resource.rating,
          url: resource.url,
          skills: resource.skills,
          type: resource.type
        }));
        setRecommendations(prev => [...prev, ...additionalRecs]);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const skillGaps = result.skillGaps;
  const recommendedResources = recommendations.slice(0, 6);

  // Get market insights and company data
  const careerInsights = marketInsights[career.id];
  const hiringCompanies = companyHiringData[career.id] || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Career Header */}
      <div className={`liquid-card rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Brain className={`h-12 w-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <Sparkles className="h-6 w-6 absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
          </div>
        </div>
        <h1 className={`text-3xl font-bold text-center mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          AI-Powered Assessment Results
        </h1>
        <p className={`text-center mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Personalized insights for your {career.title} journey
        </p>
        
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {career.title}
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {career.description}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {career.averageSalary}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Average Salary
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {career.timeToComplete}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Time to Complete
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {career.demandLevel}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Market Demand
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-purple-500" />
            <div>
              <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {career.difficulty}
              </div>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Difficulty Level
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className={`liquid-card rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Target className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          Skills Gap Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className={`liquid-card border rounded-lg p-4 ${
              isDarkMode ? 'border-slate-600' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {gap.skill}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  gap.gap === 0 ? 'bg-green-100 text-green-800' :
                  gap.gap <= 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gap.gap === 0 ? 'Proficient' : `${gap.gap} levels to go`}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                <div 
                  className={`h-2 rounded-full ${
                    gap.gap === 0 ? 'bg-green-500' :
                    gap.gap <= 2 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.max(20, 100 - (gap.gap * 20))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Learning Resources */}
      <div className={`liquid-card rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <BookOpen className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />
          AI-Recommended Learning Path
        </h2>
        
        {/* AI Analysis Summary */}
        {result.strengths && result.strengths.length > 0 && (
          <div className={`glass-morphism p-4 rounded-lg mb-6 border ${
            isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Your Strengths
                </h3>
                <ul className="space-y-1">
                  {result.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index} className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-1">
                  {result.improvementAreas && result.improvementAreas.slice(0, 3).map((area, index) => (
                    <li key={index} className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      • {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps Section */}
        {result.nextSteps && result.nextSteps.length > 0 && (
          <div className={`liquid-card border-l-4 border-blue-500 p-4 rounded-lg mb-6 ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <h3 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              <Target className="h-4 w-4 mr-1" />
              Immediate Next Steps
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className={`flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                    isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedResources.map((resource) => (
            <div key={resource.id} className={`liquid-card border rounded-lg p-6 hover:shadow-md transition-shadow ${
              isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {resource.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                    {resource.rating}
                  </span>
                </div>
              </div>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                by {resource.provider}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  resource.type === 'course' ? 'bg-blue-100 text-blue-800' :
                  resource.type === 'book' ? 'bg-green-100 text-green-800' :
                  resource.type === 'tutorial' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {resource.type}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  {resource.duration}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded ${
                    isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {skill}
                  </span>
                ))}
                {resource.skills.length > 3 && (
                  <span className={`px-2 py-1 text-xs rounded ${
                    isDarkMode ? 'bg-slate-600 text-slate-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    +{resource.skills.length - 3} more
                  </span>
                )}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center text-sm font-medium liquid-button px-3 py-1 rounded ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                View Resource
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          ))}
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
          onClick={onRestart}
          className={`liquid-button px-6 py-3 border rounded-lg ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-slate-300' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}
        >
          Back to Dashboard
        </button>
        <button
          onClick={onStartAssessment}
          className={`liquid-button px-6 py-3 border rounded-lg ${
            isDarkMode 
              ? 'bg-slate-700 border-slate-600 text-slate-300' 
              : 'bg-gray-100 border-gray-300 text-gray-700'
          }`}
        >
          New Assessment
        </button>
        <button className="liquid-button px-6 py-3 text-white rounded-lg">
          Download Learning Plan
        </button>
      </div>
    </div>
  );
}