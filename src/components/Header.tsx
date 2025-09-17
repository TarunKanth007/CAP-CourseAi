import React from 'react';
import { GraduationCap, Brain, Target } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                AI Career Path Predictor
              </h1>
              <p className="text-blue-100 mt-1 text-sm">
                Intelligent Learning Path Recommendations Powered by LLM
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <GraduationCap className="h-5 w-5" />
              <span>Project by Dr. A. Abdul Rahman</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Target className="h-5 w-5" />
              <span>Batch 70</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;