
import React, { useState, useEffect } from 'react';
import { getCoursesWithCategory } from '../../services/api';
import { CourseWithCategory } from '../../types';
import CourseCard from '../CourseCard';

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCoursesWithCategory();
        setCourses(coursesData);
        setError(null);
      } catch (err: any) {
        setError("Falha ao carregar os cursos. Tente novamente mais tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-inspira-dark text-center mb-8">
        Explore Nossos Cursos
      </h1>
      
      {loading && <p className="text-center text-gray-600">Carregando cursos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;