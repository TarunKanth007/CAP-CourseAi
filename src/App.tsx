import React, { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import CareerSelector from './components/CareerSelector';
import Assessment from './components/Assessment';
import AIAssessment from './components/AIAssessment';
import Results from './components/Results';
import AIResults from './components/AIResults';
import { Career, AssessmentResult } from './types';

type AppState = 'career-selection' | 'assessment' | 'ai-assessment' | 'results' | 'ai-results';

function App() {
  const { theme } = useTheme();
  const [currentState, setCurrentState] = useState<AppState>('career-selection');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [useAI, setUseAI] = useState(false);

  const handleCareerSelect = (career: Career, aiMode: boolean = false) => {
    setSelectedCareer(career);
    setUseAI(aiMode);
    setCurrentState(aiMode ? 'ai-assessment' : 'assessment');
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    setCurrentState(useAI ? 'ai-results' : 'results');
  };

  const handleRestart = () => {
    setCurrentState('career-selection');
    setSelectedCareer(null);
    setAssessmentResult(null);
    setUseAI(false);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentState === 'career-selection' && (
          <CareerSelector onCareerSelect={handleCareerSelect} />
        )}
        
        {currentState === 'assessment' && selectedCareer && (
          <Assessment 
            career={selectedCareer} 
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState('career-selection')}
          />
        )}
        
        {currentState === 'ai-assessment' && selectedCareer && (
          <AIAssessment 
            career={selectedCareer} 
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState('career-selection')}
          />
        )}
        
        {currentState === 'results' && selectedCareer && assessmentResult && (
          <Results 
            career={selectedCareer}
            result={assessmentResult}
            onRestart={handleRestart}
          />
        )}
        
        {currentState === 'ai-results' && selectedCareer && assessmentResult && (
          <AIResults 
            career={selectedCareer}
            result={assessmentResult}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}

export default App;