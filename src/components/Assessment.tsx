import React, { useState } from 'react';
import { Question, CareerPath } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { generateQuestions } from '../data/questions';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface AssessmentProps {
  career: CareerPath;
  onComplete: (result: AssessmentResult, responses: Record<string, any>) => void;
  onBack: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ career, onComplete, onBack }) => {
  const { isDarkMode } = useTheme();
  const questions = generateQuestions(career.id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const handleResponse = (questionId: string, response: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Generate assessment result
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
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isAnswered = responses[currentQ?.id] !== undefined;

  if (!currentQ) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className={`liquid-card rounded-2xl shadow-xl p-8 relative overflow-hidden transition-all duration-300 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Floating Background Elements */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-br from-blue-400/20 to-purple-400/20' 
            : 'bg-gradient-to-br from-blue-400/10 to-purple-400/10'
        }`}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl floating-element ${
          isDarkMode 
            ? 'bg-gradient-to-tr from-purple-400/20 to-blue-400/20' 
            : 'bg-gradient-to-tr from-purple-400/10 to-blue-400/10'
        }`}></div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className={`flex items-center space-x-2 transition-colors liquid-button px-3 py-2 rounded-lg ${
                isDarkMode 
                  ? 'text-slate-300 hover:text-white bg-slate-700' 
                  : 'text-gray-600 hover:text-gray-800 bg-gray-100'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Career Selection</span>
            </button>
            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {career.title} Skills Assessment
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
              Help us understand your current proficiency level to provide personalized recommendations.
            </p>
          </div>

          <div className="liquid-progress w-full rounded-full h-3 mb-6">
            <div
              className="liquid-progress-fill h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <div className={`glass-morphism p-6 rounded-xl border relative overflow-hidden ${
            isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {currentQ.question}
            </h3>
            
            <div className={`mb-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Skill: <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {currentQ.skill}
              </span>
            </div>

            {currentQ.type === 'scale' && (
              <div className="space-y-4">
                <div className={`flex justify-between text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleResponse(currentQ.id, level)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-all duration-200 ripple-effect ${
                        responses[currentQ.id] === level
                          ? `${isDarkMode ? 'border-blue-400 bg-blue-400' : 'border-blue-500 bg-blue-500'} text-white liquid-glow`
                          : `${isDarkMode ? 'border-slate-600 hover:border-blue-400 bg-slate-700' : 'border-gray-300 hover:border-blue-300 bg-white'} liquid-card`
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className={`flex justify-between text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                  <span>No Experience</span>
                  <span>Some Knowledge</span>
                  <span>Competent</span>
                  <span>Proficient</span>
                  <span>Expert</span>
                </div>
              </div>
            )}

            {currentQ.type === 'multiple-choice' && (
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleResponse(currentQ.id, option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ripple-effect ${
                      responses[currentQ.id] === option
                        ? `${isDarkMode ? 'border-blue-400 bg-blue-900/50 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-900'} liquid-glow`
                        : `${isDarkMode ? 'border-slate-600 hover:border-blue-400 bg-slate-700' : 'border-gray-300 hover:border-blue-300 bg-white'} liquid-card`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        responses[currentQ.id] === option
                          ? `${isDarkMode ? 'border-blue-400 bg-blue-400' : 'border-blue-500 bg-blue-500'}`
                          : `${isDarkMode ? 'border-slate-500' : 'border-gray-300'}`
                      }`}>
                        {responses[currentQ.id] === option && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-6 py-3 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed liquid-button ${
              isDarkMode 
                ? 'border-slate-600 text-slate-300 bg-slate-700' 
                : 'border-gray-300 text-gray-700 bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="flex items-center space-x-2 px-6 py-3 liquid-button text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;