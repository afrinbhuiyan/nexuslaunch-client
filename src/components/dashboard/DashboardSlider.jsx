import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiX 
} from 'react-icons/fi';
import { FaProductHunt } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

const DashboardSlider = ({ isOpen, closeSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', name: 'Home', icon: <FiHome size={20} /> },
    { path: '/dashboard/my-products', name: 'My Products', icon: <FaProductHunt size={20} /> },
    { path: '/dashboard/products', name: 'Products', icon: <FaProductHunt size={20} /> },
    { path: '/dashboard/profile', name: 'Profile', icon: <FiUser size={20} /> },
    { path: '/dashboard/settings', name: 'Settings', icon: <FiSettings size={20} /> },
    { path: '/dashboard/add-product', name: 'Add Product', icon: <FiSettings size={20} /> },
    { path: '/dashboard/review-products', name: 'Review Product', icon: <FiSettings size={20} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static z-30 w-64 h-full bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-primary">NexusLaunch</h1>
            <button 
              className="lg:hidden text-gray-500"
              onClick={closeSidebar}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Rest of your sidebar content */}
          <div className="flex items-center p-4 mt-4 space-x-3">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={user?.photoURL || '/default-avatar.png'} alt={user?.displayName} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{user?.displayName || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <nav className="flex-1 mt-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center w-full p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSlider;