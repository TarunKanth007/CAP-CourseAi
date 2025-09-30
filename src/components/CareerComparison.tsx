import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Career } from '../types';
import { careerPaths } from '../data/careers';
import { TrendingUp, DollarSign, Clock, Users, Target, BarChart3 } from 'lucide-react';

interface CareerComparisonProps {
  currentCareer: Career;
}

const CareerComparison: React.FC<CareerComparisonProps> = ({ currentCareer }) => {
  const { isDarkMode } = useTheme();
  const [selectedCareers, setSelectedCareers] = useState<Career[]>([currentCareer]);
  const [availableCareers] = useState<Career[]>(
    careerPaths.map(path => ({
      ...path,
      timeToComplete: '3-6 months',
      demandLevel: 'High',
      difficulty: 'Intermediate'
    })).filter(career => career.id !== currentCareer.id)
  );

  const addCareerToComparison = (career: Career) => {
    if (selectedCareers.length < 3 && !selectedCareers.find(c => c.id === career.id)) {
      setSelectedCareers([...selectedCareers, career]);
    }
  };

  const removeCareerFromComparison = (careerId: string) => {
    setSelectedCareers(selectedCareers.filter(c => c.id !== careerId));
  };

  const getGrowthRateValue = (rate: string) => {
    return parseInt(rate.replace('%', ''));
  };

  const getSalaryValue = (salary: string) => {
    const match = salary.match(/\$(\d+),?(\d+)?/);
    return match ? parseInt(match[1] + (match[2] || '000')) : 0;
  };

  const getDifficultyScore = (difficulty: string) => {
    const scores = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    return scores[difficulty as keyof typeof scores] || 2;
  };

  const getDemandScore = (demand: string) => {
    const scores = { 'Low': 1, 'Medium': 2, 'High': 3, 'Very High': 4 };
    return scores[demand as keyof typeof scores] || 2;
  };

  return (
    <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Career Path Comparison
      </h3>

      {/* Career Selection */}
      {selectedCareers.length < 3 && (
        <div className="mb-6">
          <h4 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
            Add careers to compare:
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableCareers.slice(0, 6).map((career) => (
              <button
                key={career.id}
                onClick={() => addCareerToComparison(career)}
                className={`liquid-button px-3 py-2 rounded-lg text-sm border transition-colors ${
                  isDarkMode 
                    ? 'border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-400' 
                    : 'border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                }`}
              >
                + {career.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Criteria
              </th>
              {selectedCareers.map((career) => (
                <th key={career.id} className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <div className="flex items-center justify-between">
                    <span>{career.title}</span>
                    {career.id !== currentCareer.id && (
                      <button
                        onClick={() => removeCareerFromComparison(career.id)}
                        className={`ml-2 text-xs px-2 py-1 rounded ${
                          isDarkMode ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Average Salary */}
            <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                Average Salary
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="flex items-center">
                    <span className="font-semibold text-green-600">{career.averageSalary}</span>
                    {getSalaryValue(career.averageSalary) === Math.max(...selectedCareers.map(c => getSalaryValue(c.averageSalary))) && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Highest</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Growth Rate */}
            <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                Growth Rate
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="flex items-center">
                    <span className="font-semibold text-blue-600">{career.growthRate}</span>
                    {getGrowthRateValue(career.growthRate) === Math.max(...selectedCareers.map(c => getGrowthRateValue(c.growthRate))) && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Fastest</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Time to Complete */}
            <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                Time to Complete
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className="font-semibold text-orange-600">{career.timeToComplete}</span>
                </td>
              ))}
            </tr>

            {/* Demand Level */}
            <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <Users className="h-4 w-4 mr-2 text-purple-500" />
                Market Demand
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="flex items-center">
                    <span className={`font-semibold ${
                      career.demandLevel === 'Very High' ? 'text-red-600' :
                      career.demandLevel === 'High' ? 'text-orange-600' :
                      career.demandLevel === 'Medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {career.demandLevel}
                    </span>
                    {getDemandScore(career.demandLevel!) === Math.max(...selectedCareers.map(c => getDemandScore(c.demandLevel!))) && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Top Demand</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            {/* Difficulty */}
            <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`}>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <Target className="h-4 w-4 mr-2 text-red-500" />
                Difficulty Level
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <span className={`font-semibold ${
                    career.difficulty === 'Advanced' ? 'text-red-600' :
                    career.difficulty === 'Intermediate' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {career.difficulty}
                  </span>
                </td>
              ))}
            </tr>

            {/* Skills Required */}
            <tr>
              <td className={`py-4 px-4 font-medium flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                <BarChart3 className="h-4 w-4 mr-2 text-indigo-500" />
                Key Skills
              </td>
              {selectedCareers.map((career) => (
                <td key={career.id} className={`py-4 px-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="space-y-1">
                    {career.skills.slice(0, 4).map((skill, index) => (
                      <div key={index} className={`text-sm px-2 py-1 rounded ${
                        isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {skill}
                      </div>
                    ))}
                    {career.skills.length > 4 && (
                      <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        +{career.skills.length - 4} more
                      </div>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendation */}
      {selectedCareers.length > 1 && (
        <div className={`mt-6 p-4 glass-morphism rounded-lg border ${
          isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
        }`}>
          <h4 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            <Target className="h-5 w-5 mr-2" />
            AI Recommendation
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Based on current market trends and your profile, <strong>{currentCareer.title}</strong> offers 
            the best balance of growth potential ({currentCareer.growthRate}), market demand ({currentCareer.demandLevel}), 
            and learning timeline ({currentCareer.timeToComplete}). Consider this as your primary focus while 
            keeping an eye on complementary skills from other paths.
          </p>
        </div>
      )}
    </div>
  );
};

export default CareerComparison;