import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { geminiService } from '../lib/gemini';
import { AssessmentResult, Career } from '../types';

export interface PersonalLearningPlan {
  userProfile: {
    name: string;
    email: string;
    assessmentDate: string;
    careerPath: string;
  };
  currentLevel: {
    overallScore: number;
    readinessLevel: string;
    strengths: string[];
    weaknesses: string[];
  };
  skillAnalysis: {
    skillGaps: Array<{
      skill: string;
      currentLevel: number;
      targetLevel: number;
      gap: number;
      priority: 'high' | 'medium' | 'low';
      estimatedTime: string;
    }>;
    prioritySkills: string[];
    strongSkills: string[];
  };
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
        url?: string;
      }>;
      milestones: string[];
    }>;
  };
  recommendations: {
    courses: Array<{
      title: string;
      provider: string;
      duration: string;
      difficulty: string;
      skills: string[];
      priority: string;
      reasoning: string;
      estimatedCost?: string;
    }>;
    nextSteps: string[];
    studySchedule: {
      dailyHours: string;
      weeklyGoals: string[];
      monthlyMilestones: string[];
    };
  };
  marketInsights: {
    salaryExpectation: string;
    jobOpportunities: string[];
    competitionLevel: string;
    demandTrend: string;
  };
  timeline: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  aiInsights: string;
}

