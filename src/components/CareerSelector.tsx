import React from 'react';
import { CareerPath } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { careerPaths } from '../data/careers';
import { companyHiringData, marketInsights } from '../data/industryData';
import { ChevronRight, TrendingUp, DollarSign } from 'lucide-react';

interface CareerSelectorProps {
  onSelectCareer: (career: CareerPath) => void;
  selectedCareer?: CareerPath;
}

const CareerSelector: React.FC<CareerSelectorProps> = ({ onSelectCareer, selectedCareer }) => {
  const { isDarkMode } = useTheme();
  const [hoveredCareer, setHoveredCareer] = React.useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Choose Your Career Path
        </h2>
        <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Select a career path to begin your personalized assessment and receive tailored learning recommendations
          powered by advanced AI analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {careerPaths.map((career) => (
          <div
            key={career.id}
            className={`liquid-card bg-white rounded-xl shadow-lg border-2 cursor-pointer group ripple-effect relative ${
            className={`liquid-card rounded-xl shadow-lg border-2 cursor-pointer group ripple-effect relative transition-all duration-300 ${
              isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-200'
            } ${
              selectedCareer?.id === career.id
                ? `${isDarkMode ? 'border-blue-400' : 'border-blue-500'} ring-4 ring-blue-500/20 liquid-glow`
                : ''
            }`}
            onClick={() => onSelectCareer(career)}
            onMouseEnter={() => setHoveredCareer(career.id)}
            onMouseLeave={() => setHoveredCareer(null)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{career.icon}</div>
                <span className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full">
                  {career.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              <h3 className={`text-xl font-bold mb-3 transition-colors ${
                isDarkMode 
                  ? 'text-white group-hover:text-blue-400' 
                  : 'text-gray-900 group-hover:text-blue-600'
              }`}>
                {career.title}
              </h3>
              
              <p className={`mb-4 text-sm leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                {career.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {career.averageSalary}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                    {career.growthRate} growth rate
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className={`text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Key Skills:
                </p>
                <div className="flex flex-wrap gap-1">
                  {career.skills.slice(0, 4).map((skill, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-md ${
                        isDarkMode 
                          ? 'bg-slate-700 text-slate-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {career.skills.length > 4 && (
                    <span className={`text-xs px-2 py-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      +{career.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button className="liquid-button text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                  <span>Start Assessment</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Market Info on Hover */}
                {hoveredCareer === career.id && marketInsights[career.id] && (
                  <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full ${
                        marketInsights[career.id].competitionLevel === 'Low' ? 'bg-green-100 text-green-700' :
                        marketInsights[career.id].competitionLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        marketInsights[career.id].competitionLevel === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {marketInsights[career.id].competitionLevel} Competition
                      </span>
                    </div>
                    <div className="mt-1">
                      {marketInsights[career.id].totalJobs.toLocaleString()} jobs available
                    </div>
                  </div>
                )}
              </div>

              {/* Tooltip with detailed info */}
              {hoveredCareer === career.id && (
                <div className={`absolute top-full left-0 right-0 mt-2 text-xs rounded-lg p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-900 text-white border border-slate-700' 
                    : 'bg-black text-white'
                }`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Market Demand:</span>
                      <span className="font-medium">{marketInsights[career.id]?.demandTrend || 'Growing'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Companies Hiring:</span>
                      <span className="font-medium">{companyHiringData[career.id]?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Industry Growth:</span>
                      <span className="font-medium">{marketInsights[career.id]?.industryGrowth || 'N/A'}</span>
                    </div>
                  </div>
                  <div className={`absolute -top-1 left-4 w-2 h-2 transform rotate-45 ${
                    isDarkMode ? 'bg-slate-900' : 'bg-black'
                  }`}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerSelector;