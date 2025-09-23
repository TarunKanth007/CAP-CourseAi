import React, { useState } from 'react';
import { Career } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { careerPaths } from '../data/careers';
import { Brain, Sparkles, TrendingUp, Users, Clock, Target } from 'lucide-react';

interface CareerSelectorProps {
  onCareerSelect: (career: Career, aiMode?: boolean) => void;
}

const CareerSelector: React.FC<CareerSelectorProps> = ({ onCareerSelect }) => {
  const { isDarkMode } = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Convert CareerPath to Career type
  const careers: Career[] = careerPaths.map(path => ({
    ...path,
    timeToComplete: '3-6 months',
    demandLevel: 'High',
    difficulty: 'Intermediate'
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Choose Your Career Path
        </h2>
        <p className={`text-xl ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Select a career to get personalized AI-powered learning recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {careers.map((career) => (
          <div
            key={career.id}
            className={`liquid-card rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 floating-element ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50'
            }`}
            onMouseEnter={() => setHoveredCard(career.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{career.icon}</div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                {career.category}
              </div>
            </div>

            <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {career.title}
            </h3>
            
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              {career.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                  Average Salary
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {career.averageSalary}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={isDarkMode ? 'text-slate-400' : 'text-gray-500'}>
                  Growth Rate
                </span>
                <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {career.growthRate}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {career.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-md text-xs ${
                    isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {skill}
                </span>
              ))}
              {career.skills.length > 3 && (
                <span className={`px-2 py-1 rounded-md text-xs ${
                  isDarkMode ? 'text-slate-500' : 'text-gray-500'
                }`}>
                  +{career.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => onCareerSelect(career, true)}
                className="w-full liquid-button text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Brain className="h-5 w-5" />
                <span>AI Assessment</span>
                <Sparkles className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onCareerSelect(career, false)}
                className={`w-full py-3 rounded-lg font-semibold border-2 transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                Standard Assessment
              </button>
            </div>

            {hoveredCard === career.id && (
              <div className={`absolute inset-0 rounded-xl pointer-events-none ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                  : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
              } transition-opacity duration-300`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerSelector;