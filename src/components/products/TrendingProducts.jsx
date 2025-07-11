import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFireAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const [voted, setVoted] = useState([]);

  console.log(products);

  useEffect(() => {
    axiosSecure
      .get("/api/products/trending")
      .then((res) => {
        console.log("Trending products:", res.data); // Log the data
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error loading trending products:", err.response?.data);
        toast.error("Failed to load trending products");
      });
  }, [axiosSecure]);

  const handleVote = async (productId) => {
    if (!user) return navigate("/login");

    if (voted.includes(productId)) {
      return toast("You already voted on this product");
    }

    try {
      const res = await axiosSecure.patch(`/api/products/vote/${productId}`, {
        email: user?.email,
      });

      if (res.data.success) {
        toast.success("Thanks for voting!");
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? {
                  ...product,
                  upvotes: product.upvotes + 1,
                  voters: [...(product.voters || []), user.email],
                }
              : product
          )
        );
        setVoted((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Voting failed.");
    }
  };

  return (
    <div className="my-10 px-4 md:px-10 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-orange-600">
        🔥 Trending Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const isOwner = user?.email === product.owner?.email;
          const hasVoted = voted.includes(product._id);

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <Link
                  to={`/products/${product._id}`}
                  className="text-lg font-semibold text-blue-700 hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex flex-wrap gap-2 my-2">
                  {product.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleVote(product._id)}
                  disabled={isOwner || hasVoted}
                  className={`mt-3 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium w-full transition ${
                    isOwner || hasVoted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <FaFireAlt />
                  {product.upvotes} Upvotes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show All Products Button */}
      <div className="mt-8 text-center">
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
        >
          Show All Products
        </Link>
      </div>
    </div>
  );
};

export default TrendingProducts;
