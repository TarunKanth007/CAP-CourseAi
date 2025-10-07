import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey !== 'your-anon-key-here' &&
  supabaseAnonKey.length > 20
);

if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase not configured properly. Please update your .env file with valid credentials.');
  console.log('📝 Instructions:');
  console.log('1. Go to https://supabase.com and create a project');
  console.log('2. Go to Settings -> API in your Supabase dashboard');
  console.log('3. Copy your Project URL and anon public key');
  console.log('4. Update .env file with your credentials');
  console.log('5. Run the database migrations in your Supabase dashboard');
}

// Create Supabase client only if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock client for development
export const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => {
      // Call callback immediately with no session
      setTimeout(() => callback('INITIAL_SESSION', null), 0);
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    signInWithPassword: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured. Please set up your Supabase project and update the .env file.' }
    }),
    signUp: () => Promise.resolve({ 
      data: { user: null, session: null }, 
      error: { message: 'Supabase not configured. Please set up your Supabase project and update the .env file.' }
    }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
    eq: function() { return this; },
    order: function() { return this; }
  })
};

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