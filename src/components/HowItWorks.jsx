import { motion } from "framer-motion";
import l from "../assets/process-03.png";

const HowItWorks = () => {
  const steps = [
    {
      title: "Submit Your Product",
      description:
        "Share your digital creation with our community in just a few clicks",
    },
    {
      title: "Get Community Feedback",
      description:
        "Receive votes and constructive comments from developers worldwide",
    },
    {
      title: "Engage With Users",
      description:
        "Discuss improvements and answer questions directly with your audience",
    },
    {
      title: "Track Your Growth",
      description:
        "Monitor analytics and watch your product climb the rankings",
    },
  ];

  return (
    <div className="my-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        {/* Text Column */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#766df4] to-[#958ef4]">
            How It Works
          </h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                {/* Animated step circle */}
                <div className="relative flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#766df4] to-[#958ef4] flex items-center justify-center text-white font-medium">
                    {index + 1}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-[#766df4] opacity-0 group-hover:opacity-100 animate-ping duration-1000"></div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#766df4] transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 pl-7">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Column */}
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <img
              src={l}
              alt="How it works illustration"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
