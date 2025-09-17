import React, { useState } from 'react';
import { Question, CareerPath } from '../types';
import { generateQuestions } from '../data/questions';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface AssessmentProps {
  career: CareerPath;
  onComplete: (responses: Record<string, any>) => void;
  onBack: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ career, onComplete, onBack }) => {
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
      onComplete(responses);
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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Back to Career Selection</span>
            </button>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {career.title} Skills Assessment
            </h2>
            <p className="text-gray-600">
              Help us understand your current proficiency level to provide personalized recommendations.
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQ.question}
            </h3>
            
            <div className="mb-2 text-sm text-gray-600">
              Skill: <span className="font-medium text-blue-600">{currentQ.skill}</span>
            </div>

            {currentQ.type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleResponse(currentQ.id, level)}
                      className={`flex-1 py-3 rounded-lg border-2 transition-all duration-200 ${
                        responses[currentQ.id] === level
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 hover:border-blue-300 bg-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
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
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      responses[currentQ.id] === option
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        responses[currentQ.id] === option
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
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
            className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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