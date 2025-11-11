import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../services/api';
import { CourseWithCategory } from '../../types';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseWithCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (id) {
        try {
          setLoading(true);
          const foundCourse = await getCourseById(id);
          setCourse(foundCourse || null);
        } catch (error) {
          console.error("Failed to fetch course", error);
          setCourse(null);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Carregando curso...</div>;
  }

  if (!course) {
    return <div className="text-center py-20">Curso não encontrado.</div>;
  }

  const benefitsList = course.benefits.split(';').map(b => b.trim()).filter(b => b);
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const calculateDiscount = (original: number, current: number) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const discount = course.originalPrice ? calculateDiscount(course.originalPrice, course.price) : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <img className="w-full h-64 object-cover" src={course.imageUrl} alt={course.name} />
        <div className="p-8">
          <p className="text-base text-inspira-blue font-semibold mb-2">{course.category.name}</p>
          <h1 className="text-4xl font-extrabold text-inspira-dark mb-4">{course.name}</h1>
          
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-inspira-dark mb-3">Descrição Completa</h2>
            <p className="text-gray-800 leading-relaxed">{course.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-inspira-dark mb-3">Benefícios</h2>
            <ul className="space-y-3">
              {benefitsList.map((benefit, index) => (
                <li key={index} className="flex items-center text-gray-800">
                    <CheckIcon />
                    <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-inspira-dark mb-3">O que você vai aprender</h2>
            <p className="text-gray-800 leading-relaxed">
              Ao final deste curso, você estará apto a aplicar todas as técnicas e conhecimentos apresentados para alcançar resultados extraordinários na área de {course.category.name.toLowerCase()}.
            </p>
          </div>
          
          <div className="mt-10 text-center">
            {course.originalPrice && course.originalPrice > course.price ? (
                <div className="mb-4">
                    <p className="text-2xl text-gray-500 line-through">{formatPrice(course.originalPrice)}</p>
                    <p className="text-4xl font-extrabold text-inspira-dark flex items-center justify-center gap-4">
                        {formatPrice(course.price)}
                        {discount > 0 && (
                            <span className="bg-red-500 text-white text-lg font-bold px-4 py-1 rounded-full animate-pulse">
                                {discount}% OFF
                            </span>
                        )}
                    </p>
                </div>
            ) : (
                <p className="text-3xl font-bold text-inspira-dark mb-4">{formatPrice(course.price)}</p>
            )}
            <a 
              href={course.checkoutUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white font-bold py-4 px-10 rounded-lg text-xl hover:bg-green-600 transition-transform duration-300 transform hover:scale-105"
            >
              Quero me inscrever agora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
