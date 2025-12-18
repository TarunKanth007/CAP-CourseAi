import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Check if Gemini is properly configured
export const isGeminiConfigured = apiKey && 
  apiKey !== 'your-gemini-api-key-here' && 
  apiKey !== 'your-api-key' &&
  apiKey.length > 20;

if (!isGeminiConfigured) {
  console.warn('⚠️ Gemini AI not configured properly. Please update your .env file with a valid API key.');
  console.log('📝 Instructions:');
  console.log('1. Go to https://makersuite.google.com/app/apikey');
  console.log('2. Create a new API key');
  console.log('3. Update .env file: VITE_GEMINI_API_KEY=your-api-key');
}

// Initialize Gemini AI
export const genAI = isGeminiConfigured ? new GoogleGenerativeAI(apiKey) : null;

export interface AIQuestionRequest {
  careerPath: string;
  userResponses: Record<string, any>;
  currentSkillLevel: string;
  focusAreas: string[];
}

export interface AIQuestionResponse {
  question: string;
  type: 'multiple-choice' | 'scale' | 'text' | 'scenario';
  options?: string[];
  skill: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reasoning: string;
}

export interface AIAnalysisResponse {
  overallAssessment: string;
  skillGaps: Array<{
    skill: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
  }>;
  learningPath: Array<{
    phase: string;
    duration: string;
    skills: string[];
    resources: string[];
  }>;
  nextSteps: string[];
  confidenceScore: number;
}

export interface DetailedAssessmentAnalysis {
  overallAssessment: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetLevel: 'Intermediate' | 'Advanced' | 'Expert' | 'Master';
  readinessScore: number;
  strengths: string[];
  weaknesses: string[];
  skillGaps: Array<{
    skill: string;
    currentLevel: number;
    targetLevel: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
    estimatedTimeToImprove: string;
  }>;
  learningPath: Array<{
    phase: string;
    duration: string;
    skills: string[];
    resources: Array<{
      title: string;
      type: string;
      provider: string;
      url: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    milestones: string[];
  }>;
  courseRecommendations: Array<{
    title: string;
    provider: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    skills: string[];
    priority: 'high' | 'medium' | 'low';
    reasoning: string;
  }>;
  nextSteps: string[];
  timelineToReadiness: string;
  marketInsights: {
    demandLevel: string;
    competitionLevel: string;
    salaryExpectation: string;
    jobOpportunities: string[];
  };
}

export interface LearningPlanRequest {
  career: string;
  currentLevel: number;
  skillGaps: Array<{ skill: string; gap: number }>;
  assessmentHistory: any[];
  userGoals: string[];
  responses: Record<string, any>;
}

export interface LearningPlanResponse {
  learningPath: {
    totalDuration: string;
    phases: Array<{
      phase: string;
      duration: string;
      skills: string[];
      resources: Array<{
        title: string;
        type: string;
        provider: string;
        duration: string;
        priority: string;
      }>;
      milestones: string[];
    }>;
  };
  insights: string;
}

class GeminiService {
  private model = genAI?.getGenerativeModel({ model: 'gemini-pro' });

  async generateAdaptiveQuestion(request: AIQuestionRequest): Promise<AIQuestionResponse | null> {
    if (!isGeminiConfigured || !this.model) {
      console.warn('Gemini not configured, returning mock question');
      return this.getMockQuestion(request);
    }

    try {
      const prompt = this.buildQuestionPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseQuestionResponse(text, request);
    } catch (error) {
      console.error('Error generating AI question:', error);
      return this.getMockQuestion(request);
    }
  }

  async analyzeUserResponses(
    careerPath: string,
    responses: Record<string, any>,
    questions?: AIQuestionResponse[]
  ): Promise<AIAnalysisResponse | null> {
    if (!isGeminiConfigured || !this.model) {
      console.warn('Gemini not configured, returning mock analysis');
      return this.getMockAnalysis(careerPath, responses);
    }

    try {
      const prompt = this.buildAnalysisPrompt(careerPath, responses, questions);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseAnalysisResponse(text, careerPath);
    } catch (error) {
      console.error('Error analyzing responses:', error);
      return this.getMockAnalysis(careerPath, responses);
    }
  }

