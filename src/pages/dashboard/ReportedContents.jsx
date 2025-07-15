import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ReportedContents = () => {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportedProducts = async () => {
      try {
        // Fetch from products/reported endpoint
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

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reported Products</h1>
      
      {reportedProducts.length === 0 ? (
        <p className="text-center py-10">No reported products found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Reports</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportedProducts.map(product => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {product._id}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <ul className="text-sm space-y-1">
                      {product.reports?.slice(0, 3).map((report, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-1">•</span>
                          <div>
                            <p>{report.reason}</p>
                            <p className="text-xs text-gray-500">
                              Reported by: {report.reporterId}
                            </p>
                          </div>
                        </li>
                      ))}
                      {product.reports?.length > 3 && (
                        <li className="text-sm text-gray-500">
                          +{product.reports.length - 3} more reports
                        </li>
                      )}
                    </ul>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedContents;