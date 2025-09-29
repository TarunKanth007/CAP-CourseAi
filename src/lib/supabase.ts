import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  !supabaseAnonKey.includes('fake-key');

if (!isConfigured) {
  console.error('⚠️ Supabase not configured properly. Please update your .env file with valid credentials.');
  console.log('📝 Instructions:');
  console.log('1. Go to https://supabase.com and create a project');
  console.log('2. Go to Settings -> API in your Supabase dashboard');
  console.log('3. Copy your Project URL and anon public key');
  console.log('4. Update .env file with your credentials');
}

// Use mock client for development when not configured
export const supabase = createClient(
  supabaseUrl || 'https://mock.supabase.co',
  supabaseAnonKey || 'mock-key'
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