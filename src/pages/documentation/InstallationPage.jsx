import { FiDownload, FiTerminal, FiCheckCircle, FiCpu, FiServer, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const InstallationPage = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">NexusLaunch Installation</h1>
        <p className="text-lg text-gray-600">
          Get your NexusLaunch environment up and running with these installation options.
        </p>
      </div>

      <div className="space-y-8">
        {/* System Requirements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiCpu className="text-indigo-600" />
            System Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Development</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  Node.js 18.x (LTS recommended)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  8GB RAM minimum
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  2GHz dual-core processor
                </li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Production</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  Node.js 18.x or Docker
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  16GB RAM recommended
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  Linux/Windows Server 2019+
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Installation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiDownload className="text-indigo-600" />
            Quick Installation
          </h2>
          
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FiTerminal className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-800">One-line Install</h3>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <code>npx nexuslaunch-cli init my-project</code>
            </div>
            <p className="mt-3 text-gray-600">
              This will create a new project with all dependencies installed.
            </p>
          </div>
        </section>

        {/* Detailed Methods */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiServer className="text-indigo-600" />
            Advanced Installation
          </h2>
          
          <div className="space-y-4">
            {/* Docker */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Docker Setup</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-4  font-mono text-sm overflow-x-auto">
                  <code>docker pull nexuslaunch/launchpad:stable</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-4  font-mono text-sm overflow-x-auto">
                  <code>docker run -p 3000:3000 nexuslaunch/launchpad</code>
                </div>
              </div>
              <p className="mt-3 text-gray-600">
                Access NexusLaunch at <code className="bg-gray-100 px-1.5 py-0.5 rounded">http://localhost:3000</code>
              </p>
            </div>

            {/* Manual */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Manual Installation</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code>git clone https://github.com/nexuslaunch/core.git</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code>cd core && npm install</code>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code>npm run build && npm start</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <FiCheckCircle className="text-green-600" />
            Verify Installation
          </h2>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <code>curl http://localhost:3000/api/health</code>
                </div>
              </div>
              <div className="text-sm text-gray-600 md:w-64">
                Should return: <code className="block mt-1 bg-gray-100 p-2 rounded">{"{ status: 'healthy' }"}</code>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/docs/configuration"
              className="group bg-white hover:bg-indigo-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-200 transition-all"
            >
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                Configuration Guide
                <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Set up your NexusLaunch environment variables and preferences
              </p>
            </Link>
            <Link
              to="/docs/deployment"
              className="group bg-white hover:bg-indigo-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-200 transition-all"
            >
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                Production Deployment
                <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn how to deploy NexusLaunch to your production environment
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InstallationPage;