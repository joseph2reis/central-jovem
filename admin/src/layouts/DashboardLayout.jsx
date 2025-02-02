import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileMenu from '../components/MobileMenu';
import { useAuth } from '../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <Header toggleMobileMenu={toggleMobileMenu} isSidebarOpen={isSidebarOpen} isMobileMenuOpen={isMobileMenuOpen} />

      {/* Menu Mobile */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        handleLogout={logout}

      />

      {/* Conteúdo principal (Sidebar + Main) */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isMobileMenuOpen={isMobileMenuOpen}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          toggleMobileMenu={toggleMobileMenu}
          handleLogout={logout}
        />

        {/* Main Content */}
        <main
          className={`
            flex-1 p-6 overflow-y-auto transition-all duration-300
            ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}
          `}
        >
          <Outlet /> {/* Renderiza as subrotas do Dashboard */}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;