  private buildQuestionPrompt(request: AIQuestionRequest): string {
    return `
You are an AI career assessment expert. Generate a personalized question for a ${request.careerPath} career assessment.

Context:
- Career Path: ${request.careerPath}
- Current Skill Level: ${request.currentSkillLevel}
- Focus Areas: ${request.focusAreas.join(', ')}
- Previous Responses: ${JSON.stringify(request.userResponses, null, 2)}

Generate a JSON response with the following structure:
{
  "question": "Your adaptive question here",
  "type": "multiple-choice|scale|text|scenario",
  "options": ["option1", "option2", "option3", "option4"] (only for multiple-choice),
  "skill": "specific skill being assessed",
  "difficulty": "beginner|intermediate|advanced",
  "reasoning": "Why this question is relevant based on previous responses"
}

Make the question:
1. Adaptive to their previous responses
2. Relevant to the career path
3. Appropriately challenging
4. Focused on practical skills/scenarios
5. Clear and unambiguous

Respond only with valid JSON.
    `;
  }

  private buildAnalysisPrompt(careerPath: string, responses: Record<string, any>, questions?: AIQuestionResponse[]): string {
    const questionsContext = questions ? `
Assessment Questions Asked:
${questions.map((q, i) => `${i + 1}. [${q.skill} - ${q.difficulty}] ${q.question}`).join('\n')}
` : '';

    return `
You are an AI career counselor analyzing assessment responses for a ${careerPath} position.

${questionsContext}

User Responses:
${JSON.stringify(responses, null, 2)}

Provide a comprehensive analysis in JSON format:
{
  "overallAssessment": "Overall assessment summary based on their specific responses",
  "skillGaps": [
    {
      "skill": "skill name",
      "currentLevel": 1-5,
      "targetLevel": 1-5,
      "gap": 0-4,
      "priority": "high|medium|low",
      "recommendations": ["specific recommendation 1", "recommendation 2"]
    }
  ],
  "learningPath": [
    {
      "phase": "phase name",
      "duration": "time estimate",
      "skills": ["skill1", "skill2"],
      "resources": ["resource type 1", "resource type 2"]
    }
  ],
  "nextSteps": ["immediate action 1", "action 2", "action 3"],
  "confidenceScore": 0-100
}

Base your analysis on:
1. Industry standards for ${careerPath}
2. Current market demands
3. User's demonstrated knowledge in their specific responses
4. Skill progression pathways
5. Learning efficiency based on their answers

Respond only with valid JSON.
    `;
  }

