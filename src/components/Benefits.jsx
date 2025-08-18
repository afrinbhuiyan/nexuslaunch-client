import { motion } from "framer-motion";
import { FaShieldAlt, FaUsers, FaBolt, FaGlobe } from "react-icons/fa";

const benefits = [
  {
    icon: <FaShieldAlt />,
    title: "Secure & Reliable",
    desc: "Your projects are protected with enterprise-grade security and trusted infrastructure.",
    accent: "from-[rgba(96,85,242,0.1)] to-[rgba(96,85,242,0.05)]"
  },
  {
    icon: <FaUsers />,
    title: "Community Feedback",
    desc: "Get instant feedback from real developers and innovators around the globe.",
    accent: "from-[rgba(96,85,242,0.1)] to-[rgba(96,85,242,0.05)]"
  },
  {
    icon: <FaBolt />,
    title: "Faster Growth",
    desc: "Showcase your digital product and accelerate user adoption and growth.",
    accent: "from-[rgba(96,85,242,0.1)] to-[rgba(96,85,242,0.05)]"
  },
  {
    icon: <FaGlobe />,
    title: "Global Reach",
    desc: "Launch once and reach a worldwide audience of makers and investors.",
    accent: "from-[rgba(96,85,242,0.1)] to-[rgba(96,85,242,0.05)]"
  },
];

const Benefits = () => {
  return (
    <section className="relative bg-white dark:bg-gray-900 py-24 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header with animated underline */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-medium text-[rgb(96,85,242)] dark:text-[rgb(160,152,255)] mb-4"
          >
            WHY CHOOSE US
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold text-[#766df4] dark:text-white mb-6"
          >
            The NexusLaunch Difference
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            We combine cutting-edge technology with community-powered insights to elevate your projects.
          </motion.p>
        </div>

        {/* Benefits grid with floating cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative h-full p-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 flex items-center justify-center mb-6 rounded-lg bg-[rgba(96,85,242,0.1)] dark:bg-[rgba(96,85,242,0.2)] text-[rgb(96,85,242)] dark:text-[rgb(160,152,255)]">
                  <div className="text-2xl">
                    {item.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
                
                <div className="absolute bottom-6 left-8 w-8 h-0.5 bg-[rgb(96,85,242)] dark:bg-[rgb(160,152,255)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[rgba(96,85,242,0.03)] dark:bg-[rgba(96,85,242,0.05)] blur-3xl" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[rgba(96,85,242,0.03)] dark:bg-[rgba(96,85,242,0.05)] blur-3xl" />
      </div>
    </section>
  );
};

export default Benefits;