import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#766df4] to-[#958ef4] bg-clip-text text-transparent">
                NexusLaunch
              </span>
              <span className="h-2 w-2 rounded-full bg-[#766df4] animate-pulse"></span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              to="/products"
              className="font-medium uppercase text-gray-700 hover:text-[#766df4] transition-colors relative group"
            >
              <span className="relative">
                Browse
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#766df4] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="font-medium text-gray-700 uppercase hover:text-[#766df4] transition-colors relative group"
              >
                <span className="relative">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#766df4] transition-all duration-300 group-hover:w-full"></span>
                </span>
              </Link>
            )}

            <Link
              to="/about"
              className="font-medium text-gray-700 uppercase hover:text-[#766df4] transition-colors relative group"
            >
              <span className="relative">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#766df4] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>

            <Link
              to="/contact"
              className="text-base font-medium text-gray-700 uppercase hover:text-[#766df4] transition-colors relative group"
            >
              <span className="relative">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#766df4] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
              >
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="flex items-center space-x-2 cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <img
                          src={user.photoURL || "/default-avatar.png"}
                          alt={user.displayName || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700 group-hover:text-[#766df4] transition-colors">
                      {user.displayName?.split(" ")[0] || "Account"}
                    </span>
                  </div>

                  <ul className="dropdown-content z-[1] menu p-2 shadow-xl bg-white rounded-xl w-56 mt-2 border border-gray-100">
                    <li className="px-4 py-3 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user.displayName || "User"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {user.email}
                      </div>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors flex items-center gap-2 text-left w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="hidden md:inline-block px-5 py-2.5 text-sm font-medium text-[#766df4] hover:text-[#5e55f3] transition-colors rounded-lg hover:bg-[#766df4]/10"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#766df4] rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-[#5e55f3]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-[#766df4] hover:bg-[#766df4]/10 focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:ring-offset-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/products"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/about"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <Link
                to="/contact"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-[#766df4]/5 hover:text-[#766df4] rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center text-base font-medium text-[#766df4] hover:bg-[#766df4]/10 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-center text-base font-medium text-white bg-[#766df4] rounded-lg shadow-sm hover:bg-[#5e55f3] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;