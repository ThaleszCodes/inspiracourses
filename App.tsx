
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './components/pages/HomePage';
import CourseDetailPage from './components/pages/CourseDetailPage';
import CategoryPage from './components/pages/CategoryPage';
import AdminLoginPage from './components/pages/admin/AdminLoginPage';
import AdminDashboard from './components/pages/admin/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="cursos" element={<HomePage />} />
            <Route path="curso/:id" element={<CourseDetailPage />} />
            <Route path="categorias" element={<CategoryPage />} />
            <Route path="categorias/:id" element={<CategoryPage />} />
            <Route path="contato" element={<HomePage />} /> {/* Simple redirect for demo */}
          </Route>
          
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
