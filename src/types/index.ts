export interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  averageSalary: string;
  growthRate: string;
  icon: string;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  skill: string;
}

export interface Assessment {
  id: string;
  careerPath: string;
  questions: Question[];
  responses: Record<string, any>;
  completed: boolean;
  score: number;
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'high' | 'medium' | 'low';
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'video' | 'tutorial' | 'certification';
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  url: string;
  skills: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  selectedCareer?: CareerPath;
  assessments: Assessment[];
  skillLevels: Record<string, number>;
  learningGoals: string[];
}

export interface Career {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  averageSalary: string;
  growthRate: string;
  icon: string;
  timeToComplete?: string;
  demandLevel?: string;
  difficulty?: string;
}

export interface AssessmentResult {
  overallScore: number;
  skillGaps: SkillGap[];
  recommendations: string[];
  readinessLevel: 'Low' | 'Medium' | 'High';
}