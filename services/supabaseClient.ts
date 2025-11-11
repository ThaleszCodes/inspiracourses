// Fix for line 6, 7: Add triple-slash directive to include Vite client types for `import.meta.env`.
/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// !! IMPORTANTE !!
// As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
// devem ser configuradas no painel do seu provedor de hospedagem (ex: Vercel).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase client is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.");
    // In a real app, you might want to throw an error here or render an error state.
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
