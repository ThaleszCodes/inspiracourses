// FIX: Moved triple-slash directive to the top of the file to ensure Vite client types are loaded correctly.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// !! IMPORTANTE !!
// O código abaixo usa variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
// para o deploy em produção (ex: Vercel). Para que o app funcione em desenvolvimento,
// adicionamos as chaves diretamente como "fallback".
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gkatfhjbmattmrlkdqsz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYXRmaGpibWF0dG1ybGtkcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjA5NDUsImV4cCI6MjA3ODM5Njk0NX0.mVuwHgPdjZbc6tpqLPt9It15PaiLv82IkzxNnKyiS08';


if (!supabaseUrl || !supabaseAnonKey) {
    // This will likely only be true if the fallback keys are removed and env vars are not set.
    throw new Error("Supabase client is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables, or provide fallback keys.");
}

type CourseRow = {
  id: number;
  created_at: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  checkout_url: string;
  benefits: string;
};

type CategoryRow = {
  id: number;
  created_at: string;
  name: string;
};

// FIX: Define Insert and Update types explicitly to resolve Supabase type inference issues.
// This ensures that the Supabase client correctly types table operations and avoids 'never' type errors.
type CategoryInsert = Omit<CategoryRow, 'id' | 'created_at'>;
type CategoryUpdate = Partial<CategoryInsert>;

type CourseInsert = Omit<CourseRow, 'id' | 'created_at'>;
type CourseUpdate = Partial<CourseInsert>;


interface Database {
  public: {
    Tables: {
      courses: {
        Row: CourseRow;
        Insert: CourseInsert;
        Update: CourseUpdate;
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
    };
  };
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
