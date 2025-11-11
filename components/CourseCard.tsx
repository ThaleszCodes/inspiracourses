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

  const calculateDiscount = (original: number, current: number) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const discount = course.originalPrice ? calculateDiscount(course.originalPrice, course.price) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
      <div className="relative">
        <img className="h-48 w-full object-cover" src={course.imageUrl} alt={course.name} />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <p className="text-sm text-inspira-blue font-semibold mb-2">{course.category.name}</p>
        <h3 className="text-xl font-bold text-inspira-dark mb-2 flex-grow">{course.name}</h3>
        <p className="text-gray-700 text-sm mb-4">{course.description}</p>
        <div className="mt-auto">
            <div className="mb-4 h-16 flex flex-col justify-center">
              {course.originalPrice && course.originalPrice > course.price ? (
                <>
                  <p className="text-gray-500 text-base line-through">{formatPrice(course.originalPrice)}</p>
                  <p className="text-2xl font-bold text-inspira-dark -mt-1">{formatPrice(course.price)}</p>
                </>
              ) : (
                <p className="text-2xl font-bold text-inspira-dark">{formatPrice(course.price)}</p>
              )}
            </div>
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
