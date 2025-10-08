import React, { useState, useEffect } from 'react';
import { Career, AssessmentResult, SkillGap } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Brain, Loader, CheckCircle, ChevronLeft, Sparkles, MessageSquare } from 'lucide-react';
import { geminiService, AIQuestionResponse } from '../lib/gemini';

import { isGeminiConfigured } from '../lib/gemini';

interface AIAssessmentProps {
  career: Career;
  onComplete: (result: AssessmentResult, responses: Record<string, any>) => void;
  onBack: () => void;
}

const AIAssessment: React.FC<AIAssessmentProps> = ({ career, onComplete, onBack }) => {
  const { isDarkMode } = useTheme();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<AIQuestionResponse[]>([]);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    'Analyzing Career Requirements',
    'Processing Your Profile',
    'Generating AI Questions',
    'Personalizing Assessment',
    'Ready for AI Assessment'
  ];

  useEffect(() => {
    generateInitialQuestions();
  }, [career]);

  const generateInitialQuestions = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Generating AI questions for:', career.title);
      console.log('Gemini configured:', isGeminiConfigured);
      
      // Simulate generation steps
      for (let i = 0; i < generationSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        setGenerationStep(i);
      }

      // Generate first question
      const firstQuestion = await geminiService.generateAdaptiveQuestion({
        careerPath: career.title,
        userResponses: {},
        currentSkillLevel: 'beginner',
        focusAreas: career.skills.slice(0, 3)
      });

      console.log('Generated question:', firstQuestion);

      if (firstQuestion) {
        setQuestions([firstQuestion]);
      } else {
        // Ensure we always have at least one question
        setQuestions([{
          question: `What motivates you to pursue a career in ${career.title}?`,
          type: 'text',
          skill: 'Motivation',
          difficulty: 'beginner',
          reasoning: 'Understanding your career motivation'
        }]);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to mock questions
      setQuestions([{
        question: `What interests you most about pursuing a career in ${career.title}?`,
        type: 'text',
        skill: 'Motivation',
        difficulty: 'beginner',
        reasoning: 'Understanding your motivation helps personalize the assessment'
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNextQuestion = async () => {
    setIsGenerating(true);
    
    try {
      const nextQuestion = await geminiService.generateAdaptiveQuestion({
        careerPath: career.title,
        userResponses: responses,
        currentSkillLevel: 'intermediate',
        focusAreas: career.skills
      });

      if (nextQuestion) {
        setQuestions(prev => [...prev, nextQuestion]);
      }
    } catch (error) {
      console.error('Error generating next question:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResponse = (response: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestionIndex]: response
    }));
    setCurrentResponse('');
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (questions.length < 5) {
      // Generate next question based on responses
      await generateNextQuestion();
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete assessment
      await completeAssessment();
    }
  };

  const completeAssessment = async () => {
    setIsAnalyzing(true);
    
    try {
      // Use Gemini to analyze responses
      const analysis = await geminiService.analyzeUserResponses(career.title, responses, questions);
      
      if (analysis) {
        const result: AssessmentResult = {
          overallScore: analysis.readinessScore,
          skillGaps: analysis.skillGaps.map(gap => ({
            skill: gap.skill,
            currentLevel: gap.currentLevel,
            requiredLevel: gap.targetLevel,
            gap: gap.gap,
            priority: gap.priority
          })),
          recommendations: analysis.nextSteps,
          readinessLevel: analysis.readinessScore >= 80 ? 'High' : 
                         analysis.readinessScore >= 60 ? 'Medium' : 'Low',
          strengths: analysis.strengths,
          improvementAreas: analysis.weaknesses,
          nextSteps: analysis.nextSteps
        };
        
        onComplete(result, responses);
      }
    } catch (error) {
      console.error('Error analyzing responses:', error);
      // Fallback to basic analysis
      const fallbackResult: AssessmentResult = {
        overallScore: 75,
        skillGaps: career.skills.slice(0, 3).map(skill => ({
          skill,
          currentLevel: 3,
          requiredLevel: 4,
          gap: 1,
          priority: 'medium' as const
        })),
        recommendations: ['Continue learning', 'Build projects', 'Practice regularly'],
        readinessLevel: 'Medium'
      };
      
      onComplete(fallbackResult, responses);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / Math.min(questions.length + 1, 6)) * 100 : 0;

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`liquid-card rounded-2xl shadow-xl p-8 text-center ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <Brain className={`h-16 w-16 mx-auto mb-4 animate-pulse ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            AI is Analyzing Your Responses
          </h2>
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
            Creating personalized insights and recommendations...
          </p>
          <div className="mt-6">
            <Loader className="h-8 w-8 animate-spin mx-auto text-purple-500" />
          </div>
        </div>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`liquid-card rounded-2xl shadow-xl p-8 text-center ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="mb-8">
            <div className="relative">
              <Brain className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <Sparkles className="h-6 w-6 absolute top-0 right-1/2 transform translate-x-8 text-yellow-400 animate-pulse" />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              AI is Personalizing Your Assessment
            </h2>
            <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
              Generating adaptive questions for {career.title}
            </p>
          </div>

          <div className="space-y-4">
            {generationSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= generationStep 
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < generationStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : index === generationStep ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`${
                  index <= generationStep 
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

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`liquid-card rounded-2xl shadow-xl p-8 text-center ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
            Loading questions...
          </p>
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
            AI Assessment for {career.title}
          </h2>
          <p className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
            Question {currentQuestionIndex + 1} of {Math.min(questions.length + 1, 5)}
          </p>
          
          {/* Progress Bar */}
          <div className="liquid-progress w-full rounded-full h-3 mt-4">
            <div
              className="liquid-progress-fill h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        <div className={`glass-morphism p-6 rounded-xl border mb-6 ${
          isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {currentQuestion.skill}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              currentQuestion.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              currentQuestion.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.reasoning && (
            <p className={`text-sm mb-4 italic ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              💡 {currentQuestion.reasoning}
            </p>
          )}

          {/* Question Input Based on Type */}
          {currentQuestion.type === 'text' && (
            <textarea
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              placeholder="Share your detailed thoughts..."
              className={`liquid-input w-full p-4 rounded-lg border resize-none h-32 ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              }`}
            />
          )}

          {currentQuestion.type === 'scale' && (
            <div className="space-y-4">
              <div className={`flex justify-between text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCurrentResponse(level.toString())}
                    className={`flex-1 py-3 rounded-lg border-2 transition-all duration-200 ${
                      currentResponse === level.toString()
                        ? `${isDarkMode ? 'border-blue-400 bg-blue-400' : 'border-blue-500 bg-blue-500'} text-white`
                        : `${isDarkMode ? 'border-slate-600 hover:border-blue-400 bg-slate-700' : 'border-gray-300 hover:border-blue-300 bg-white'}`
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentResponse(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    currentResponse === option
                      ? `${isDarkMode ? 'border-blue-400 bg-blue-900/50 text-blue-300' : 'border-blue-500 bg-blue-50 text-blue-900'}`
                      : `${isDarkMode ? 'border-slate-600 hover:border-blue-400 bg-slate-700' : 'border-gray-300 hover:border-blue-300 bg-white'}`
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              isDarkMode 
                ? 'border-slate-600 text-slate-300 bg-slate-700' 
                : 'border-gray-300 text-gray-700 bg-gray-100'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={() => {
              handleResponse(currentResponse);
              nextQuestion();
            }}
            disabled={!currentResponse || isGenerating}
            className="liquid-button px-6 py-3 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>
                {currentQuestionIndex >= 4 ? 'Complete Assessment' : 'Next Question'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssessment;