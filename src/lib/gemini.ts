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
    responses: Record<string, any>
  ): Promise<AIAnalysisResponse | null> {
    if (!isGeminiConfigured || !this.model) {
      console.warn('Gemini not configured, returning mock analysis');
      return this.getMockAnalysis(careerPath, responses);
    }

    try {
      const prompt = this.buildAnalysisPrompt(careerPath, responses);
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

  private buildAnalysisPrompt(careerPath: string, responses: Record<string, any>): string {
    return `
You are an AI career counselor analyzing assessment responses for a ${careerPath} position.

User Responses:
${JSON.stringify(responses, null, 2)}

Provide a comprehensive analysis in JSON format:
{
  "overallAssessment": "Overall assessment summary",
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
3. User's demonstrated knowledge
4. Skill progression pathways
5. Learning efficiency

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
    return {
      overallAssessment: `Based on your responses, you show good potential for ${careerPath}. Focus on strengthening key technical skills.`,
      skillGaps: [
        {
          skill: 'Technical Skills',
          currentLevel: 3,
          targetLevel: 4,
          gap: 1,
          priority: 'high',
          recommendations: ['Take advanced courses', 'Build practical projects']
        }
      ],
      learningPath: [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          skills: ['Core concepts', 'Basic tools'],
          resources: ['Online courses', 'Documentation']
        }
      ],
      nextSteps: [
        'Complete foundational learning',
        'Build a portfolio project',
        'Practice with real scenarios'
      ],
      confidenceScore: 78
    };
  }
}

export const geminiService = new GeminiService();