import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-[#2e3538] text-gray-300 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Link to="/" className="text-2xl font-bold flex items-center text-white">
              <span className="bg-[#766df4] text-white p-2 rounded-lg mr-2">
                N
              </span>
              NexusLaunch
            </Link>
            <p>
              The premier platform for developers to showcase their digital
              products and connect with users.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                href="https://facebook.com/nexuslaunch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
              >
                <FaFacebook className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                href="https://twitter.com/nexuslaunch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
              >
                <FaTwitter className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                href="https://instagram.com/nexuslaunch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
              >
                <FaInstagram className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                href="https://linkedin.com/company/nexuslaunch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
              >
                <FaLinkedin className="text-lg" />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                href="https://github.com/nexuslaunch"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
              >
                <FaGithub className="text-lg" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-[#4a5256] pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="hover:text-[#766df4] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#766df4] transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#766df4] transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#766df4] transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#766df4] transition">
                  About
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-[#4a5256] pb-2">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/docs" 
                  className="hover:text-[#766df4] transition"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  to="/api" 
                  className="hover:text-[#766df4] transition"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link 
                  to="/community" 
                  className="hover:text-[#766df4] transition"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="hover:text-[#766df4] transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="hover:text-[#766df4] transition"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white border-b border-[#4a5256] pb-2">
              Stay Updated
            </h3>
            <p>
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form 
              action="https://nexuslaunch.us21.list-manage.com/subscribe/post"
              method="POST"
              className="flex max-w-md"
            >
              <input
                type="email"
                name="EMAIL"
                placeholder="Enter your email"
                className="px-4 py-3 w-full rounded-l-lg border-2 border-r-0 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:border-gray-300"
                required
              />
              <input type="hidden" name="u" value="1234567890abcdef1234567890" />
              <input type="hidden" name="id" value="1234567890" />
              <button 
                type="submit"
                className="bg-[#766df4] text-white px-6 py-3 rounded-r-lg font-medium hover:bg-[#655be3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:ring-offset-2 whitespace-nowrap"
              >
                Join
              </button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#4a5256] mb-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#a1a1a1] mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} NexusLaunch. All rights reserved.
          </motion.p>

          <div className="flex space-x-6">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/privacy" className="text-[#a1a1a1] hover:text-[#766df4] transition">
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/terms" className="text-[#a1a1a1] hover:text-[#766df4] transition">
                Terms of Service
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/cookies" className="text-[#a1a1a1] hover:text-[#766df4] transition">
                Cookies
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;