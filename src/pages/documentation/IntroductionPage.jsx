import { FiZap, FiShield, FiCode, FiCloud, FiBarChart2, FiDownload } from "react-icons/fi";
import { Link } from "react-router-dom";

const IntroductionPage = () => {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-indigo-600">NexusLaunch</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The complete platform for building and deploying modern web applications with ease.
        </p>
      </section>

      {/* Overview Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          Platform Overview
        </h2>
        <p className="text-lg text-gray-700">
          NexusLaunch provides everything you need to develop, deploy, and scale your applications.
          Our unified platform combines powerful tools with intuitive interfaces to streamline your workflow.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <FiZap className="w-6 h-6 text-indigo-600" />,
              title: "Rapid Development",
              description: "Pre-configured templates and tools to accelerate your projects"
            },
            {
              icon: <FiShield className="w-6 h-6 text-indigo-600" />,
              title: "Built-in Security",
              description: "Enterprise-grade security features out of the box"
            },
            {
              icon: <FiCode className="w-6 h-6 text-indigo-600" />,
              title: "Full Customization",
              description: "Complete control over every aspect of your application"
            },
            {
              icon: <FiCloud className="w-6 h-6 text-indigo-600" />,
              title: "Cloud Native",
              description: "Designed for seamless cloud deployment"
            },
            {
              icon: <FiBarChart2 className="w-6 h-6 text-indigo-600" />,
              title: "Performance Optimized",
              description: "High-performance architecture for demanding applications"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          Getting Started
        </h2>
        
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-xl font-medium text-gray-800 mb-3">Quick Start</h3>
            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-3">
              <code>npx nexuslaunch-cli init my-app</code>
            </div>
            <p className="text-gray-600">
              This will create a new project with all dependencies installed and configured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/docs/installation"
              className="bg-white hover:bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                <FiDownload className="text-indigo-600" />
                Installation Guide
              </h3>
              <p className="text-gray-600">
                Detailed instructions for setting up NexusLaunch in different environments
              </p>
            </Link>
            <Link
              to="/docs/configuration"
              className="bg-white hover:bg-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                <FiCode className="text-indigo-600" />
                Configuration
              </h3>
              <p className="text-gray-600">
                Learn how to customize NexusLaunch for your specific needs
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 border-b pb-2">
          System Architecture
        </h2>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for architecture diagram */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              [NexusLaunch Architecture Diagram]
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            NexusLaunch follows a modular microservices architecture designed for scalability and flexibility.
            Components communicate through well-defined APIs and can be scaled independently.
          </p>
        </div>
      </section>
    </div>
  );
};

export default IntroductionPage;