import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const Footer: React.FC = () => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAdminClick = () => {
        setIsInputVisible(prev => !prev);
        setError('');
        setAccessCode('');
    };

    const handleCodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === '840814') {
            navigate('/admin/login');
        } else {
            setError('Código incorreto.');
            setAccessCode('');
        }
    };

  return (
    <footer className="bg-white border-t border-gray-200 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-700">
        <div className="mb-4 space-y-2">
            <p><strong>Contato:</strong> thalesdev01@gmail.com</p>
            <p><strong>WhatsApp:</strong> (53) 99125-7648</p>
        </div>
        <p className="text-sm">
          © 2025 Inspira.Cursos - Todos os direitos reservados.
        </p>
        <p className="text-xs mt-2 text-gray-600">
          Feito por: Thales Dev.
        </p>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {isInputVisible && (
            <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
                <form onSubmit={handleCodeSubmit} className="flex items-center gap-2">
                    <input
                        type="password"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Código"
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-inspira-blue w-32"
                        autoFocus
                    />
                    <button type="submit" className="px-4 py-2 bg-inspira-blue text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                        Acessar
                    </button>
                </form>
                {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
            </div>
        )}
        <button
            onClick={handleAdminClick}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors shadow-md z-10"
            aria-label="Acesso do Administrador"
            title="Acesso do Administrador"
        >
            <AdminAccessIcon />
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;