import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { getCategories, getCoursesWithCategory } from '../../services/api';
import { Category, CourseWithCategory } from '../../types';
import CourseCard from '../CourseCard';

const CategoryPage: React.FC = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<CourseWithCategory[]>([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const allCategories = await getCategories();
            setCategories(allCategories);

            if (categoryId) {
                const allCourses = await getCoursesWithCategory();
                const filteredCourses = allCourses.filter(course => course.categoryId === categoryId);
                setCourses(filteredCourses);
                const category = allCategories.find(c => c.id === categoryId);
                setSelectedCategoryName(category ? category.name : '');
            } else {
                setCourses([]);
                setSelectedCategoryName('');
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [categoryId]);
  
  const activeLinkClass = "bg-inspira-blue text-white";
  const inactiveLinkClass = "bg-white text-gray-800 hover:bg-gray-100";

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-inspira-dark text-center mb-8">
        Categorias de Cursos
      </h1>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(category => (
          <NavLink
            key={category.id}
            to={`/categorias/${category.id}`}
            className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors duration-300 ${categoryId === category.id ? activeLinkClass : inactiveLinkClass}`}
          >
            {category.name}
          </NavLink>
        ))}
      </div>
      
      {loading && <p className="text-center text-gray-700">Carregando...</p>}

      {!loading && categoryId && (
        <>
            <h2 className="text-2xl font-bold text-inspira-dark text-center mb-8">
                Cursos em {selectedCategoryName}
            </h2>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-700">Nenhum curso encontrado nesta categoria.</p>
            )}
        </>
      )}

      {!loading && !categoryId && (
        <p className="text-center text-gray-700">Selecione uma categoria para ver os cursos.</p>
      )}

    </div>
  );
};

export default CategoryPage;