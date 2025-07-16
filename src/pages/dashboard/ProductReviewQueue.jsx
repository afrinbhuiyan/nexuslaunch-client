import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FiExternalLink, FiCheck, FiX, FiStar, FiClock, FiRefreshCw } from "react-icons/fi";

const ProductReviewQueue = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'featured', 'non-featured'
  const [searchTerm, setSearchTerm] = useState("");
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/api/products/pending");
      setPendingProducts(res.data);
    } catch (err) {
      console.error("Error fetching pending products", err);
      Swal.fire({
        title: "Error",
        text: "Failed to load pending products",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (productId, status) => {
    const action = status.toLowerCase();
    const result = await Swal.fire({
      title: "Confirm Action",
      text: `You are about to ${action} this product. This action cannot be undone.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#ef4444",
      confirmButtonText: `Confirm ${action}`,
      background: "#1f2937",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`/api/products/${productId}`, {
          status: action,
          ...(action === "rejected" && { isFeatured: false }),
        });

        Swal.fire({
          title: "Success!",
          text: `Product has been ${action}d.`,
          icon: "success",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
        
        setPendingProducts((prev) => prev.filter((p) => p._id !== productId));
      } catch (err) {
        console.error(`${action} failed`, err);
        Swal.fire({
          title: "Error",
          text: `Failed to ${action} product`,
          icon: "error",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  const handleFeatureToggle = async (productId, currentStatus) => {
    try {
      await axios.patch(`/api/products/${productId}/feature`, {
        isFeatured: !currentStatus,
      });

      setPendingProducts((prev) =>
        prev.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: !currentStatus }
            : product
        )
      );

      Swal.fire({
        title: "Success!",
        text: `Product ${!currentStatus ? "featured" : "unfeatured"}`,
        icon: "success",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
    } catch (err) {
      console.error("Feature toggle failed:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to update featured status",
        icon: "error",
        background: "#1f2937",
        color: "#fff",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const filteredProducts = pendingProducts.filter((product) => {
    // Apply search filter
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesFilter = filter === "all" || 
                        (filter === "featured" && product.isFeatured) || 
                        (filter === "non-featured" && !product.isFeatured);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FiClock className="mr-3 text-blue-500" />
            Product Review Queue
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Review and approve pending product submissions
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Products</option>
            <option value="featured">Featured Only</option>
            <option value="non-featured">Non-Featured</option>
          </select>
          
          <button
            onClick={fetchPendingProducts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {pendingProducts.length === 0 ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="text-blue-500 dark:text-blue-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
            All caught up!
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            There are no pending products to review at this time.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                          <img
                            className="h-full w-full object-cover"
                            src={product.image}
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/150?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {product.name}
                            </h4>
                            {product.isFeatured && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full flex items-center">
                                <FiStar className="mr-1" size={12} />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>Submitted: {new Date(product.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === "pending"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          target="_blank"
                        >
                          <FiExternalLink className="mr-1.5" size={14} />
                          Preview
                        </Link>
                        
                        <button
                          onClick={() => handleFeatureToggle(product._id, product.isFeatured)}
                          className={`px-3 py-1.5 rounded-lg flex items-center transition-colors ${
                            product.isFeatured
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          <FiStar className="mr-1.5" size={14} />
                          {product.isFeatured ? "Unfeature" : "Feature"}
                        </button>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(product._id, "Approved")}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                          >
                            <FiCheck className="mr-1.5" size={14} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(product._id, "Rejected")}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                          >
                            <FiX className="mr-1.5" size={14} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && pendingProducts.length > 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No products match your current filters.
            </div>
          )}
          
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{pendingProducts.length}</span> pending products
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewQueue;