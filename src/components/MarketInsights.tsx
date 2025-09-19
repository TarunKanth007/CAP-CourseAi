import React, { useState } from 'react';
import { MarketInsights as IndustryMarketInsights, CompanyHiring } from '../data/industryData';
import { useTheme } from '../contexts/ThemeContext';
import { TrendingUp, TrendingDown, Users, Building2, MapPin, ExternalLink, Info, Target, BookOpen, Lightbulb } from 'lucide-react';

interface MarketInsightsProps {
  insights: IndustryMarketInsights;
  companies: CompanyHiring[];
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ insights, companies }) => {
  const { isDarkMode } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState<CompanyHiring | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Very High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'Growing' ? <TrendingUp className="h-5 w-5 text-green-600" /> : 
           trend === 'Stable' ? <div className="h-5 w-5 bg-yellow-500 rounded-full" /> :
           <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const mncCompanies = companies.filter(c => c.type === 'MNC');
  const serviceCompanies = companies.filter(c => c.type === 'Service');
  const productCompanies = companies.filter(c => c.type === 'Product');

  return (
    <div className="space-y-8">
      {/* Market Overview */}
      <div className={`glass-morphism rounded-xl p-6 border relative overflow-hidden ${
        isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
      }`}>
        {/* Floating Background Elements */}
        <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-400/30 to-purple-400/30' 
            : 'bg-gradient-to-br from-blue-400/20 to-purple-400/20'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-purple-400/30 to-blue-400/30' 
            : 'bg-gradient-to-tr from-purple-400/20 to-blue-400/20'
        }`}></div>
        
        <h3 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Target className={`h-6 w-6 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          Market Insights for {insights.careerPath}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`liquid-card p-4 rounded-lg shadow-sm floating-element ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Total Jobs
              </span>
              <Info
                className={`h-4 w-4 cursor-help ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}
                onMouseEnter={() => setShowTooltip('total-jobs')}
                onMouseLeave={() => setShowTooltip(null)}
              />
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {insights.totalJobs.toLocaleString()}
            </p>
            {showTooltip === 'total-jobs' && (
              <div className={`absolute z-10 text-xs rounded p-2 mt-1 max-w-xs ${
                isDarkMode ? 'bg-slate-900 text-white' : 'bg-black text-white'
              }`}>
                Current job openings across India for this role
              </div>
            )}
          </div>

          <div className={`liquid-card p-4 rounded-lg shadow-sm floating-element ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Competition
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(insights.competitionLevel)}`}>
                {insights.competitionLevel}
              </span>
            </div>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {insights.averageApplications}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              avg applications per job
            </p>
          </div>

          <div className={`liquid-card p-4 rounded-lg shadow-sm floating-element ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Demand Trend
              </span>
              {getTrendIcon(insights.demandTrend)}
            </div>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {insights.demandTrend}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              {insights.industryGrowth}
            </p>
          </div>

          <div className={`liquid-card p-4 rounded-lg shadow-sm floating-element ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Emerging Skills
              </span>
              <Lightbulb className={`h-4 w-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            </div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {insights.emergingSkills.length} new skills
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
              trending in market
            </p>
          </div>
        </div>
      </div>

      {/* Key Focus Areas */}
      <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h4 className={`text-xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <BookOpen className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
          Key Focus Areas to Succeed
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className={`font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
              Essential Skills
            </h5>
            <div className="space-y-2">
              {insights.keyFocusAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {area}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className={`font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
              Critical Topics
            </h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {insights.criticalTopics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                  <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 glass-morphism rounded-lg">
          <h5 className={`font-semibold mb-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            Emerging Skills to Watch
          </h5>
          <div className="flex flex-wrap gap-2">
            {insights.emergingSkills.map((skill, index) => (
              <span key={index} className={`px-3 py-1 rounded-full text-sm floating-element ${
                isDarkMode 
                  ? 'bg-purple-800/50 text-purple-300' 
                  : 'bg-purple-200 text-purple-800'
              }`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Company Hiring Data */}
      <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        <h4 className={`text-xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Building2 className={`h-5 w-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          Companies Hiring for {insights.careerPath}
        </h4>

        {/* MNC Companies */}
        {mncCompanies.length > 0 && (
          <div className="mb-6">
            <h5 className={`font-semibold mb-3 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
              <div className={`w-3 h-3 rounded-full mr-2 ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
              Top MNC Companies
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mncCompanies.map((company) => (
                <div 
                  key={company.id} 
                  className="liquid-card border rounded-lg p-4 cursor-pointer group ripple-effect"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{company.logo}</span>
                      <h6 className={`font-semibold transition-colors ${
                        isDarkMode 
                          ? 'text-white group-hover:text-blue-400' 
                          : 'text-gray-900 group-hover:text-blue-600'
                      }`}>
                        {company.name}
                      </h6>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.hiringStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      company.hiringStatus === 'Seasonal' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.hiringStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Freshers:
                      </span>
                      <span className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {company.freshersIntake.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                        Experienced:
                      </span>
                      <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {company.seniorsIntake.toLocaleString()}
                      </span>
                    </div>
                    <div className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                      <span className="font-medium">Salary:</span> {company.salaryRange.fresher}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Companies */}
        {serviceCompanies.length > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Service Companies
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceCompanies.map((company) => (
                <div 
                  key={company.id} 
                  className="liquid-card border rounded-lg p-4 cursor-pointer group ripple-effect"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{company.logo}</span>
                      <h6 className="font-semibold text-gray-900 group-hover:text-green-600">{company.name}</h6>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.hiringStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      company.hiringStatus === 'Seasonal' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.hiringStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Freshers:</span>
                      <span className="font-medium text-green-600">{company.freshersIntake.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experienced:</span>
                      <span className="font-medium text-blue-600">{company.seniorsIntake.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Salary:</span> {company.salaryRange.fresher}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Companies */}
        {productCompanies.length > 0 && (
          <div>
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Product Companies
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productCompanies.map((company) => (
                <div 
                  key={company.id} 
                  className="liquid-card border rounded-lg p-4 cursor-pointer group ripple-effect"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{company.logo}</span>
                      <h6 className="font-semibold text-gray-900 group-hover:text-purple-600">{company.name}</h6>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      company.hiringStatus === 'Active' ? 'bg-green-100 text-green-800' :
                      company.hiringStatus === 'Seasonal' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {company.hiringStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Freshers:</span>
                      <span className="font-medium text-green-600">{company.freshersIntake.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Experienced:</span>
                      <span className="font-medium text-blue-600">{company.seniorsIntake.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Salary:</span> {company.salaryRange.fresher}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`liquid-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto liquid-glow ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedCompany.logo}</span>
                  <div>
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedCompany.name}
                    </h3>
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {selectedCompany.type} Company
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className={`text-2xl liquid-button w-8 h-8 rounded-full flex items-center justify-center ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-slate-200 bg-slate-700' 
                      : 'text-gray-400 hover:text-gray-600 bg-gray-100'
                  }`}
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Hiring Numbers
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          Freshers Intake
                        </span>
                        <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {selectedCompany.freshersIntake.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 glass-morphism rounded-lg">
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>
                          Experienced Intake
                        </span>
                        <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {selectedCompany.seniorsIntake.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Salary Range
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 glass-morphism rounded-lg">
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Fresher
                        </div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedCompany.salaryRange.fresher}
                        </div>
                      </div>
                      <div className="p-3 glass-morphism rounded-lg">
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                          Experienced
                        </div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedCompany.salaryRange.experienced}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className={`font-semibold mb-2 flex items-center ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      <MapPin className="h-4 w-4 mr-1" />
                      Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.locations.map((location, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-sm floating-element ${
                          isDarkMode 
                            ? 'bg-blue-800/50 text-blue-300' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                      Key Requirements
                    </h4>
                    <div className="space-y-2">
                      {selectedCompany.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                          <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCompany.hiringStatus === 'Active' ? 'bg-green-100 text-green-800' :
                  selectedCompany.hiringStatus === 'Seasonal' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedCompany.hiringStatus} Hiring
                </span>
                <a
                  href={selectedCompany.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 liquid-button text-white px-4 py-2 rounded-lg"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketInsights;