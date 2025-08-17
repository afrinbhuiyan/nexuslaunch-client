import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import useScrollToTop from "../hooks/useScrollToTop";
import { FiArrowUp } from "react-icons/fi";
import { motion } from 'framer-motion';

const MainLayout = () => {
  const { isVisible, scrollToTop } = useScrollToTop();
  return (
    <div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {/* Scroll to Top Button */}
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          style={{ backgroundColor: "#6055f2" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default MainLayout;
