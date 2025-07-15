import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllProducts = () => {
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      const res = await axios.get(`/api/products?search=${search}`);
      return res.data;
    },
  });

  const handleUpvote = async (product) => {
    if (!user) {
      return navigate("/login");
    }

    if (product.owner.uid === user.uid) {
      return toast.error("You cannot upvote your own product.");
    }

    try {
      await axiosSecure.patch(`/api/products/vote/${product._id}`, {
        email: user?.email,
      });
      toast.success("Thanks for your vote!");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Already voted");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6">All Products</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border p-2 rounded"
        />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="h-40 object-contain mx-auto mb-4"
              />
              <h3
                className="text-xl font-semibold mb-2 hover:underline cursor-pointer"
                onClick={() => navigate(`/products/${product._id}`)}
              >
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleUpvote(product)}
                disabled={
                  user?.uid === product.owner.uid ||
                  product.voters?.includes(user?.uid)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                🔺 {product.upvotes}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
