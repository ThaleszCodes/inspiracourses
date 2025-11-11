import { Course, Category, CourseWithCategory } from '../types';
import { supabase } from './supabaseClient';

// --- Mappers para converter snake_case (DB) para camelCase (JS) e vice-versa ---
const courseFromSupabase = (dbCourse: any): CourseWithCategory => ({
    id: dbCourse.id.toString(),
    name: dbCourse.name,
    description: dbCourse.description,
    price: dbCourse.price,
    imageUrl: dbCourse.image_url,
    categoryId: dbCourse.category_id.toString(),
    checkoutUrl: dbCourse.checkout_url,
    benefits: dbCourse.benefits,
    category: categoryFromSupabase(dbCourse.categories)
});

// FIX: Change parameter type from Partial<Course> to Omit<Course, 'id'> to ensure type safety.
const courseToSupabase = (appCourse: Omit<Course, 'id'>) => ({
    name: appCourse.name,
    description: appCourse.description,
    price: appCourse.price,
    image_url: appCourse.imageUrl,
    category_id: Number(appCourse.categoryId),
    checkout_url: appCourse.checkoutUrl,
    benefits: appCourse.benefits
});

const categoryFromSupabase = (dbCategory: any): Category => ({
    id: dbCategory.id.toString(),
    name: dbCategory.name,
});


// --- CATEGORY API ---
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw new Error(error.message);
  return data.map(categoryFromSupabase);
};

export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  const { data, error } = await supabase.from('categories').select('*').eq('id', Number(id)).single();
  if (error) {
    console.error(error);
    return undefined;
  };
  return data ? categoryFromSupabase(data) : undefined;
}

export const addCategory = async (name: string): Promise<Category> => {
  const { data, error } = await supabase.from('categories').insert({ name }).select().single();
  if (error) throw new Error(error.message);
  return categoryFromSupabase(data);
};

export const updateCategory = async (id: string, name: string): Promise<Category | null> => {
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', Number(id)).select().single();
  if (error) throw new Error(error.message);
  return categoryFromSupabase(data);
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  // Check if any course is using this category
  const { count, error: countError } = await supabase.from('courses').select('id', { count: 'exact' }).eq('category_id', Number(id));

  if (countError) throw new Error(countError.message);
  if (count !== null && count > 0) {
    alert('Não é possível excluir uma categoria que está sendo usada por um curso.');
    return false;
  }

  const { error } = await supabase.from('categories').delete().eq('id', Number(id));
  if (error) throw new Error(error.message);
  return true;
};

// --- COURSE API ---
export const getCourses = async (): Promise<Course[]> => {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) throw new Error(error.message);
  // This version won't have the category object, which is fine if not needed.
  return data.map(c => ({...courseFromSupabase(c), category: undefined } as unknown as Course));
};

export const getCoursesWithCategory = async (): Promise<CourseWithCategory[]> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*, categories(*)');
      
    if (error) throw new Error(error.message);
    return data.map(courseFromSupabase);
}

export const getCourseById = async (id: string): Promise<CourseWithCategory | undefined> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*, categories(*)')
      .eq('id', Number(id))
      .single();

    if (error) {
        console.error(error);
        return undefined;
    };
    return data ? courseFromSupabase(data) : undefined;
}

export const addCourse = async (courseData: Omit<Course, 'id'>): Promise<Course> => {
  const supabaseData = courseToSupabase(courseData);
  const { data, error } = await supabase.from('courses').insert(supabaseData).select().single();
  if (error) throw new Error(error.message);
  if (!data) {
    throw new Error('Course creation failed: no data returned.');
  }
  // FIX: Manually map the result. courseFromSupabase expects a joined category, which is not available on insert.
  // This also fixes the "Spread types may only be created from object types" error by avoiding the spread on `data`.
  return {
    id: data.id.toString(),
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.image_url,
    categoryId: data.category_id.toString(),
    checkoutUrl: data.checkout_url,
    benefits: data.benefits,
  };
};

export const updateCourse = async (id: string, courseData: Omit<Course, 'id'>): Promise<Course | null> => {
  const supabaseData = courseToSupabase(courseData);
  const { data, error } = await supabase.from('courses').update(supabaseData).eq('id', Number(id)).select().single();
  if (error) throw new Error(error.message);
  if (!data) return null;
  // FIX: Manually map the result. courseFromSupabase expects a joined category, which is not available on update.
  // This also fixes the "Spread types may only be created from object types" error by avoiding the spread on `data`.
  return {
    id: data.id.toString(),
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.image_url,
    categoryId: data.category_id.toString(),
    checkoutUrl: data.checkout_url,
    benefits: data.benefits,
  };
};

export const deleteCourse = async (id: string): Promise<void> => {
  const { error } = await supabase.from('courses').delete().eq('id', Number(id));
  if (error) throw new Error(error.message);
};
