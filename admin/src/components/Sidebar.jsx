import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaHome,
    FaUserPlus,
    FaUsers,
    FaSignOutAlt,
    FaCalendarCheck,
    FaCheck,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

const Sidebar = ({ isSidebarOpen, toggleSidebar, handleLogout }) => {
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
        <aside
            className={`
        fixed top-0 left-0 h-[calc(100vh)] bg-gradient-to-b from-blue-900 to-blue-800 
        text-white shadow-lg transition-all duration-300 z-20
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        hidden lg:block
      `}
        >
            {/* Logo e Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-blue-700/50">
                <div className="flex items-center gap-2">
                    <span
                        className={`
              text-xl font-bold whitespace-nowrap transition-all duration-300 overflow-hidden
              ${isSidebarOpen ? 'w-full' : 'w-0'}
            `}
                    >
                        Central Jovem
                    </span>
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-blue-800/50 transition-colors"
                >
                    {isSidebarOpen ? (
                        <FaChevronLeft className="text-xl" />
                    ) : (
                        <FaChevronRight className="text-xl" />
                    )}
                </button>
            </div>

            {/* Itens do Menu */}
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`
              flex items-center gap-3 p-3 rounded-lg transition-colors whitespace-nowrap
              ${isCurrentPath(item.path) ? 'bg-blue-800/70' : 'hover:bg-blue-800/50'}
            `}
                    >
                        <item.icon className="text-xl flex-shrink-0" />
                        <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
                            {item.label}
                        </span>
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
                    <span className={`${isSidebarOpen ? 'block' : 'hidden'}`}>Sair</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;