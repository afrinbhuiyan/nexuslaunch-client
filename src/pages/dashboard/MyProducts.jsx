import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import UpdateProductModal from "../../components/products/UpdateProductModal"; // adjust path if needed

const MyProducts = () => {
  const { user } = useAuth();
  const axios = useAxios();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // ⭐

  // Fetch user's products
  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axios
        .get(`/api/products/user/${user.email}`)
        .then((res) => {
          setProducts(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Failed to fetch products", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user, axios]);

  // ⭐ Update product function passed to modal
  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.patch(`/api/products/${selectedProduct._id}`, updatedData);
      const updated = res.data;

      if (updated.modifiedCount > 0) {
        // Replace the updated product in the state
        setProducts((prev) =>
          prev.map((p) => (p._id === selectedProduct._id ? { ...p, ...updatedData } : p))
        );
      }

      setSelectedProduct(null); // close modal
    } catch (err) {
      console.error("Update failed:", err);
      throw err;
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/products/${id}`);
          setProducts(products.filter((item) => item._id !== id));
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          console.error("Delete failed", error);
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">My Products</h2>

      {products.length === 0 ? (
        <p>You have not posted any products yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Votes</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.upvotes || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        product.status === "Accepted"
                          ? "bg-green-600"
                          : product.status === "Rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }`}
                    >
                      {product.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
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

      {/* ✅ Modal for Updating */}
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
