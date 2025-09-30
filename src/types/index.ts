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
  completionTime?: number; // in minutes
  strengths?: string[];
  improvementAreas?: string[];
  nextSteps?: string[];
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number; // 0-100
  skills: string[];
  resources: string[];
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  careerPath: string;
  duration: string; // e.g., "3 months"
  phases: StudyPhase[];
  totalHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface StudyPhase {
  id: string;
  title: string;
  description: string;
  duration: string;
  skills: string[];
  resources: LearningResource[];
  milestones: string[];
  completed: boolean;
}

export interface CareerInsight {
  careerPath: string;
  marketTrend: 'growing' | 'stable' | 'declining';
  salaryTrend: 'increasing' | 'stable' | 'decreasing';
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  competitionLevel: 'low' | 'medium' | 'high' | 'very-high';
  keySkills: string[];
  emergingSkills: string[];
  industryGrowth: string;
  jobOpenings: number;
  averageApplications: number;
}