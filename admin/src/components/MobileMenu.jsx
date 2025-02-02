import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUserPlus,
    FaUsers,
    FaSignOutAlt,
    FaCalendarCheck,
    FaCheck,
} from 'react-icons/fa';

const MobileMenu = ({ isOpen, onClose, handleLogout }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
        { path: '/dashboard/cadastro', icon: FaUserPlus, label: 'Novo Cadastro' },
        { path: '/dashboard/membros', icon: FaUsers, label: 'Membros' },
        { path: '/dashboard/frequencia', icon: FaCalendarCheck, label: 'Frequência' },
        { path: '/dashboard/marcar-presenca', icon: FaCheck, label: 'Marcar Presença' },
    ];

    const isCurrentPath = (path) => location.pathname === path;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={onClose} // Fecha o menu ao clicar no overlay
                />
            )}

            {/* Menu Mobile */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 
          text-white shadow-lg transform transition-transform duration-300 z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* Logo e Botão de Fechar */}
                <div className="flex items-center justify-between p-4 border-b border-blue-700/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">Central FJU</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Itens do Menu */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose} // Fecha o menu ao clicar em um item
                            className={`
                flex items-center gap-3 p-3 rounded-lg transition-colors whitespace-nowrap
                ${isCurrentPath(item.path) ? 'bg-blue-800/70' : 'hover:bg-blue-800/50'}
              `}
                        >
                            <item.icon className="text-xl flex-shrink-0" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Botão de Logout */}
                <div className="absolute bottom-0 w-full p-4 border-t border-blue-700/50">
                    <button
                        className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-blue-800/50 transition-colors whitespace-nowrap"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="text-xl flex-shrink-0" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default MobileMenu;