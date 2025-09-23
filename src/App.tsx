import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CareerSelector from './components/CareerSelector';
import Assessment from './components/Assessment';
import AIAssessment from './components/AIAssessment';
import Results from './components/Results';
import AIResults from './components/AIResults';
import { assessmentService } from './services/assessmentService';
import { Career, AssessmentResult } from './types';

type AppState = 'dashboard' | 'career-selection' | 'assessment' | 'ai-assessment' | 'results' | 'ai-results';

function App() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const [currentState, setCurrentState] = useState<AppState>('dashboard');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [useAI, setUseAI] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleCareerSelect = (career: Career, aiMode: boolean = false) => {
    setSelectedCareer(career);
    setUseAI(aiMode);
    setResponses({});
    setCurrentState(aiMode ? 'ai-assessment' : 'assessment');
  };

  const handleAssessmentComplete = async (result: AssessmentResult, userResponses: Record<string, any>) => {
    setAssessmentResult(result);
    setResponses(userResponses);
    
    // Save assessment to Supabase
    if (user && selectedCareer) {
      await assessmentService.saveAssessment({
        userId: user.id,
        careerPath: selectedCareer.id,
        assessmentType: useAI ? 'ai' : 'standard',
        responses: userResponses,
        results: result,
      });
    }
    
    setCurrentState(useAI ? 'ai-results' : 'results');
  };

  const handleRestart = () => {
    setCurrentState('dashboard');
    setSelectedCareer(null);
    setAssessmentResult(null);
    setResponses({});
    setUseAI(false);
  };

  const handleStartAssessment = () => {
    setCurrentState('career-selection');
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      }`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="floating-orb floating-orb-1"></div>
      <div className="floating-orb floating-orb-2"></div>
      <div className="floating-orb floating-orb-3"></div>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentState === 'dashboard' && (
          <Dashboard />
        )}
        
        {currentState === 'career-selection' && (
          <CareerSelector onCareerSelect={handleCareerSelect} />
        )}
        
        {currentState === 'assessment' && selectedCareer && (
          <Assessment 
            career={selectedCareer} 
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState('dashboard')}
          />
        )}
        
        {currentState === 'ai-assessment' && selectedCareer && (
          <AIAssessment 
            career={selectedCareer} 
            onComplete={handleAssessmentComplete}
            onBack={() => setCurrentState('dashboard')}
          />
        )}
        
        {currentState === 'results' && selectedCareer && assessmentResult && (
          <Results 
            career={selectedCareer}
            result={assessmentResult}
            onRestart={handleRestart}
            onStartAssessment={handleStartAssessment}
          />
        )}
        
        {currentState === 'ai-results' && selectedCareer && assessmentResult && (
          <AIResults 
            career={selectedCareer}
            result={assessmentResult}
            onRestart={handleRestart}
            onStartAssessment={handleStartAssessment}
          />
        )}
      </main>
      
      {/* Floating Action Button for New Assessment */}
      {currentState === 'dashboard' && (
        <button
          onClick={handleStartAssessment}
          className="fixed bottom-8 right-8 liquid-button text-white p-4 rounded-full shadow-lg liquid-glow floating-element"
          title="Start New Assessment"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;