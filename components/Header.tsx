import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkClass = "text-inspira-blue";
  const inactiveLinkClass = "text-gray-700 hover:text-inspira-blue transition-colors duration-300";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="text-2xl font-bold">
            <span className="text-inspira-dark">INSPIRA.</span>
            <span className="text-inspira-blue">CURSOS</span>
          </NavLink>
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className={({isActive}) => isActive ? activeLinkClass : inactiveLinkClass}>Início</NavLink>
            <NavLink to="/cursos" className={({isActive}) => isActive ? activeLinkClass : inactiveLinkClass}>Cursos</NavLink>
            <NavLink to="/categorias" className={({isActive}) => isActive ? activeLinkClass : inactiveLinkClass}>Categorias</NavLink>
            <a href="https://wa.me/5553991257648" target="_blank" rel="noopener noreferrer" className={inactiveLinkClass}>Contato</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;