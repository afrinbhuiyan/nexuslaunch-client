import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiLogOut,
  FiX,
  FiFileText,
  FiAlertCircle,
  FiUsers,
  FiTag,
  FiPlus,
  FiBox,
} from "react-icons/fi";
import { FaProductHunt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const DashboardSlider = ({ isOpen, closeSidebar }) => {
  const { user, logout, role } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      name: "Home",
      icon: <FiHome size={20} />,
      roles: ["user", "moderator", "admin"],
    },

    // USER
    {
      path: "/dashboard/profile",
      name: "Profile",
      icon: <FiUser size={20} />,
      roles: ["user"],
    },
    {
      path: "/dashboard/my-products",
      name: "My Products",
      icon: <FiBox size={20} />,
      roles: ["user"],
    },
    {
      path: "/dashboard/add-product",
      name: "Add Product",
      icon: <FiPlus size={20} />,
      roles: ["user"],
    },

    // MODERATOR
    {
      path: "/dashboard/review-products",
      name: "Review Products",
      icon: <FiFileText size={20} />,
      roles: ["moderator"],
    },
    {
      path: "/dashboard/reports-products",
      name: "Reported Contents",
      icon: <FiAlertCircle size={20} />,
      roles: ["moderator"],
    },

    // ADMIN
    {
      path: "/dashboard/statistics",
      name: "Statistics",
      icon: <FiSettings size={20} />,
      roles: ["admin"],
    },
    {
      path: "/dashboard/manage-users",
      name: "Manage Users",
      icon: <FiUsers size={20} />,
      roles: ["admin"],
    },
    {
      path: "/dashboard/manage-coupons",
      name: "Manage Coupons",
      icon: <FiTag size={20} />,
      roles: ["admin"],
    },
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
      <aside
        className={`fixed lg:static z-30 w-72 h-full bg-gradient-to-b from-[#6055f2] to-[#7b6ef3] shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h1 className="text-xl font-bold text-white">
              <Link to="/">NexusLaunch</Link>
            </h1>
            <button
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
              onClick={closeSidebar}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center p-6 pt-0 space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden">
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt={user?.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#6055f2]"></div>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {user?.displayName || "User"}
              </h3>
              <p className="text-sm text-white/80">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
                {role?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 mt-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-4 rounded-xl transition-all ${
                        location.pathname === item.path
                          ? "bg-white/10 text-white shadow-md"
                          : "text-white/80 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={closeSidebar}
                    >
                      <span
                        className={`mr-3 ${
                          location.pathname === item.path
                            ? "text-white"
                            : "text-white/70"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      {location.pathname === item.path && (
                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center w-full p-3 text-white/90 hover:text-white rounded-lg transition-colors hover:bg-white/10"
            >
              <FiLogOut size={20} className="mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSlider;
