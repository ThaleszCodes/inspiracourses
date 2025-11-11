import React from 'react';
import { Link } from 'react-router-dom';
import { CourseWithCategory } from '../types';

interface CourseCardProps {
  course: CourseWithCategory;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
      <img className="h-48 w-full object-cover" src={course.imageUrl} alt={course.name} />
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-sm text-inspira-blue font-semibold mb-2">{course.category.name}</p>
        <h3 className="text-xl font-bold text-inspira-dark mb-2 flex-grow">{course.name}</h3>
        <p className="text-gray-700 text-sm mb-4">{course.description}</p>
        <div className="mt-auto">
            <p className="text-2xl font-bold text-inspira-dark mb-4">{formatPrice(course.price)}</p>
            <Link 
                to={`/curso/${course.id}`} 
                className="block w-full text-center bg-inspira-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
            Saber Mais
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;