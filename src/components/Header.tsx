import React from 'react';
import { GraduationCap, Brain, Target } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-8 shadow-lg overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-element absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="floating-element absolute top-20 right-20 w-32 h-32 bg-purple-300/10 rounded-full blur-2xl"></div>
        <div className="floating-element absolute bottom-10 left-1/3 w-24 h-24 bg-blue-300/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="glass-morphism p-3 rounded-xl liquid-glow floating-element">
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
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg floating-element">
              <GraduationCap className="h-5 w-5" />
              <span>Project by Dr. A. Abdul Rahman</span>
            </div>
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-lg floating-element">
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