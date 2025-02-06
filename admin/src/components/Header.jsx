import { FaBars } from 'react-icons/fa';

function Header({ toggleMobileMenu, isSidebarOpen }) {
  return (
    <header className={`overflow-auto transition-all duration-300 py-2  ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} bg-white shadow-md flex items-center justify-between px-6 z-10`}>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-blue-900">Central Jovem</span>
      </div>
      <button
        onClick={toggleMobileMenu}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
      >
        <FaBars className="text-xl text-blue-900" />
      </button>
    </header>
  );
}

export default Header;