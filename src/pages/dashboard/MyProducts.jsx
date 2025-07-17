import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiXCircle, FiPlus, FiBox, FiChevronDown } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import UpdateProductModal from "../../components/products/UpdateProductModal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyProducts = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axiosSecure
        .get(`/api/products/by-user/${user.email}`)
        .then((res) => {
          setProducts(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch products", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user, axiosSecure]);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.patch(
        `/api/products/id/${selectedProduct._id}`,
        updatedData
      );
      const updated = res.data;

      if (updated.modifiedCount > 0) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === selectedProduct._id ? { ...p, ...updatedData } : p
          )
        );
        Swal.fire({
          title: "Success!",
          text: "Product updated successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }

      setSelectedProduct(null);
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire("Error!", "Failed to update product", "error");
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "This will permanently remove your product",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/products/${id}`);
          setProducts(products.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Product removed successfully", "success");
        } catch (error) {
          console.error("Delete failed", error);
          Swal.fire("Error!", "Failed to delete product", "error");
        }
      }
    });
  };

  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    return product.status === filter;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case "Accepted":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            <FiCheckCircle className="mr-1" />
            {status}
          </span>
        );
      case "Rejected":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            <FiXCircle className="mr-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            <FiClock className="mr-1" />
            {status || "Pending"}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
          <p className="text-gray-600 mt-1">Manage your product submissions</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Products</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <FiChevronDown className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <Link
            to="/add-product"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner border border-gray-200 mb-4">
            <FiBox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="mt-2 text-xl font-medium text-gray-900">
            {filter === "all" ? "No products found" : `No ${filter.toLowerCase()} products`}
          </h3>
          <p className="mt-2 text-gray-600">
            {filter === "all"
              ? "You haven't posted any products yet."
              : `You don't have any products with ${filter.toLowerCase()} status.`}
          </p>
          <Link
            to="/add-product"
            className="mt-4 inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium"
          >
            <FiPlus className="mr-2 w-4 h-4" />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Votes
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FiBox className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{product.upvotes || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(product.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(product.updatedAt || product.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-purple-600 hover:text-purple-900 p-1.5 rounded-md hover:bg-purple-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MyProducts;