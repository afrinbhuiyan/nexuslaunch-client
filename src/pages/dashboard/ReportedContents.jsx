import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FiAlertTriangle, FiTrash2, FiEye, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ReportedContents = () => {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportedProducts = async () => {
      try {
        const res = await axiosSecure.get('/api/reports');
        setReportedProducts(res.data);
      } catch (error) {
        toast.error('Failed to load reported products');
      } finally {
        setLoading(false);
      }
    };
    fetchReportedProducts();
  }, [axios]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Permanently delete this product?')) return;
    
    try {
      await axios.delete(`/api/products/${productId}`);
      setReportedProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <FiAlertTriangle className="text-4xl text-yellow-500 mb-2" />
        <span className="text-lg font-medium">Loading reported content...</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FiAlertTriangle className="mr-2 text-red-500" />
              Reported Content
            </h1>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              {reportedProducts.length} items
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Review and take action on reported products
          </p>
        </div>
        
        {reportedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-24 w-24 text-gray-300">
              <FiAlertTriangle className="w-full h-full" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reported products</h3>
            <p className="mt-1 text-sm text-gray-500">All clear! No products have been reported.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reportedProducts.map(product => (
              <div key={product._id} className="hover:bg-gray-50 transition-colors">
                <div className="px-6 py-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(product._id)}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
                      <FiAlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">ID: {product._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {product.reports?.length || 0} reports
                    </span>
                    {expandedProduct === product._id ? (
                      <FiChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {expandedProduct === product._id && (
                  <div className="px-6 pb-4 pt-2 bg-gray-50">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Report Reasons</h4>
                      <ul className="space-y-3">
                        {product.reports?.map((report, i) => (
                          <li key={i} className="p-3 bg-white rounded-md shadow-xs border border-gray-100">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-800">{report.reason}</span>
                              <span className="text-xs text-gray-500">Report #{i+1}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Reported by: {report.reporterId}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FiEye className="mr-2 h-4 w-4" />
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Delete Product
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedContents;