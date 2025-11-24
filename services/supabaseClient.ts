/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// !! IMPORTANTE !!
// O código abaixo usa variáveis de ambiente (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)
// para o deploy em produção (ex: Vercel). Para que o app funcione em desenvolvimento,
// adicionamos as chaves diretamente como "fallback".
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gzprziycnrcdgffxpltx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cHJ6aXljbnJjZGdmZnhwbHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMDk2NjcsImV4cCI6MjA3OTU4NTY2N30.P7tyullatXba8Ty5MZCgfLOwUsfbprI0-_BWT3yyo24';


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
  original_price: number | null;
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
    // FIX: Add empty Views and Functions for stricter type safety with Supabase generics.
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