  private parseQuestionResponse(text: string, request: AIQuestionRequest): AIQuestionResponse {
    try {
      const parsed = JSON.parse(text);
      return {
        question: parsed.question || 'How would you approach this challenge?',
        type: parsed.type || 'text',
        options: parsed.options,
        skill: parsed.skill || request.focusAreas[0] || 'General',
        difficulty: parsed.difficulty || 'intermediate',
        reasoning: parsed.reasoning || 'Generated based on your responses'
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return this.getMockQuestion(request);
    }
  }

  private parseAnalysisResponse(text: string, careerPath: string): AIAnalysisResponse {
    try {
      const parsed = JSON.parse(text);
      return {
        overallAssessment: parsed.overallAssessment || 'Analysis completed',
        skillGaps: parsed.skillGaps || [],
        learningPath: parsed.learningPath || [],
        nextSteps: parsed.nextSteps || [],
        confidenceScore: parsed.confidenceScore || 75
      };
    } catch (error) {
      console.error('Error parsing AI analysis:', error);
      return this.getMockAnalysis(careerPath, {});
    }
  }

  private buildLearningPlanPrompt(request: LearningPlanRequest): string {
    return `
You are an AI learning plan expert. Create a comprehensive, personalized learning plan for a ${request.career} career path.

User Context:
- Career: ${request.career}
- Current Level: ${request.currentLevel}%
- Skill Gaps: ${JSON.stringify(request.skillGaps, null, 2)}
- Assessment History: ${request.assessmentHistory.length} previous assessments
- User Goals: ${request.userGoals.join(', ')}
- Recent Responses: ${JSON.stringify(request.responses, null, 2)}

Generate a JSON response with this structure:
{
  "learningPath": {
    "totalDuration": "estimated total time",
    "phases": [
      {
        "phase": "phase name",
        "duration": "time estimate",
        "skills": ["skill1", "skill2"],
        "resources": [
          {
            "title": "resource title",
            "type": "course|book|tutorial|certification",
            "provider": "provider name",
            "duration": "time estimate",
            "priority": "high|medium|low"
          }
        ],
        "milestones": ["milestone1", "milestone2"]
      }
    ]
  },
  "insights": "Detailed AI insights about the user's learning journey, strengths, challenges, and personalized advice for success in their chosen career path."
}

Make the plan:
1. Highly personalized based on their current level and gaps
2. Realistic and achievable with clear timelines
3. Progressive from foundation to advanced concepts
4. Include specific, actionable resources
5. Provide motivational and strategic insights

Respond only with valid JSON.
    `;
  }

  private parseLearningPlanResponse(text: string, request: LearningPlanRequest): LearningPlanResponse {
    try {
      const parsed = JSON.parse(text);
      return {
        learningPath: parsed.learningPath || this.getDefaultLearningPath(request.career),
        insights: parsed.insights || `Based on your ${request.currentLevel}% score in ${request.career}, you show strong potential. Focus on addressing your skill gaps systematically while building on your existing strengths.`
      };
    } catch (error) {
      console.error('Error parsing learning plan response:', error);
      return this.getMockLearningPlan(request);
    }
  }

  private getMockLearningPlan(request: LearningPlanRequest): LearningPlanResponse {
    return {
      learningPath: {
        totalDuration: '6-9 months',
        phases: [
          {
            phase: 'Foundation Phase',
            duration: '6-8 weeks',
            skills: ['Basic concepts', 'Fundamental tools'],
            resources: [
              {
                title: `Introduction to ${request.career}`,
                type: 'course',
                provider: 'Online Learning Platform',
                duration: '4-6 weeks',
                priority: 'high'
              }
            ],
            milestones: ['Complete basic concepts', 'Set up learning environment']
          },
          {
            phase: 'Development Phase',
            duration: '8-12 weeks',
            skills: ['Practical application', 'Project work'],
            resources: [
              {
                title: `Advanced ${request.career} Skills`,
                type: 'course',
                provider: 'Professional Platform',
                duration: '8-10 weeks',
                priority: 'high'
              }
            ],
            milestones: ['Build first project', 'Master intermediate concepts']
          }
        ]
      },
      insights: `Based on your assessment for ${request.career}, you demonstrate ${request.currentLevel >= 70 ? 'strong' : 'developing'} potential. Your learning plan is customized to address your specific skill gaps while building on your existing knowledge. Focus on consistent daily practice and hands-on projects to accelerate your progress.`
    };
  }

  private getDefaultLearningPath(career: string) {
    return {
      totalDuration: '6-9 months',
      phases: [
        {
          phase: 'Foundation Phase',
          duration: '6-8 weeks',
          skills: ['Basic concepts', 'Fundamental tools'],
          resources: [
            {
              title: `Introduction to ${career}`,
              type: 'course',
              provider: 'Online Learning Platform',
              duration: '4-6 weeks',
              priority: 'high'
            }
          ],
          milestones: ['Complete basic concepts', 'Set up learning environment']
        }
      ]
    };
  }

  private getMockQuestion(request: AIQuestionRequest): AIQuestionResponse {
    const mockQuestions = [
      {
        question: `How would you approach learning ${request.focusAreas?.[0] || 'new technologies'} for ${request.careerPath}?`,
        type: 'text' as const,
        skill: request.focusAreas?.[0] || 'General',
        difficulty: 'intermediate' as const,
        reasoning: 'Mock question for development'
      },
      {
        question: `Rate your confidence in ${request.focusAreas?.[1] || 'problem-solving'} on a scale of 1-5`,
        type: 'scale' as const,
        skill: request.focusAreas?.[1] || 'Problem Solving',
        difficulty: 'intermediate' as const,
        reasoning: 'Mock question for development'
      },
      {
        question: `Which of the following best describes your experience with ${request.careerPath}?`,
        type: 'multiple-choice' as const,
        options: ['No experience', 'Some knowledge', 'Practical experience', 'Expert level'],
        skill: 'Experience Level',
        difficulty: 'beginner' as const,
        reasoning: 'Assessing your current experience level'
      },
      {
        question: `Describe a challenging project or problem you've solved recently. How did you approach it?`,
        type: 'text' as const,
        skill: 'Problem Solving',
        difficulty: 'intermediate' as const,
        reasoning: 'Understanding your problem-solving methodology'
      }
    ];

    return mockQuestions[Math.floor(Math.random() * mockQuestions.length)];
  }

  private getMockAnalysis(careerPath: string, responses: Record<string, any>): AIAnalysisResponse {
    const responseCount = Object.keys(responses).length;
    return {
      overallAssessment: `Based on your responses, you show ${responseCount > 2 ? 'strong' : 'developing'} potential for a ${careerPath} career.`,
      skillGaps: [
        {
          skill: 'Core Technical Skills',
          currentLevel: 3,
          targetLevel: 4,
          gap: 1,
          priority: 'high',
          recommendations: ['Complete foundational courses', 'Build practical projects']
        },
        {
          skill: 'Industry Knowledge',
          currentLevel: 2,
          targetLevel: 4,
          gap: 2,
          priority: 'medium',
          recommendations: ['Read industry publications', 'Join professional communities']
        }
      ],
      learningPath: [
        {
          phase: 'Foundation Phase',
          duration: '4-6 weeks',
          skills: ['Basic concepts', 'Fundamental tools'],
          resources: [`Introduction to ${careerPath}`, 'Online resources']
        },
        {
          phase: 'Development Phase',
          duration: '8-10 weeks',
          skills: ['Practical application', 'Project work'],
          resources: [`Advanced ${careerPath} skills`, 'Project-based learning']
        }
      ],
      nextSteps: [
        'Enroll in recommended foundation course',
        'Set up daily learning schedule',
        'Join relevant communities',
        'Start building projects'
      ],
      confidenceScore: Math.min(responseCount * 15 + 40, 85)
    };
  }

  private getMockDetailedAnalysis(
    careerPath: string, 
    responses: Record<string, any>, 
    questions: AIQuestionResponse[]
  ): DetailedAssessmentAnalysis {
    const responseCount = Object.keys(responses).length;
    const avgResponseQuality = responseCount > 0 ? 3.5 : 2.5; // Mock scoring
    
    return {
      overallAssessment: `Based on your ${responseCount} responses, you demonstrate ${avgResponseQuality > 3 ? 'strong' : 'developing'} potential for ${careerPath}. Your answers indicate ${avgResponseQuality > 3 ? 'good foundational knowledge' : 'room for growth in key areas'}.`,
      currentLevel: avgResponseQuality > 3.5 ? 'Intermediate' : 'Beginner',
      targetLevel: 'Advanced',
      readinessScore: Math.round(avgResponseQuality * 20),
      strengths: [
        'Demonstrated interest in the field',
        'Willingness to learn and improve',
        'Basic understanding of core concepts'
      ],
      weaknesses: [
        'Limited practical experience',
        'Need to strengthen technical skills',
        'Require more hands-on practice'
      ],
      skillGaps: [
        {
          skill: 'Core Technical Skills',
          currentLevel: 3,
          targetLevel: 4,
          gap: 1,
          priority: 'high',
          recommendations: ['Complete foundational courses', 'Build practical projects', 'Practice regularly'],
          estimatedTimeToImprove: '2-3 months'
        },
        {
          skill: 'Industry Knowledge',
          currentLevel: 2,
          targetLevel: 4,
          gap: 2,
          priority: 'medium',
          recommendations: ['Read industry publications', 'Follow thought leaders', 'Join professional communities'],
          estimatedTimeToImprove: '3-4 months'
        }
      ],
      learningPath: [
        {
          phase: 'Foundation Phase',
          duration: '4-6 weeks',
          skills: ['Basic concepts', 'Fundamental tools'],
          resources: [
            {
              title: `Introduction to ${careerPath}`,
              type: 'course',
              provider: 'Online Learning Platform',
              url: '#',
              priority: 'high'
            }
          ],
          milestones: ['Complete basic concepts', 'Understand terminology', 'Set up development environment']
        },
        {
          phase: 'Development Phase',
          duration: '8-10 weeks',
          skills: ['Practical application', 'Project work'],
          resources: [
            {
              title: `Practical ${careerPath} Projects`,
              type: 'tutorial',
              provider: 'Tutorial Platform',
              url: '#',
              priority: 'high'
            }
          ],
          milestones: ['Complete first project', 'Build portfolio', 'Apply learned concepts']
        }
      ],
      courseRecommendations: [
        {
          title: `Complete ${careerPath} Bootcamp`,
          provider: 'Online Education Platform',
          duration: '12 weeks',
          difficulty: 'intermediate',
          skills: ['Core skills', 'Practical application'],
          priority: 'high',
          reasoning: 'Comprehensive coverage of essential skills with hands-on projects'
        },
        {
          title: `Advanced ${careerPath} Specialization`,
          provider: 'University Platform',
          duration: '6 months',
          difficulty: 'advanced',
          skills: ['Advanced concepts', 'Specialization'],
          priority: 'medium',
          reasoning: 'Deep dive into advanced topics for career progression'
        }
      ],
      nextSteps: [
        'Enroll in recommended foundation course',
        'Set up daily learning schedule (1-2 hours)',
        'Join relevant online communities',
        'Start building your first project',
        'Create a learning progress tracker'
      ],
      timelineToReadiness: responseCount > 3 ? '6-9 months' : '9-12 months',
      marketInsights: {
        demandLevel: 'High',
        competitionLevel: 'Medium',
        salaryExpectation: '$50,000 - $80,000',
        jobOpportunities: ['Entry-level positions', 'Internship programs', 'Junior roles']
      },
      confidenceScore: Math.min(responseCount * 15 + 40, 85)
    };
  }
}

export const geminiService = new GeminiService();