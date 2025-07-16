import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiArrowUp,
  FiExternalLink,
  FiHeart,
  FiUser,
  FiStar,
  FiFilter,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import bgPattern from "../../assets/page-title.png";

const AllProducts = () => {
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 6;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", search, page],
    queryFn: async () => {
      const res = await axios.get(
        `/api/products?search=${search}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const handleUpvote = async (product) => {
    if (!user) return navigate("/login");

    if (product.owner.email === user.email) {
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

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      rotateX: -15,
      scale: 0.4,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-[#6055f2]">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundSize: "600px",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 justify-center h-16 items-center">
              <h1 className="text-3xl font-bold text-white">Products List</h1>

              {/* Navigation with improved contrast */}
              <nav className="flex space-x-8 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Link
                  to="/"
                  className="text-white/80 hover:text-white font-medium transition-colors duration-200"
                >
                  HOME
                </Link>
                <Link
                  to="/products-list"
                  className="text-white font-medium relative"
                >
                  PRODUCTS LIST
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-5 border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="relative flex-1 group">
              <div className="absolute left-3 top-3.5 text-gray-400">
                <FiSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder=" "
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none peer"
              />
              <label className="absolute left-9 top-2.5 text-sm text-gray-500 peer-focus:text-indigo-500 peer-focus:text-xs peer-focus:-translate-y-3 peer-placeholder-shown:translate-y-0 transition-all duration-200 pointer-events-none">
                Search products...
              </label>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-full p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-full ${
                    viewMode === "grid"
                      ? "bg-white shadow-xs text-indigo-600"
                      : "text-gray-500 hover:text-indigo-500"
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-full ${
                    viewMode === "list"
                      ? "bg-white shadow-xs text-indigo-600"
                      : "text-gray-500 hover:text-indigo-500"
                  }`}
                >
                  <FiList />
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm"
              >
                <FiFilter />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{data?.total || 0} items</span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              } gap-8`}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white bg-opacity-60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5"></div>
                    <div className="flex flex-wrap gap-2">
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/4"></div>
                      <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/4"></div>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-32"></div>
                      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : data?.products?.length === 0 ? (
            <div className="text-center text-gray-500 text-lg mt-20">
              No products found.
            </div>
          ) : (
            <motion.div
              key="products"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`grid ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              } gap-6`}
            >
              {data?.products?.map((product) => (
                <motion.div
                  key={product._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative h-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 group-hover:shadow-md transition-all duration-300">
                    {/* Image section */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {product.featured && (
                          <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm">
                            <FiStar className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full shadow-sm">
                          {product.category}
                        </span>
                      </div>

                      {/* Quick actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products/${product._id}`);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-indigo-50 text-indigo-600 transition-colors"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                          <FiHeart className="w-3.5 h-3.5 text-rose-500" />
                          <span className="text-xs font-medium text-gray-700">
                            {product.upvotes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content section */}
                    <div className="p-5">
                      <h3
                        className="text-lg font-bold text-gray-900 line-clamp-1 mb-2 hover:text-indigo-600 cursor-pointer"
                        onClick={() => navigate(`/products/${product._id}`)}
                      >
                        {product.name}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {product.tags?.slice(0, 3).map((tag, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearch(tag);
                              setPage(1);
                            }}
                            className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-100 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/profile/${product.owner.uid}`);
                          }}
                          className="inline-flex items-center text-sm text-gray-600 hover:text-indigo-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 overflow-hidden">
                            {product.owner.photoURL ? (
                              <img
                                src={product.owner.photoURL}
                                alt={product.owner.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiUser className="text-indigo-600" />
                            )}
                          </div>
                          <span className="truncate max-w-[100px]">
                            {product.owner.name}
                          </span>
                        </button>

                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpvote(product);
                          }}
                          disabled={
                            user?.email === product.owner.email ||
                            product.voters?.includes(user?.email)
                          }
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            user?.email === product.owner.email ||
                            product.voters?.includes(user?.email)
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                          }`}
                        >
                          <FiArrowUp className="mr-1.5" />
                          Upvote
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 flex justify-center"
          >
            <nav className="flex items-center gap-1">
              {/* First Page Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(1)}
                disabled={page === 1}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                }`}
              >
                <FiChevronLeft className="mr-1" />
                First
              </motion.button>

              {/* Previous Page Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                }`}
              >
                <FiChevronLeft className="w-4 h-4" />
              </motion.button>

              {/* Page Numbers - Smart Pagination */}
              {(() => {
                const buttons = [];
                const maxVisiblePages = 5;
                let startPage, endPage;

                if (totalPages <= maxVisiblePages) {
                  startPage = 1;
                  endPage = totalPages;
                } else {
                  const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
                  const maxPagesAfterCurrent =
                    Math.ceil(maxVisiblePages / 2) - 1;

                  if (page <= maxPagesBeforeCurrent) {
                    startPage = 1;
                    endPage = maxVisiblePages;
                  } else if (page + maxPagesAfterCurrent >= totalPages) {
                    startPage = totalPages - maxVisiblePages + 1;
                    endPage = totalPages;
                  } else {
                    startPage = page - maxPagesBeforeCurrent;
                    endPage = page + maxPagesAfterCurrent;
                  }
                }

                // First page + ellipsis if needed
                if (startPage > 1) {
                  buttons.push(
                    <motion.button
                      key={1}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(1)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === 1
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                      }`}
                    >
                      1
                    </motion.button>
                  );

                  if (startPage > 2) {
                    buttons.push(
                      <span key="start-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                }

                // Page numbers
                for (let i = startPage; i <= endPage; i++) {
                  buttons.push(
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(i)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === i
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                      }`}
                    >
                      {i}
                    </motion.button>
                  );
                }

                // Last page + ellipsis if needed
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    buttons.push(
                      <span key="end-ellipsis" className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }

                  buttons.push(
                    <motion.button
                      key={totalPages}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPage(totalPages)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === totalPages
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                      }`}
                    >
                      {totalPages}
                    </motion.button>
                  );
                }

                return buttons;
              })()}

              {/* Next Page Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                }`}
              >
                <FiChevronRight className="w-4 h-4" />
              </motion.button>

              {/* Last Page Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium flex items-center ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm"
                }`}
              >
                Last
                <FiChevronRight className="ml-1" />
              </motion.button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
