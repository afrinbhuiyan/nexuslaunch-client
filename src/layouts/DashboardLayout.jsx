import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNav from '../components/dashboard/DashboardNav';
import DashboardSlider from '../components/dashboard/DashboardSlider';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSlider 
        isOpen={sidebarOpen} 
        closeSidebar={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNav toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;