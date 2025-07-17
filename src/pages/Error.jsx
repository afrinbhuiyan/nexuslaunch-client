import { useRouteError, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { FaExclamationTriangle, FaHome, FaSyncAlt } from 'react-icons/fa';
import errorImage from "../assets/755014.png";

const Error = () => {
  const error = useRouteError();
  
  useEffect(() => {
    console.error('Route Error:', error);
  }, [error]);

  // Default error message if none is provided
  const errorMessage = error.statusText || error.message || 
                     error.data || 'An unexpected error occurred';
  const statusCode = error.status || '???';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Illustration Section */}
        <div className="hidden md:flex bg-indigo-50 items-center justify-center p-8">
          <img 
            src={errorImage} 
            alt="Error illustration" 
            className="max-h-80 object-contain"
          />
        </div>

        {/* Error Content Section */}
        <div className="p-6 sm:p-8">
          {/* Error Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FaExclamationTriangle className="text-red-600 text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Oops! Error {statusCode}
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 mb-3">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500">
              We're sorry for the inconvenience. Please try again later.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/" 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <FaHome />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Error;