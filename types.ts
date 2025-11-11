export interface Category {
  id: string;
  name: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  categoryId: string;
  checkoutUrl: string;
  benefits: string; // Stored as a newline-separated string
}

export interface CourseWithCategory extends Course {
  category: Category;
}
