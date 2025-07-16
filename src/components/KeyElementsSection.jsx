import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const KeyElementsSection = () => {
  return (
    <div className="bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main headline with #766df4 color */}
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-[#766df4]"
        >
          Transform Your Digital Presence
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Discover the easiest way to showcase your products and get valuable feedback from our community.
        </motion.p>
        
        {/* "Get Started Now" button with #766df4 color */}
        <motion.button
          whileHover={{ 
            scale: 1.05,
            backgroundColor: '#655be3' // Slightly darker shade on hover
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-[#766df4] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center mx-auto"
        >
          Get Started Now
          <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </div>
  );
};

export default KeyElementsSection;