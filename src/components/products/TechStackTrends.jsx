import { useState } from "react";
import { FaRocket, FaChartLine, FaCode, FaServer, FaDatabase } from "react-icons/fa";
import { motion } from "framer-motion";

const TechStackTrends = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const techData = {
    all: [
      { name: "React", percentage: 72, icon: <FaCode />, color: "#61DAFB" },
      { name: "Node.js", percentage: 68, icon: <FaServer />, color: "#339933" },
      { name: "TypeScript", percentage: 65, icon: <FaCode />, color: "#3178C6" },
      { name: "GraphQL", percentage: 48, icon: <FaDatabase />, color: "#E10098" },
      { name: "Docker", percentage: 56, icon: <FaServer />, color: "#2496ED" }
    ],
    frontend: [
      { name: "React", percentage: 72 },
      { name: "Vue", percentage: 38 },
      { name: "Angular", percentage: 31 },
      { name: "Svelte", percentage: 25 }
    ],
    backend: [
      { name: "Node.js", percentage: 68 },
      { name: "Python", percentage: 59 },
      { name: "Java", percentage: 45 },
      { name: "Go", percentage: 38 }
    ]
  };

  return (
    <div className="my-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#766df4] to-[#958ef4]">
        <FaChartLine className="inline mr-3 mb-1" />
        Tech Stack Trends
        <FaRocket className="inline ml-3 mb-1" />
      </h2>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-[#766df4]/10 rounded-full p-1">
          {["all", "frontend", "backend"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-[#766df4] text-white"
                  : "text-[#766df4] hover:bg-[#766df4]/20"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tech Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {techData[activeTab].map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="p-5">
              <div className="flex items-center mb-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white"
                  style={{ backgroundColor: tech.color || "#766df4" }}
                >
                  {tech.icon || <FaCode />}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{tech.name}</h3>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Adoption</span>
                  <span className="font-bold text-[#766df4]">{tech.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-[#766df4] to-[#958ef4]" 
                    style={{ width: `${tech.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#766df4]/5 p-2 rounded">
                  <p className="text-gray-500">Jobs</p>
                  <p className="font-bold">+{Math.floor(tech.percentage/2)}%</p>
                </div>
                <div className="bg-[#766df4]/5 p-2 rounded">
                  <p className="text-gray-500">Salary</p>
                  <p className="font-bold">${Math.floor(100 + (tech.percentage/1.5))}k</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trend Insights */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-gradient-to-r from-[#766df4]/5 to-[#958ef4]/10 rounded-2xl p-6 border border-[#766df4]/20"
      >
        <h3 className="text-xl font-bold text-[#766df4] mb-4">2023 Key Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "TypeScript adoption grew by 25% this year",
            "React remains the dominant frontend framework",
            "Node.js continues to lead in backend JavaScript",
            "GraphQL is the fastest growing API technology",
            "Docker usage surpassed 50% of production apps",
            "WebAssembly is emerging as a new frontier"
          ].map((insight, i) => (
            <div key={i} className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-[#766df4] mt-2 mr-2"></div>
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TechStackTrends;