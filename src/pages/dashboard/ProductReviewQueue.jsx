import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";

const ProductReviewQueue = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("/api/products/pending")
      .then((res) => setPendingProducts(res.data))
      .catch((err) => console.error("Error fetching pending products", err))
      .finally(() => setLoading(false));
  }, [axios]);

  const handleStatusUpdate = async (productId, status) => {
  const confirmText =
    status === "Accepted" ? "approve this product" : "reject this product";

  const result = await Swal.fire({
    title: `Are you sure?`,
    text: `You want to ${confirmText}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${status.toLowerCase()} it!`,
  });

  if (result.isConfirmed) {
    try {
      await axios.patch(`/api/products/${productId}`, { status }); // ✅ use status directly
      Swal.fire("Updated!", `Product ${status.toLowerCase()}ed.`, "success");
      setPendingProducts(pendingProducts.filter((p) => p._id !== productId)); // ✅ correct variable
    } catch (err) {
      console.error(`${status} failed`, err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  }
};


  if (loading) return <p>Loading pending products...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">🕵️ Product Review Queue</h2>

      {pendingProducts.length === 0 ? (
        <p>No pending products to review.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Submitted By</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProducts.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-3">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.description?.slice(0, 50)}...
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <p>{product.owner?.displayName || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">{product.owner?.email}</p>
                  </td>
                  <td className="p-3">
                    {new Date(product.timestamp).toLocaleDateString()}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(product._id, "Accepted")}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(product._id, "Rejected")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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
