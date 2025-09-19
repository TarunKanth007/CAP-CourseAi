import React, { useState } from 'react';
import { CareerPath } from './types';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import CareerSelector from './components/CareerSelector';
import Assessment from './components/Assessment';
import Results from './components/Results';

type AppState = 'career-selection' | 'assessment' | 'results';

function App() {
  const { isDarkMode } = useTheme();
  const [currentState, setCurrentState] = useState<AppState>('career-selection');
  const [selectedCareer, setSelectedCareer] = useState<CareerPath | undefined>();
  const [assessmentResponses, setAssessmentResponses] = useState<Record<string, any>>({});

  const handleCareerSelection = (career: CareerPath) => {
    setSelectedCareer(career);
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (responses: Record<string, any>) => {
    setAssessmentResponses(responses);
    setCurrentState('results');
  };

  const handleStartOver = () => {
    setSelectedCareer(undefined);
    setAssessmentResponses({});
    setCurrentState('career-selection');
  };

  const handleBackToCareerSelection = () => {
    setCurrentState('career-selection');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      <Header />
      
      <main className="py-8">
        {currentState === 'career-selection' && (
          <CareerSelector
            onSelectCareer={handleCareerSelection}
            selectedCareer={selectedCareer}
          />
        )}
        
        {currentState === 'assessment' && selectedCareer && (
          <Assessment
            career={selectedCareer}
            onComplete={handleAssessmentComplete}
            onBack={handleBackToCareerSelection}
          />
        )}
        
        {currentState === 'results' && selectedCareer && (
          <Results
            career={selectedCareer}
            responses={assessmentResponses}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <footer className={`border-t py-6 mt-12 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            AI-Driven Framework for Career-Oriented Learning Path Prediction Using Large Language Models
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Research Project - Batch 70 | Guide: Dr. A. Abdul Rahman (ID: 6229)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;