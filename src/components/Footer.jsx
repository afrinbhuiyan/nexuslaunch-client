import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { motion } from "framer-motion";

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
            <h2 className="text-2xl font-bold flex items-center text-white">
              <span className="bg-[#766df4] text-white p-2 rounded-lg mr-2">
                N
              </span>
              NexusLaunch
            </h2>
            <p>
              The premier platform for developers to showcase their digital
              products and connect with users.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub].map(
                (Icon, index) => (
                  <motion.a
                    key={index}
                    whileHover={{ y: -3, scale: 1.1 }}
                    href="#"
                    className="bg-[#3a4246] p-2 rounded-full hover:bg-[#766df4] transition text-white"
                  >
                    <Icon className="text-lg" />
                  </motion.a>
                )
              )}
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
              {["Home", "Products", "Dashboard", "Pricing", "About"].map(
                (item, index) => (
                  <li key={index}>
                    <a href="#" className="hover:text-[#766df4] transition">
                      {item}
                    </a>
                  </li>
                )
              )}
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
              {[
                "Documentation",
                "API Reference",
                "Community",
                "Blog",
                "Help Center",
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-[#766df4] transition">
                    {item}
                  </a>
                </li>
              ))}
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
            <div className="flex max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 w-full rounded-l-lg border-2 border-r-0 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 shadow-sm hover:border-gray-300"
              />
              <button className="bg-[#766df4] text-white px-6 py-3 rounded-r-lg font-medium hover:bg-[#655be3] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#766df4] focus:ring-offset-2 whitespace-nowrap">
                Join
              </button>
            </div>
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
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-[#a1a1a1] hover:text-[#766df4] transition"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-[#a1a1a1] hover:text-[#766df4] transition"
            >
              Terms of Service
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#"
              className="text-[#a1a1a1] hover:text-[#766df4] transition"
            >
              Cookies
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
