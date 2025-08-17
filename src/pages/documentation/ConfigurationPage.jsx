import React from 'react';
import { FiSettings, FiDatabase, FiLock, FiServer, FiCpu, FiChevronRight, FiCode} from "react-icons/fi";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ConfigurationPage = () => {
  const configExample = `// nexuslaunch.config.js
module.exports = {
  // Core Settings
  appName: 'my-nexus-app',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,

  // Database Configuration
  database: {
    url: process.env.DB_URL || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'nexuslaunch_db',
    poolSize: 10
  },

  // Security Settings
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    corsOrigins: ['http://localhost:8080', 'https://yourdomain.com']
  },

  // Performance Tuning
  cache: {
    enabled: true,
    ttl: 3600 // 1 hour
  }
}`;

  const envExample = `# Environment Variables
NODE_ENV=production
PORT=4000

# Database
DB_URL=mongodb://production-db:27017
DB_NAME=nexus_prod

# Security
JWT_SECRET=complex-secret-key-here
API_RATE_LIMIT=100`;

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FiSettings className="text-indigo-600" />
          Configuration Guide
        </h1>
        <p className="text-lg text-gray-600">
          Customize NexusLaunch to fit your project requirements with these configuration options.
        </p>
      </div>

      <div className="space-y-8">
        {/* Configuration Methods */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            Configuration Methods
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiCode className="text-indigo-600" />
                Config File
              </h3>
              <p className="text-gray-600 mb-4">
                Primary configuration through <code className="bg-gray-100 px-1.5 py-0.5 rounded">nexuslaunch.config.js</code>
              </p>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <SyntaxHighlighter 
                  language="javascript" 
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  {configExample}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiServer className="text-indigo-600" />
                Environment Variables
              </h3>
              <p className="text-gray-600 mb-4">
                Override any setting using <code className="bg-gray-100 px-1.5 py-0.5 rounded">.env</code> files
              </p>
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <SyntaxHighlighter 
                  language="bash" 
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    backgroundColor: '#f8fafc'
                  }}
                >
                  {envExample}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">
            Configuration Sections
          </h2>

          <div className="space-y-6">
            {/* Database Configuration */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiDatabase className="text-indigo-600" />
                Database Configuration
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Supported Databases</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>MongoDB (default)</li>
                    <li>PostgreSQL</li>
                    <li>MySQL</li>
                    <li>SQLite (for development)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Connection Pooling</h4>
                  <p className="text-gray-600">
                    Configure pool size and timeout in <code className="bg-gray-100 px-1.5 py-0.5 rounded">database.poolSize</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Security Configuration */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiLock className="text-indigo-600" />
                Security Settings
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Authentication</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>JWT Secret Key</li>
                    <li>Session Timeout</li>
                    <li>Password Policies</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">CORS</h4>
                  <p className="text-gray-600">
                    Configure allowed origins in <code className="bg-gray-100 px-1.5 py-0.5 rounded">security.corsOrigins</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Configuration */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                <FiCpu className="text-indigo-600" />
                Performance Tuning
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Caching</h4>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Enable/disable caching</li>
                    <li>TTL configuration</li>
                    <li>Redis integration</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Rate Limiting</h4>
                  <p className="text-gray-600">
                    Configure API rate limits using <code className="bg-gray-100 px-1.5 py-0.5 rounded">API_RATE_LIMIT</code> env variable
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/docs/deployment"
              className="group bg-white hover:bg-indigo-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-200 transition-all"
            >
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                Deployment Guide
                <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn how to deploy your configured NexusLaunch application
              </p>
            </Link>
            <Link
              to="/docs/api"
              className="group bg-white hover:bg-indigo-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-200 transition-all"
            >
              <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 flex items-center gap-2">
                API Reference
                <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Explore the available API endpoints and their configurations
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConfigurationPage;