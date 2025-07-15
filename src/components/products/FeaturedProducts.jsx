import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaFireAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const [voted, setVoted] = useState([]);
  console.log(products);
  useEffect(() => {
    axios
      .get("/api/products/featured")
      .then((res) => {
        setProducts(res.data);
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load featured products.");
      });
  }, [axios]);

  const handleVote = async (productId) => {
    if (!user) {
      return navigate("/login");
    }

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
              ? { ...product, upvotes: product.upvotes + 1 }
              : product
          )
        );
        setVoted((prev) => [...prev, productId]);
      } else {
        toast.error(res.data.message || "Voting failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Voting failed.");
    }
  };

  return (
    <div className="my-10 px-4 md:px-10 max-w-6xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-700">
        🚀 Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isOwner = user?.email === product.owner?.email;
          const hasVoted = voted.includes(product._id);

          return (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:shadow-xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <Link
                  to={`/products/${product._id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {product.name}
                </Link>
                <div className="flex flex-wrap gap-2 my-2">
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleVote(product._id)}
                  disabled={isOwner || hasVoted}
                  className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium w-full justify-center transition ${
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
    </div>
  );
};

export default FeaturedProducts;
