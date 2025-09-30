import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AssessmentResult, SkillGap } from '../types';

export interface SaveAssessmentData {
  userId: string;
  careerPath: string;
  assessmentType: 'standard' | 'ai';
  responses: Record<string, any>;
  results: AssessmentResult;
}

export const assessmentService = {
  // Save assessment results to Supabase
  async saveAssessment(data: SaveAssessmentData) {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured - assessment data not saved');
      return { success: true, demo: true };
    }

    try {
      const { error } = await supabase
        .from('assessments')
        .insert([
          {
            user_id: data.userId,
            career_path: data.careerPath,
            assessment_type: data.assessmentType,
            responses: data.responses,
            results: data.results,
            overall_score: data.results.overallScore,
            readiness_level: data.results.readinessLevel,
            completed_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error saving assessment:', error);
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