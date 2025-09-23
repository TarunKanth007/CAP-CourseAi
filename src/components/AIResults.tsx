import React from 'react';
import { CareerPath, SkillGap, LearningResource } from '../types';
import { learningResources } from '../data/resources';
import { companyHiringData, marketInsights } from '../data/industryData';
import MarketInsights from './MarketInsights';
import { TrendingUp, TrendingDown, Target, BookOpen, Clock, Star, ExternalLink, Award, Brain, Lightbulb } from 'lucide-react';

interface CareerDetailsProps {
  career: CareerPath;
  result: AssessmentResult;
  onRestart: () => void;
  onStartAssessment: () => void;
}

export default function AIResults({ career, result, onRestart, onStartAssessment }: CareerDetailsProps) {
  const skillGaps = result.skillGaps;
  const recommendedResources = learningResources.filter(resource =>
    resource.skills.some(skill => skillGaps.some(gap => gap.skill === skill && gap.gap > 0))
  ).slice(0, 6);

  // Get market insights and company data
  const careerInsights = marketInsights[career.id];
  const hiringCompanies = companyHiringData[career.id] || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Career Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{career.title}</h1>
            <p className="text-gray-600 text-lg">{career.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{career.averageSalary}</div>
            <div className="text-sm text-gray-500">Average Salary</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <div className="font-semibold text-gray-900">{career.timeToComplete}</div>
              <div className="text-sm text-gray-500">Time to Complete</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-semibold text-gray-900">{career.demandLevel}</div>
              <div className="text-sm text-gray-500">Market Demand</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-purple-500" />
            <div>
              <div className="font-semibold text-gray-900">{career.difficulty}</div>
              <div className="text-sm text-gray-500">Difficulty Level</div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-2 text-blue-500" />
          Skills Gap Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillGaps.map((gap, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{gap.skill}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  gap.gap === 0 ? 'bg-green-100 text-green-800' :
                  gap.gap <= 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {gap.gap === 0 ? 'Proficient' : `${gap.gap} levels to go`}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BookOpen className="h-6 w-6 mr-2 text-green-500" />
          Recommended Learning Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedResources.map((resource) => (
            <div key={resource.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">{resource.title}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{resource.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  resource.type === 'course' ? 'bg-blue-100 text-blue-800' :
                  resource.type === 'book' ? 'bg-green-100 text-green-800' :
                  resource.type === 'tutorial' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {resource.type}
                </span>
                <span className="text-sm text-gray-500">{resource.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {resource.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    +{resource.skills.length - 3} more
                  </span>
                )}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
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
          className="liquid-button px-6 py-3 border rounded-lg bg-gray-100 border-gray-300 text-gray-700"
        >
          Back to Dashboard
        </button>
        <button
          onClick={onStartAssessment}
          className="liquid-button px-6 py-3 border rounded-lg bg-gray-100 border-gray-300 text-gray-700"
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