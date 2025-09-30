import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Career, SkillGap, LearningResource } from '../types';
import { learningResources } from '../data/resources';
import { BookOpen, Clock, Star, ExternalLink, CheckCircle, Play, Calendar, Target } from 'lucide-react';

interface LearningPathGeneratorProps {
  career: Career;
  skillGaps: SkillGap[];
}

interface LearningStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  resources: LearningResource[];
  skills: string[];
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

const LearningPathGenerator: React.FC<LearningPathGeneratorProps> = ({ career, skillGaps }) => {
  const { isDarkMode } = useTheme();
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3months' | '6months' | '12months'>('6months');

  // Generate learning steps based on skill gaps
  const generateLearningSteps = (): LearningStep[] => {
    const criticalSkills = skillGaps.filter(gap => gap.priority === 'high');
    const moderateSkills = skillGaps.filter(gap => gap.priority === 'medium');
    
    const steps: LearningStep[] = [];

    // Phase 1: Foundation (Critical Skills)
    if (criticalSkills.length > 0) {
      steps.push({
        id: 'foundation',
        title: 'Foundation Phase',
        description: 'Build essential skills required for the role',
        duration: '4-8 weeks',
        resources: learningResources.filter(r => 
          r.skills.some(skill => criticalSkills.some(cs => cs.skill === skill))
        ).slice(0, 3),
        skills: criticalSkills.map(cs => cs.skill),
        priority: 'high',
        completed: false
      });
    }

    // Phase 2: Skill Development (Moderate Skills)
    if (moderateSkills.length > 0) {
      steps.push({
        id: 'development',
        title: 'Skill Development Phase',
        description: 'Enhance your capabilities in key areas',
        duration: '6-10 weeks',
        resources: learningResources.filter(r => 
          r.skills.some(skill => moderateSkills.some(ms => ms.skill === skill))
        ).slice(0, 3),
        skills: moderateSkills.map(ms => ms.skill),
        priority: 'medium',
        completed: false
      });
    }

    // Phase 3: Specialization
    steps.push({
      id: 'specialization',
      title: 'Specialization Phase',
      description: 'Develop advanced skills and domain expertise',
      duration: '8-12 weeks',
      resources: learningResources.filter(r => 
        r.difficulty === 'advanced' && 
        r.skills.some(skill => career.skills.includes(skill))
      ).slice(0, 3),
      skills: career.skills.slice(0, 3),
      priority: 'medium',
      completed: false
    });

    // Phase 4: Portfolio & Practice
    steps.push({
      id: 'portfolio',
      title: 'Portfolio Building Phase',
      description: 'Create projects and build your professional portfolio',
      duration: '4-6 weeks',
      resources: learningResources.filter(r => r.type === 'tutorial').slice(0, 2),
      skills: ['Portfolio Development', 'Project Management'],
      priority: 'low',
      completed: false
    });

    return steps;
  };

  const learningSteps = generateLearningSteps();

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const getTimeframeAdjustment = () => {
    const adjustments = {
      '3months': { multiplier: 0.7, label: 'Intensive (3 months)' },
      '6months': { multiplier: 1, label: 'Standard (6 months)' },
      '12months': { multiplier: 1.5, label: 'Extended (12 months)' }
    };
    return adjustments[selectedTimeframe];
  };

  const completionPercentage = (completedSteps.size / learningSteps.length) * 100;

  return (
    <div className={`liquid-card rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Personalized Learning Path
        </h3>
        <div className="flex items-center space-x-2">
          <Calendar className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className={`liquid-input px-3 py-1 rounded-lg border text-sm ${
              isDarkMode 
                ? 'border-slate-600 bg-slate-700 text-white' 
                : 'border-gray-300 bg-white text-gray-900'
            }`}
          >
            <option value="3months">Intensive (3 months)</option>
            <option value="6months">Standard (6 months)</option>
            <option value="12months">Extended (12 months)</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className={`glass-morphism p-4 rounded-lg mb-6 border ${
        isDarkMode ? 'border-blue-400/30' : 'border-blue-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Overall Progress
          </span>
          <span className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {completedSteps.size} of {learningSteps.length} phases completed
          </span>
        </div>
        <div className="liquid-progress w-full rounded-full h-3 mb-2">
          <div 
            className="liquid-progress-fill h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
          Estimated completion: {getTimeframeAdjustment().label}
        </p>
      </div>

      {/* Learning Steps */}
      <div className="space-y-6">
        {learningSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step.id);
          const isActive = index === 0 || completedSteps.has(learningSteps[index - 1]?.id);
          
          return (
            <div
              key={step.id}
              className={`liquid-card border-l-4 p-6 rounded-lg transition-all duration-300 ${
                isCompleted 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : isActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 bg-gray-50 dark:bg-gray-800/50'
              } ${isDarkMode ? 'dark:border-opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleStepCompletion(step.id)}
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                          ? 'border-blue-500 hover:bg-blue-500 hover:text-white'
                          : 'border-gray-300'
                    }`}
                  >
                    {isCompleted && <CheckCircle className="h-4 w-4" />}
                  </button>
                  <div>
                    <h4 className={`text-lg font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Phase {index + 1}: {step.title}
                    </h4>
                    <p className={`text-sm mb-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          {step.duration}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-gray-500" />
                        <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
                          {step.skills.length} skills
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  step.priority === 'high' ? 'bg-red-100 text-red-800' :
                  step.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {step.priority} priority
                </span>
              </div>

              {/* Skills to Learn */}
              <div className="mb-4">
                <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                  Skills to Master:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {step.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-slate-700 text-slate-300' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Resources */}
              {step.resources.length > 0 && (
                <div>
                  <h5 className={`font-medium mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>
                    Recommended Resources:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {step.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className={`liquid-card border rounded-lg p-3 ${
                          isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h6 className={`font-medium text-sm ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {resource.title}
                          </h6>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{resource.rating}</span>
                          </div>
                        </div>
                        <p className={`text-xs mb-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>
                          {resource.provider} • {resource.duration}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded text-xs ${
                            resource.type === 'course' ? 'bg-blue-100 text-blue-800' :
                            resource.type === 'book' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {resource.type}
                          </span>
                          <button className={`flex items-center space-x-1 text-xs liquid-button px-2 py-1 rounded ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300' 
                              : 'text-blue-600 hover:text-blue-700'
                          }`}>
                            <Play className="h-3 w-3" />
                            <span>Start</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button className="liquid-button px-6 py-3 text-white rounded-lg font-semibold">
          Download Learning Plan
        </button>
        <button className={`px-6 py-3 border rounded-lg font-semibold ${
          isDarkMode 
            ? 'border-slate-600 text-slate-300 bg-slate-700' 
            : 'border-gray-300 text-gray-700 bg-gray-100'
        }`}>
          Share Progress
        </button>
      </div>
    </div>
  );
};

export default LearningPathGenerator;