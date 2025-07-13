import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import { Link } from "react-router-dom";

const ProductReviewQueue = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const res = await axios.get("/api/products/pending");
      setPendingProducts(res.data);
    } catch (err) {
      console.error("Error fetching pending products", err);
      Swal.fire("Error", "Failed to load pending products", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (productId, status) => {
    const action = status.toLowerCase();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${action} this product?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`/api/products/${productId}`, {
          status: action,
          ...(action === "rejected" && { isFeatured: false }), // Unfeature if rejected
        });
        
        Swal.fire("Success!", `Product ${action}d.`, "success");
        setPendingProducts(prev => prev.filter(p => p._id !== productId));
      } catch (err) {
        console.error(`${action} failed`, err);
        Swal.fire("Error", `Failed to ${action} product`, "error");
      }
    }
  };

  const handleFeatureToggle = async (productId, currentStatus) => {
    try {
      await axios.patch(`/api/products/${productId}/feature`, {
        isFeatured: !currentStatus
      });
      
      setPendingProducts(prev => 
        prev.map(product => 
          product._id === productId 
            ? { ...product, isFeatured: !currentStatus }
            : product
        )
      );
      
      Swal.fire(
        "Success!",
        `Product ${!currentStatus ? "featured" : "unfeatured"}`,
        "success"
      );
    } catch (err) {
      console.error("Feature toggle failed:", err);
      Swal.fire("Error", "Failed to update featured status", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">🕵️ Product Review Queue</h2>

      {pendingProducts.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-800">No pending products to review.</p>
          <Link 
            to="/products" 
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View all products
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleFeatureToggle(product._id, product.isFeatured)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        product.isFeatured
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {product.isFeatured ? "★ Featured" : "Make Featured"}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="inline-flex items-center px-3 py-1 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleStatusUpdate(product._id, "Approved")}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(product._id, "Rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Reject
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

export default ProductReviewQueue;