export const learningPlanService = {
  async generatePersonalLearningPlan(
    userId: string,
    career: Career,
    assessmentResult: AssessmentResult,
    responses: Record<string, any>
  ): Promise<PersonalLearningPlan | null> {
    try {
      // Get user data
      const userData = await this.getUserData(userId);
      
      // Get assessment history for trend analysis
      const assessmentHistory = await this.getAssessmentHistory(userId);
      
      // Get skill assessments
      const skillAssessments = await this.getSkillAssessments(userId);
      
      // Get recommendations
      const recommendations = await this.getRecommendations(userId);
      
      // Generate AI-powered learning plan
      const aiLearningPlan = await geminiService.generatePersonalLearningPlan({
        career: career.title,
        currentLevel: assessmentResult.overallScore,
        skillGaps: assessmentResult.skillGaps,
        responses,
        assessmentHistory,
        userGoals: userData?.learning_goals || []
      });

      // Compile comprehensive learning plan
      const learningPlan: PersonalLearningPlan = {
        userProfile: {
          name: userData?.full_name || 'User',
          email: userData?.email || '',
          assessmentDate: new Date().toLocaleDateString(),
          careerPath: career.title
        },
        currentLevel: {
          overallScore: assessmentResult.overallScore,
          readinessLevel: assessmentResult.readinessLevel,
          strengths: assessmentResult.strengths || [],
          weaknesses: assessmentResult.improvementAreas || []
        },
        skillAnalysis: {
          skillGaps: assessmentResult.skillGaps.map(gap => ({
            skill: gap.skill,
            currentLevel: gap.currentLevel,
            targetLevel: gap.requiredLevel,
            gap: gap.gap,
            priority: gap.priority,
            estimatedTime: this.estimateTimeToImprove(gap.gap)
          })),
          prioritySkills: assessmentResult.skillGaps
            .filter(gap => gap.priority === 'high')
            .map(gap => gap.skill),
          strongSkills: assessmentResult.skillGaps
            .filter(gap => gap.gap === 0)
            .map(gap => gap.skill)
        },
        learningPath: aiLearningPlan?.learningPath || this.generateDefaultLearningPath(career, assessmentResult),
        recommendations: {
          courses: recommendations.map(rec => ({
            title: rec.title,
            provider: rec.provider || 'Online Platform',
            duration: rec.estimated_duration || '4-6 weeks',
            difficulty: 'Intermediate',
            skills: rec.skills_addressed || [],
            priority: rec.priority || 'medium',
            reasoning: rec.ai_reasoning || 'Recommended based on your skill gaps',
            estimatedCost: this.estimateCost(rec.recommendation_type)
          })),
          nextSteps: assessmentResult.nextSteps || [],
          studySchedule: this.generateStudySchedule(assessmentResult.skillGaps.length)
        },
        marketInsights: {
          salaryExpectation: career.averageSalary,
          jobOpportunities: this.getJobOpportunities(career.title),
          competitionLevel: 'Medium',
          demandTrend: career.growthRate
        },
        timeline: this.generateTimeline(assessmentResult.skillGaps),
        aiInsights: aiLearningPlan?.insights || this.generateDefaultInsights(career, assessmentResult)
      };

      return learningPlan;
    } catch (error) {
      console.error('Error generating learning plan:', error);
      return null;
    }
  },

  async getUserData(userId: string) {
    if (!isSupabaseConfigured || !supabase) return null;
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return data;
  },

  async getAssessmentHistory(userId: string) {
    if (!isSupabaseConfigured || !supabase) return [];
    
    const { data } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  async getSkillAssessments(userId: string) {
    if (!isSupabaseConfigured || !supabase) return [];
    
    const { data } = await supabase
      .from('skill_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  },

  async getRecommendations(userId: string) {
    if (!isSupabaseConfigured || !supabase) return [];
    
    const { data } = await supabase
      .from('career_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('priority', { ascending: true });
    
    return data || [];
  },

  estimateTimeToImprove(gap: number): string {
    const timeMap: Record<number, string> = {
      0: 'Already proficient',
      1: '2-4 weeks',
      2: '1-2 months',
      3: '2-3 months',
      4: '3-4 months',
      5: '4-6 months'
    };
    return timeMap[gap] || '6+ months';
  },

  estimateCost(type: string): string {
    const costMap: Record<string, string> = {
      'course': '$50-200',
      'certification': '$100-500',
      'book': '$20-50',
      'tutorial': 'Free-$50'
    };
    return costMap[type] || '$50-150';
  },

  generateStudySchedule(skillCount: number) {
    const dailyHours = skillCount > 5 ? '2-3 hours' : '1-2 hours';
    return {
      dailyHours,
      weeklyGoals: [
        'Complete 1-2 learning modules',
        'Practice hands-on exercises',
        'Review and reinforce concepts',
        'Work on practical projects'
      ],
      monthlyMilestones: [
        'Complete foundation phase',
        'Build first project',
        'Master core concepts',
        'Prepare for next phase'
      ]
    };
  },

  getJobOpportunities(careerTitle: string): string[] {
    const opportunityMap: Record<string, string[]> = {
      'Software Engineer': ['Junior Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer'],
      'Data Scientist': ['Data Analyst', 'ML Engineer', 'Research Scientist', 'Business Intelligence Analyst'],
      'Product Manager': ['Associate PM', 'Product Owner', 'Strategy Analyst', 'Business Analyst'],
      'UX/UI Designer': ['UI Designer', 'UX Researcher', 'Product Designer', 'Visual Designer'],
      'Digital Marketing Specialist': ['Marketing Coordinator', 'SEO Specialist', 'Content Marketer', 'Social Media Manager'],
      'Cybersecurity Analyst': ['Security Analyst', 'SOC Analyst', 'Penetration Tester', 'Security Consultant']
    };
    return opportunityMap[careerTitle] || ['Entry Level Positions', 'Junior Roles', 'Internships'];
  },

  generateTimeline(skillGaps: any[]) {
    const highPriorityCount = skillGaps.filter(gap => gap.priority === 'high').length;
    const mediumPriorityCount = skillGaps.filter(gap => gap.priority === 'medium').length;
    
    return {
      shortTerm: [
        'Complete skill assessment',
        'Start foundation courses',
        'Set up learning environment',
        'Join relevant communities'
      ],
      mediumTerm: [
        'Complete core skill development',
        'Build portfolio projects',
        'Gain practical experience',
        'Network with professionals'
      ],
      longTerm: [
        'Achieve target skill levels',
        'Apply for relevant positions',
        'Continue advanced learning',
        'Mentor others in the field'
      ]
    };
  },

  generateDefaultLearningPath(career: Career, result: AssessmentResult) {
    return {
      totalDuration: '6-9 months',
      phases: [
        {
          phase: 'Foundation Phase',
          duration: '6-8 weeks',
          skills: career.skills.slice(0, 3),
          resources: [
            {
              title: `Introduction to ${career.title}`,
              type: 'course',
              provider: 'Online Learning Platform',
              duration: '4-6 weeks',
              priority: 'high'
            }
          ],
          milestones: ['Understand basic concepts', 'Complete introductory projects']
        },
        {
          phase: 'Development Phase',
          duration: '8-12 weeks',
          skills: career.skills.slice(3, 6),
          resources: [
            {
              title: `Advanced ${career.title} Skills`,
              type: 'course',
              provider: 'Professional Platform',
              duration: '8-10 weeks',
              priority: 'high'
            }
          ],
          milestones: ['Build complex projects', 'Master intermediate concepts']
        },
        {
          phase: 'Specialization Phase',
          duration: '6-8 weeks',
          skills: career.skills.slice(6),
          resources: [
            {
              title: `${career.title} Specialization`,
              type: 'certification',
              provider: 'Industry Leader',
              duration: '6-8 weeks',
              priority: 'medium'
            }
          ],
          milestones: ['Achieve specialization', 'Prepare for job market']
        }
      ]
    };
  },

  generateDefaultInsights(career: Career, result: AssessmentResult): string {
    return `Based on your assessment for ${career.title}, you show ${result.overallScore >= 70 ? 'strong' : 'developing'} potential in this field. Your current readiness level is ${result.readinessLevel}, indicating ${result.readinessLevel === 'High' ? 'you are well-prepared to advance' : 'there are key areas for improvement'}. Focus on strengthening your weaker skills while leveraging your existing strengths to accelerate your learning journey.`;
  },

  async downloadLearningPlan(learningPlan: PersonalLearningPlan): Promise<void> {
    try {
      // Generate HTML content for the learning plan
      const htmlContent = this.generateLearningPlanHTML(learningPlan);
      
      // Create and download the file
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${learningPlan.userProfile.name.replace(/\s+/g, '_')}_Learning_Plan.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading learning plan:', error);
    }
  },

  generateLearningPlanHTML(plan: PersonalLearningPlan): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Personal Learning Plan - ${plan.userProfile.name}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px; }
        .section { background: #f8f9fa; padding: 25px; margin-bottom: 25px; border-radius: 10px; border-left: 5px solid #667eea; }
        .section h2 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .skill-gap { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #28a745; }
        .skill-gap.high { border-left-color: #dc3545; }
        .skill-gap.medium { border-left-color: #ffc107; }
        .phase { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .resource { background: #e9ecef; padding: 10px; margin: 8px 0; border-radius: 5px; }
        .timeline { display: flex; justify-content: space-between; flex-wrap: wrap; }
        .timeline-item { flex: 1; min-width: 250px; margin: 10px; padding: 15px; background: white; border-radius: 8px; }
        .score { font-size: 2em; font-weight: bold; color: #28a745; }
        .priority-high { color: #dc3545; font-weight: bold; }
        .priority-medium { color: #ffc107; font-weight: bold; }
        .priority-low { color: #28a745; font-weight: bold; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        .ai-insights { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; font-style: italic; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Personal Learning Plan</h1>
        <h2>${plan.userProfile.name}</h2>
        <p>Career Path: ${plan.userProfile.careerPath}</p>
        <p>Assessment Date: ${plan.userProfile.assessmentDate}</p>
    </div>

    <div class="section">
        <h2>Current Level Assessment</h2>
        <div style="display: flex; align-items: center; gap: 20px;">
            <div class="score">${plan.currentLevel.overallScore}%</div>
            <div>
                <p><strong>Readiness Level:</strong> ${plan.currentLevel.readinessLevel}</p>
                <p><strong>Strengths:</strong> ${plan.currentLevel.strengths.join(', ')}</p>
                <p><strong>Areas for Improvement:</strong> ${plan.currentLevel.weaknesses.join(', ')}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Skill Gap Analysis</h2>
        ${plan.skillAnalysis.skillGaps.map(gap => `
            <div class="skill-gap ${gap.priority}">
                <h4>${gap.skill} <span class="priority-${gap.priority}">(${gap.priority.toUpperCase()} Priority)</span></h4>
                <p>Current Level: ${gap.currentLevel}/5 → Target Level: ${gap.targetLevel}/5</p>
                <p>Gap: ${gap.gap} levels | Estimated Time: ${gap.estimatedTime}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Learning Path</h2>
        <p><strong>Total Duration:</strong> ${plan.learningPath.totalDuration}</p>
        ${plan.learningPath.phases.map(phase => `
            <div class="phase">
                <h3>${phase.phase} (${phase.duration})</h3>
                <p><strong>Skills to Master:</strong> ${phase.skills.join(', ')}</p>
                <h4>Recommended Resources:</h4>
                ${phase.resources.map(resource => `
                    <div class="resource">
                        <strong>${resource.title}</strong> - ${resource.provider}<br>
                        Duration: ${resource.duration} | Priority: ${resource.priority}
                    </div>
                `).join('')}
                <h4>Milestones:</h4>
                <ul>
                    ${phase.milestones.map(milestone => `<li>${milestone}</li>`).join('')}
                </ul>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Course Recommendations</h2>
        ${plan.recommendations.courses.map(course => `
            <div class="resource">
                <h4>${course.title}</h4>
                <p><strong>Provider:</strong> ${course.provider} | <strong>Duration:</strong> ${course.duration}</p>
                <p><strong>Skills:</strong> ${course.skills.join(', ')}</p>
                <p><strong>Priority:</strong> <span class="priority-${course.priority}">${course.priority.toUpperCase()}</span></p>
                <p><strong>Reasoning:</strong> ${course.reasoning}</p>
                <p><strong>Estimated Cost:</strong> ${course.estimatedCost || 'Varies'}</p>
            </div>
        `).join('')}
    </div>

    <div class="section">
        <h2>Study Schedule</h2>
        <p><strong>Recommended Daily Study Time:</strong> ${plan.recommendations.studySchedule.dailyHours}</p>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <h4>Weekly Goals:</h4>
                <ul>
                    ${plan.recommendations.studySchedule.weeklyGoals.map(goal => `<li>${goal}</li>`).join('')}
                </ul>
            </div>
            <div style="flex: 1; min-width: 200px;">
                <h4>Monthly Milestones:</h4>
                <ul>
                    ${plan.recommendations.studySchedule.monthlyMilestones.map(milestone => `<li>${milestone}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Timeline & Next Steps</h2>
        <div class="timeline">
            <div class="timeline-item">
                <h4>Short Term (1-3 months)</h4>
                <ul>
                    ${plan.timeline.shortTerm.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="timeline-item">
                <h4>Medium Term (3-6 months)</h4>
                <ul>
                    ${plan.timeline.mediumTerm.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="timeline-item">
                <h4>Long Term (6+ months)</h4>
                <ul>
                    ${plan.timeline.longTerm.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Market Insights</h2>
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <p><strong>Expected Salary:</strong> ${plan.marketInsights.salaryExpectation}</p>
                <p><strong>Market Demand:</strong> ${plan.marketInsights.demandTrend}</p>
                <p><strong>Competition Level:</strong> ${plan.marketInsights.competitionLevel}</p>
            </div>
            <div style="flex: 1; min-width: 200px;">
                <h4>Job Opportunities:</h4>
                <ul>
                    ${plan.marketInsights.jobOpportunities.map(job => `<li>${job}</li>`).join('')}
                </ul>
            </div>
        </div>
    </div>

    <div class="ai-insights">
        <h2>AI Insights & Recommendations</h2>
        <p>${plan.aiInsights}</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
        <p><strong>Generated by AI Career Path Predictor</strong></p>
        <p>This personalized learning plan is based on your assessment results and AI analysis.</p>
        <p>Remember to regularly review and update your progress!</p>
    </div>
</body>
</html>
    `;
  }
};