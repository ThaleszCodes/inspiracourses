import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import * as api from '../../../services/api';
import { Course, Category, CourseWithCategory } from '../../../types';

// Using a single modal for forms to keep the component smaller
type ModalMode = 'add-course' | 'edit-course' | 'add-category' | 'edit-category' | null;

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Course & Category>>({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
        setLoading(true);
        const [coursesData, categoriesData] = await Promise.all([
            api.getCoursesWithCategory(),
            api.getCategories(),
        ]);
        setCourses(coursesData);
        setCategories(categoriesData);
    } catch (error) {
        console.error("Failed to load data", error);
        alert("Falha ao carregar os dados do painel.");
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleOpenModal = (mode: ModalMode, item?: CourseWithCategory | Category) => {
    setModalMode(mode);
    if (mode === 'edit-course' && item) {
        // Bug Fix: Destructure to avoid saving the 'category' object back into the course data
        const { category, ...courseData } = item as CourseWithCategory;
        setSelectedCourse(courseData);
        setFormData(courseData);
    } else if (mode === 'edit-category' && item) {
        setSelectedCategory(item as Category);
        setFormData(item);
    } else {
        setFormData({});
        setSelectedCourse(null);
        setSelectedCategory(null);
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ 
        ...prev, 
        [name]: (name === 'price' || name === 'originalPrice') 
            ? (value === '' ? undefined : parseFloat(value)) 
            : value 
    }));
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (modalMode === 'add-course') {
            await api.addCourse(formData as Omit<Course, 'id'>);
        } else if (modalMode === 'edit-course' && selectedCourse) {
            await api.updateCourse(selectedCourse.id, formData as Omit<Course, 'id'>);
        } else if (modalMode === 'add-category') {
            await api.addCategory(formData.name || '');
        } else if (modalMode === 'edit-category' && selectedCategory) {
            await api.updateCategory(selectedCategory.id, formData.name || '');
        }
        await loadData(); // Reload all data to reflect changes
        handleCloseModal();
      } catch (error) {
          console.error("Failed to save data", error);
          alert("Failed to save data. See console for details.")
      }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      await api.deleteCourse(id);
      await loadData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Apenas categorias sem cursos podem ser excluídas.')) {
      const success = await api.deleteCategory(id);
      if(success) await loadData();
    }
  };
  
  const getModalTitle = () => {
    switch (modalMode) {
      case 'add-course': return 'Adicionar Novo Curso';
      case 'edit-course': return 'Editar Curso';
      case 'add-category': return 'Adicionar Nova Categoria';
      case 'edit-category': return 'Editar Categoria';
      default: return '';
    }
  };

  const renderModalContent = () => {
    if (!modalMode) return null;

    const inputClasses = "w-full p-2 border border-gray-300 rounded bg-white text-inspira-dark focus:ring-1 focus:ring-inspira-blue focus:border-inspira-blue";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    if (modalMode.includes('course')) {
        return (
            <form onSubmit={handleFormSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="course-name" className={labelClasses}>Nome do Curso</label>
                    <input id="course-name" type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="course-description" className={labelClasses}>Descrição</label>
                    <textarea id="course-description" name="description" value={formData.description || ''} onChange={handleFormChange} className={inputClasses} required />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="course-originalPrice" className={labelClasses}>Preço Original (De:)</label>
                        <input id="course-originalPrice" type="number" step="0.01" name="originalPrice" placeholder="Opcional. Ex: 299.90" value={formData.originalPrice || ''} onChange={handleFormChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="course-price" className={labelClasses}>Preço Atual (Por:)</label>
                        <input id="course-price" type="number" step="0.01" name="price" placeholder="Ex: 99.90" value={formData.price || ''} onChange={handleFormChange} className={inputClasses} required />
                    </div>
                 </div>
                <div>
                    <label htmlFor="course-imageUrl" className={labelClasses}>URL da Imagem</label>
                    <input id="course-imageUrl" type="text" name="imageUrl" value={formData.imageUrl || ''} onChange={handleFormChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="course-categoryId" className={labelClasses}>Categoria</label>
                    <select id="course-categoryId" name="categoryId" value={formData.categoryId || ''} onChange={handleFormChange} className={inputClasses} required>
                        <option value="">Selecione a Categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="course-checkoutUrl" className={labelClasses}>URL do Checkout</label>
                    <input id="course-checkoutUrl" type="text" name="checkoutUrl" placeholder="https://kiwify.com.br/..." value={formData.checkoutUrl || ''} onChange={handleFormChange} className={inputClasses} required />
                </div>
                <div>
                    <label htmlFor="course-benefits" className={labelClasses}>Benefícios</label>
                    <textarea id="course-benefits" name="benefits" placeholder="Separados por ponto e vírgula. Ex: Foco; Disciplina" value={formData.benefits || ''} onChange={handleFormChange} className={inputClasses} required />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-inspira-blue text-white rounded hover:bg-blue-700">Salvar</button>
                </div>
            </form>
        )
    }

    if (modalMode.includes('category')) {
        return (
            <form onSubmit={handleFormSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="category-name" className={labelClasses}>Nome da Categoria</label>
                    <input id="category-name" type="text" name="name" value={formData.name || ''} onChange={handleFormChange} className={inputClasses} required />
                 </div>
                 <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-inspira-blue text-white rounded hover:bg-blue-700">Salvar</button>
                </div>
            </form>
        )
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Painel Administrativo</h1>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Sair</button>
            </div>
        </header>

        <main className="container mx-auto p-4">
            {loading ? <p className="text-center">Carregando dados...</p> : <>
            {/* Courses Management */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Cursos</h2>
                    <button onClick={() => handleOpenModal('add-course')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Adicionar Curso</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Nome</th><th className="p-2">Categoria</th><th className="p-2">Preço</th><th className="p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map(course => (
                                <tr key={course.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{course.name}</td>
                                    <td className="p-2">{course.category.name}</td>
                                    <td className="p-2">{course.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="p-2 space-x-2">
                                        <button onClick={() => handleOpenModal('edit-course', course)} className="text-blue-600 hover:underline">Editar</button>
                                        <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:underline">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Categories Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Categorias</h2>
                    <button onClick={() => handleOpenModal('add-category')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Adicionar Categoria</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b"><th className="p-2">Nome</th><th className="p-2">Ações</th></tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{category.name}</td>
                                    <td className="p-2 space-x-2">
                                        <button onClick={() => handleOpenModal('edit-category', category)} className="text-blue-600 hover:underline">Renomear</button>
                                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-600 hover:underline">Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </>}
        </main>
        
        {/* Modal */}
        {modalMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                    <div className="flex justify-between items-center pb-4 mb-4 border-b">
                        <h2 className="text-2xl font-bold">{getModalTitle()}</h2>
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-bold">&times;</button>
                    </div>
                    {renderModalContent()}
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;
