import { motion } from "framer-motion";
import { FaCode, FaMobileAlt, FaPaintBrush, FaRobot, FaCloud, FaChartLine } from "react-icons/fa";

const categories = [
  {
    icon: <FaCode className="w-8 h-8 text-indigo-500" />,
    title: "Web Apps",
  },
  {
    icon: <FaMobileAlt className="w-8 h-8 text-indigo-500" />,
    title: "Mobile Apps",
  },
  {
    icon: <FaPaintBrush className="w-8 h-8 text-indigo-500" />,
    title: "UI/UX Templates",
  },
  {
    icon: <FaRobot className="w-8 h-8 text-indigo-500" />,
    title: "AI Tools",
  },
  {
    icon: <FaCloud className="w-8 h-8 text-indigo-500" />,
    title: "SaaS Platforms",
  },
  {
    icon: <FaChartLine className="w-8 h-8 text-indigo-500" />,
    title: "Analytics Tools",
  },
];

const Categories = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold sm:text-4xl text-gray-900 dark:text-white"
        >
          Explore by <span className="text-indigo-500">Categories</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
        >
          Find the right tools, templates, and apps for your next big project.
        </motion.p>

        {/* Category Grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {categories.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
