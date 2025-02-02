import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Importando o Sidebar
import Header from '../components/Header';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Função para alternar a sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Função para alternar o menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleMobileMenu={toggleMobileMenu}
        handleLogout={handleLogout}
      />

      {/* Header Mobile */}
      <Header toggleMobileMenu={toggleMobileMenu} />

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 min-h-screen bg-gray-100 pt-0 lg:pt-0
          ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          relative z-0
        `}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;