import React, { useState, useEffect } from 'react';
import { Career, AssessmentResult, SkillGap } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, Loader, CheckCircle, ChevronLeft } from 'lucide-react';

interface AIAssessmentProps {
  career: Career;
  onComplete: (result: AssessmentResult, responses: Record<string, any>) => void;
  onBack: () => void;
}

const AIAssessment: React.FC<AIAssessmentProps> = ({ career, onComplete, onBack }) => {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});

  const steps = [
    'Analyzing Career Requirements',
    'Generating Personalized Questions',
    'Preparing Assessment Interface',
    'Ready for Assessment'
  ];

  useEffect(() => {
    // Simulate AI question generation
    const generateQuestions = async () => {
      setIsGenerating(true);
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setCurrentStep(i);
      }

      // Generate mock questions based on career
      const mockQuestions = [
        `How would you approach learning ${career.skills[0]} for ${career.title}?`,
        `Describe your experience with ${career.skills[1] || 'relevant technologies'}.`,
        `What motivates you to pursue a career in ${career.category}?`,
        `How do you stay updated with trends in ${career.title}?`,
        `Describe a challenging project you've worked on related to this field.`
      ];

      setQuestions(mockQuestions);
      setIsGenerating(false);
    };

    generateQuestions();
  }, [career]);

  const handleResponse = (questionIndex: number, response: string) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: response
    }));
  };

  const completeAssessment = () => {
    // Generate mock assessment result
    const skillGaps: SkillGap[] = career.skills.map(skill => ({
      skill,
      currentLevel: Math.floor(Math.random() * 3) + 2,
      requiredLevel: 4,
      gap: Math.floor(Math.random() * 2) + 1,
      priority: Math.random() > 0.5 ? 'high' : 'medium' as 'high' | 'medium' | 'low'
    }));

    const result: AssessmentResult = {
      overallScore: Math.floor(Math.random() * 30) + 60,
      skillGaps,
      recommendations: [
        `Focus on strengthening ${skillGaps[0]?.skill} skills`,
        `Consider taking advanced courses in ${skillGaps[1]?.skill}`,
        'Build a portfolio showcasing your projects'
      ],
      readinessLevel: 'Medium'
    };

    onComplete(result, responses);
  };

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`liquid-card rounded-2xl shadow-xl p-8 text-center ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="mb-8">
            <Brain className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI is Analyzing Your Career Path
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
              Creating personalized assessment for {career.title}
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : index === currentStep ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`${
                  index <= currentStep 
                    ? isDarkMode ? 'text-white' : 'text-gray-900'
                    : isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className={`liquid-card rounded-2xl shadow-xl p-8 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="mb-8">
          <button
            onClick={onBack}
            className={`flex items-center space-x-2 mb-4 liquid-button px-3 py-2 rounded-lg ${
              isDarkMode ? 'text-slate-300 bg-slate-700' : 'text-gray-600 bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Career Selection</span>
          </button>

          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Assessment for {career.title}
          </h2>
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
            Answer these personalized questions to get detailed insights
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className={`glass-morphism p-6 rounded-xl border ${
              isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Question {index + 1}
              </h3>
              <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                {question}
              </p>
              <textarea
                value={responses[index] || ''}
                onChange={(e) => handleResponse(index, e.target.value)}
                placeholder="Share your thoughts..."
                className={`liquid-input w-full p-4 rounded-lg border resize-none h-32 ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                    : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={completeAssessment}
            disabled={Object.keys(responses).length < questions.length}
            className="liquid-button px-8 py-3 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete AI Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssessment;