import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFireAlt,
  FaChartLine,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const [voted, setVoted] = useState([]);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    axios
      .get("/api/products/trending")
      .then((res) => {
        const fetchedProducts = res.data;

        // Mark already voted products
        if (user) {
          const alreadyVoted = fetchedProducts
            .filter((p) => p.voters?.includes(user.email))
            .map((p) => p._id);
          setVoted(alreadyVoted);
        }

        setProducts(fetchedProducts);
      })
      .catch((err) => {
        console.error("Error loading trending products:", err.response?.data);
        toast.error("Failed to load trending products");
      });
  }, [axios, user]);

  const handleVote = async (productId) => {
    if (!user) return navigate("/login");

    if (voted.includes(productId)) {
      return toast("You already voted on this product");
    }

    try {
      const res = await axiosSecure.patch(`/api/products/vote/${productId}`, {
        email: user.email,
      });

      if (res.data.success) {
        toast.success("Thanks for voting!");
        setVoted((prev) => [...prev, productId]);
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
      }
    } catch (err) {
      console.error(err);
      toast.error("Voting failed.");
    }
  };

  const handleSave = (productId) => {
    if (!user) return navigate("/login");

    setSaved((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="my-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#766df4] to-[#958ef4]"
        >
          <FaChartLine className="inline mr-3 mb-1" />
          Trending Now
          <FaFireAlt className="inline ml-3 mb-1" />
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-600 max-w-2xl mx-auto"
        >
          Discover what the community is buzzing about this week
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => {
          const isOwner = user?.email === product.owner?.email;
          const hasVoted = voted.includes(product._id);
          const isSaved = saved.includes(product._id);

          return (
            <motion.div
              key={product._id}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl border border-gray-100 relative group"
            >
              {/* Glowing Border */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  boxShadow: `0 0 0 2px #766df4`,
                  zIndex: -1,
                }}
              ></div>

              {/* Trending Badge */}
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center bg-gradient-to-r from-[#766df4] to-[#958ef4] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  <FaChartLine className="mr-1" />
                  Trending
                </div>
              </div>

              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleSave(product._id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition"
                  aria-label={isSaved ? "Unsave product" : "Save product"}
                >
                  {isSaved ? (
                    <FaBookmark className="text-[#766df4]" />
                  ) : (
                    <FaRegBookmark className="text-gray-600 hover:text-[#766df4]" />
                  )}
                </button>
              </div>

              <div className="p-5">
                <Link
                  to={`/products/${product._id}`}
                  className="block text-lg font-bold text-gray-800 hover:text-[#766df4] transition mb-2 line-clamp-2"
                >
                  {product.name}
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {product.description || "No description available"}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-[#766df4]/10 text-[#766df4] rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden mr-2">
                      {product.owner?.photo ? (
                        <img
                          src={product.owner.photo}
                          alt={product.owner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#766df4] text-white flex items-center justify-center">
                          {product.owner?.name?.charAt(0) || "U"}
                        </div>
                      )}
                    </span>
                    {product.owner?.name || "Unknown"}
                  </div>

                  <button
                    onClick={() => handleVote(product._id)}
                    disabled={isOwner || hasVoted}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
                      isOwner || hasVoted
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#766df4] to-[#958ef4] text-white hover:shadow-lg hover:shadow-[#766df4]/30"
                    }`}
                  >
                    <FaFireAlt
                      className={`${
                        hasVoted ? "text-[#766df4]" : "text-white"
                      }`}
                    />
                    <span>{product.upvotes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {products.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-[#766df4] to-[#958ef4] hover:from-[#655be3] hover:to-[#847de3] transition-all hover:shadow-lg hover:shadow-[#766df4]/30"
          >
            Explore All Products
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrendingProducts;
