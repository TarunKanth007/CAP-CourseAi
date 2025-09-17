import React, { useState } from 'react';
import { MarketInsights as IndustryMarketInsights, CompanyHiring } from '../data/industryData';
import { TrendingUp, TrendingDown, Users, Building2, MapPin, ExternalLink, Info, Target, BookOpen, Lightbulb } from 'lucide-react';

interface MarketInsightsProps {
  insights: IndustryMarketInsights;
  companies: CompanyHiring[];
}

const MarketInsights: React.FC<MarketInsightsProps> = ({ insights, companies }) => {
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
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-2 text-blue-600" />
          Market Insights for {insights.careerPath}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Jobs</span>
              <Info 
                className="h-4 w-4 text-gray-400 cursor-help"
                onMouseEnter={() => setShowTooltip('total-jobs')}
                onMouseLeave={() => setShowTooltip(null)}
              />
            </div>
            <p className="text-2xl font-bold text-blue-600">{insights.totalJobs.toLocaleString()}</p>
            {showTooltip === 'total-jobs' && (
              <div className="absolute z-10 bg-black text-white text-xs rounded p-2 mt-1 max-w-xs">
                Current job openings across India for this role
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Competition</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(insights.competitionLevel)}`}>
                {insights.competitionLevel}
              </span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{insights.averageApplications}</p>
            <p className="text-xs text-gray-500">avg applications per job</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Demand Trend</span>
              {getTrendIcon(insights.demandTrend)}
            </div>
            <p className="text-lg font-semibold text-green-600">{insights.demandTrend}</p>
            <p className="text-xs text-gray-500">{insights.industryGrowth}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Emerging Skills</span>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-sm font-medium text-purple-600">{insights.emergingSkills.length} new skills</p>
            <p className="text-xs text-gray-500">trending in market</p>
          </div>
        </div>
      </div>

      {/* Key Focus Areas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-green-600" />
          Key Focus Areas to Succeed
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Essential Skills</h5>
            <div className="space-y-2">
              {insights.keyFocusAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Critical Topics</h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {insights.criticalTopics.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <h5 className="font-semibold text-purple-800 mb-2">Emerging Skills to Watch</h5>
          <div className="flex flex-wrap gap-2">
            {insights.emergingSkills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Company Hiring Data */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-blue-600" />
          Companies Hiring for {insights.careerPath}
        </h4>

        {/* MNC Companies */}
        {mncCompanies.length > 0 && (
          <div className="mb-6">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Top MNC Companies
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mncCompanies.map((company) => (
                <div 
                  key={company.id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  onClick={() => setSelectedCompany(company)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{company.logo}</span>
                      <h6 className="font-semibold text-gray-900 group-hover:text-blue-600">{company.name}</h6>
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
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
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
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
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
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedCompany.logo}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h3>
                    <span className="text-sm text-gray-600">{selectedCompany.type} Company</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Hiring Numbers</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Freshers Intake</span>
                        <span className="font-bold text-green-600">{selectedCompany.freshersIntake.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Experienced Intake</span>
                        <span className="font-bold text-blue-600">{selectedCompany.seniorsIntake.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Salary Range</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Fresher</div>
                        <div className="font-bold text-gray-900">{selectedCompany.salaryRange.fresher}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Experienced</div>
                        <div className="font-bold text-gray-900">{selectedCompany.salaryRange.experienced}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Locations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.locations.map((location, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Requirements</h4>
                    <div className="space-y-2">
                      {selectedCompany.requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{req}</span>
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
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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