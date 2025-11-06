import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AssessmentResult, SkillGap } from '../types';

export interface SaveAssessmentData {
  userId: string;
  careerPath: string;
  assessmentType: 'standard' | 'ai';
  responses: Record<string, any>;
  results: AssessmentResult;
  aiAnalysis?: any;
  questions?: any[];
}

export const assessmentService = {
  // Save assessment results to Supabase
  async saveAssessment(data: SaveAssessmentData) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured - assessment data not saved');
      return { success: true, demo: true, assessmentId: 'demo-id' };
    }

    try {
      const { data: result, error } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: data.userId,
            career_path: data.careerPath,
            assessment_type: data.assessmentType,
            responses: data.responses,
            results: data.results,
            ai_analysis: data.aiAnalysis || null,
            questions: data.questions || null,
            ai_analysis: data.aiAnalysis || null,
            questions: data.questions || null,
            overall_score: data.results.overallScore,
            readiness_level: data.results.readinessLevel,
            completed_at: new Date().toISOString(),
        .select('id')
        .single();
          },
        ]);

      if (error) throw error;
      return { success: true, assessmentId: result?.id };
    } catch (error) {
      console.error('Error saving assessment:', error);
      return { success: false, error };
    }
  },

  // Save skill assessments
  async saveSkillAssessments(userId: string, assessmentId: string, skillGaps: any[]) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, demo: true };
    }

    try {
      const skillAssessments = skillGaps.map(gap => ({
        user_id: userId,
        assessment_id: assessmentId,
        skill_name: gap.skill,
        current_level: gap.currentLevel,
        target_level: gap.targetLevel,
        gap_level: gap.gap,
        priority: gap.priority,
        confidence_score: gap.confidenceScore || null,
        improvement_suggestions: gap.recommendations || [],
        estimated_time_to_improve: gap.estimatedTimeToImprove || null
      }));

      const { error } = await supabase
        .from('skill_assessments')
        .insert(skillAssessments);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving skill assessments:', error);
      return { success: false, error };
    }
  },

  // Save career recommendations
  async saveCareerRecommendations(userId: string, assessmentId: string, recommendations: any[]) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, demo: true };
    }

    try {
      const careerRecs = recommendations.map(rec => ({
        user_id: userId,
        assessment_id: assessmentId,
        career_path: rec.careerPath || '',
        recommendation_type: rec.type || 'course',
        title: rec.title,
        description: rec.description || null,
        provider: rec.provider || null,
        url: rec.url || null,
        priority: rec.priority || 'medium',
        estimated_duration: rec.duration || null,
        cost_estimate: rec.cost || null,
        ai_reasoning: rec.reasoning || null,
        skills_addressed: rec.skills || []
      }));

      const { error } = await supabase
        .from('career_recommendations')
        .insert(careerRecs);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving career recommendations:', error);
      return { success: false, error };
    }
  },
  // Get user's assessment history
  async getUserAssessments(userId: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching assessments:', error);
      return { success: false, error };
    }
  },

  // Get user achievements
  async getUserAchievements(userId: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return { success: false, error };
    }
  },

  // Get learning resources
  async getLearningResources(careerPath?: string, skills?: string[]) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      let query = supabase
        .from('learning_resources')
        .select('*');

      if (careerPath) {
        query = query.contains('career_paths', [careerPath]);
      }

      if (skills && skills.length > 0) {
        query = query.overlaps('skills', skills);
      }

      const { data, error } = await query
        .order('rating', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      return { success: false, error };
    }
  },

  // Get skill assessments for user
  async getUserSkillAssessments(userId: string, assessmentId?: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      let query = supabase
        .from('skill_assessments')
        .select('*')
        .eq('user_id', userId);

      if (assessmentId) {
        query = query.eq('assessment_id', assessmentId);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching skill assessments:', error);
      return { success: false, error };
    }
  },

  // Get career recommendations for user
  async getUserRecommendations(userId: string, assessmentId?: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      let query = supabase
        .from('career_recommendations')
        .select('*')
        .eq('user_id', userId);

      if (assessmentId) {
        query = query.eq('assessment_id', assessmentId);
      }

      const { data, error } = await query
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { success: false, error };
    }
  },
  // Update user progress
  async updateUserProgress(userId: string, careerPath: string, skillLevels: Record<string, number>) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, demo: true };
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert([
          {
            user_id: userId,
            career_path: careerPath,
            skill_levels: skillLevels,
            updated_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error };
    }
  },

  // Get user progress
  async getUserProgress(userId: string, careerPath?: string) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (careerPath) {
        query = query.eq('career_path', careerPath);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { success: false, error };
    }
  },

  // Get assessment analytics (for admin/research purposes)
  async getAssessmentAnalytics() {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, data: [] };
    }

    try {
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          career_path,
          assessment_type,
          overall_score,
          readiness_level,
          created_at
        `);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error };
    }
  },
};