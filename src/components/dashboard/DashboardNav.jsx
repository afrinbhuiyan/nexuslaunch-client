import React from 'react';
import { FiMenu, FiBell } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const DashboardNav = ({ toggleSidebar }) => {
    const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <button 
          className="lg:hidden text-gray-500 hover:text-primary"
          onClick={toggleSidebar}
        >
          <FiMenu size={24} />
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-1 text-gray-500 hover:text-primary">
              <FiBell size={20} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img 
                src={user?.photoURL || '/default-avatar.png'} 
                alt={user?.displayName} 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNav;