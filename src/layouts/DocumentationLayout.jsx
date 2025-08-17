import {
  FiArrowUp,
  FiBook,
  FiCode,
  FiDatabase,
  FiUsers,
  FiLayers,
  FiSearch,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const DocumentationLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const contentRef = useRef(null);

  // Documentation menu with categories (static)
  const docsMenu = [
    {
      title: "Getting Started",
      icon: <FiBook className="w-4 h-4" />,
      color: "from-purple-500 to-indigo-500",
      items: [
        { name: "Introduction", path: "/documentation" },
        { name: "Installation", path: "/docs/installation" },
        { name: "Configuration", path: "/documentation/configuration" },
      ],
    },
    {
      title: "Core Features",
      icon: <FiDatabase className="w-4 h-4" />,
      color: "from-amber-500 to-orange-500",
      items: [
        { name: "Authentication", path: "/documentation/authentication" },
        { name: "API Reference", path: "/documentation/api" },
        { name: "Database", path: "/documentation/database" },
      ],
    },
    {
      title: "Advanced",
      icon: <FiCode className="w-4 h-4" />,
      color: "from-emerald-500 to-teal-500",
      items: [
        { name: "Deployment", path: "/documentation/deployment" },
        { name: "Troubleshooting", path: "/documentation/troubleshooting" },
      ],
    },
  ];

  // Filter menu items based on search
  const filteredMenu = docsMenu
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-40 p-4 rounded-xl bg-indigo-600 text-white shadow-lg"
      >
        <FiBook className="w-6 h-6" />
      </button>

      <div className="flex flex-1">
        {/* Desktop Sidebar - Always visible on desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed h-full z-20">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FiBook className="text-indigo-600" />
              Documentation
            </h2>
            <p className="text-sm text-gray-500 mt-1">v2.1.0</p>
            
            <div className="mt-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search docs..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <nav className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
            {filteredMenu.map((section, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center mb-2 text-gray-500 uppercase text-xs font-semibold">
                  {section.title}
                </div>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`block px-3 py-2 rounded-md text-sm ${
                          location.pathname === item.path
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar - Only visible when toggled */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-40 w-80 h-full bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold">Documentation</h2>
                <button 
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search docs..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <nav className="space-y-4">
                  {filteredMenu.map((section, index) => (
                    <div key={index}>
                      <div className="text-gray-500 uppercase text-xs font-semibold mb-2">
                        {section.title}
                      </div>
                      <ul className="space-y-1">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              to={item.path}
                              className={`block px-3 py-2 rounded-md text-sm ${
                                location.pathname === item.path
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setMobileSidebarOpen(false)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 bg-white min-h-screen">
          <div className="max-w-4xl mx-auto p-6">
            {/* Breadcrumbs */}
            <div className="text-sm mb-6 flex items-center text-gray-600">
              <Link to="/documentation" className="hover:text-indigo-600">
                Documentation
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">
                {location.pathname.split('/').pop() || 'Home'}
              </span>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Back to top button */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <FiArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default DocumentationLayout;