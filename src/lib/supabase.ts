import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Provide fallback values for development
const defaultUrl = 'https://your-project.supabase.co';
const defaultKey = 'your-anon-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback values for development.');
}

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey
);
// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          career_path: string;
          assessment_type: 'standard' | 'ai';
          responses: any;
          results: any;
          overall_score: number;
          readiness_level: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_path: string;
          assessment_type: 'standard' | 'ai';
          responses: any;
          results: any;
          overall_score: number;
          readiness_level: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_path?: string;
          assessment_type?: 'standard' | 'ai';
          responses?: any;
          results?: any;
          overall_score?: number;
          readiness_level?: string;
          completed_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          career_path: string;
          skill_levels: any;
          learning_goals: string[];
          completed_resources: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          career_path: string;
          skill_levels: any;
          learning_goals?: string[];
          completed_resources?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          career_path?: string;
          skill_levels?: any;
          learning_goals?: string[];
          completed_resources?: string[];
          updated_at?: string;
        };
      };
    };
  };
}