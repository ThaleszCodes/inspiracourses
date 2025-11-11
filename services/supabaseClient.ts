import { createClient } from '@supabase/supabase-js';

// !! IMPORTANTE !!
// Substitua com a URL e a Chave Anônima (Anon Key) do seu projeto Supabase.
// Você pode encontrar essas informações nas configurações de API do seu projeto.
// FIX: Add explicit string types to widen the types from literals and allow comparison.
const supabaseUrl: string = 'https://gkatfhjbmattmrlkdqsz.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrYXRmaGpibWF0dG1ybGtkcXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjA5NDUsImV4cCI6MjA3ODM5Njk0NX0.mVuwHgPdjZbc6tpqLPt9It15PaiLv82IkzxNnKyiS08';

if (supabaseUrl === 'https://SEU_PROJETO_URL.supabase.co' || supabaseAnonKey === 'SUA_CHAVE_ANON') {
    console.warn("Supabase client is not configured. Please add your project URL and anon key in services/supabaseClient.ts");
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

interface Database {
  public: {
    Tables: {
      courses: {
        Row: CourseRow;
        Insert: Omit<CourseRow, 'id' | 'created_at'>;
        Update: Partial<CourseRow>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, 'id' | 'created_at'>;
        Update: Partial<CategoryRow>;
      };
    };
  };
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
