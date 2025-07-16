import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import PostReviewForm from "../../components/products/PostReviewForm";

const ProductDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          axiosSecure.get(`/api/products/${id}`),
          axiosSecure.get(`/api/reviews?productId=${id}`),
        ]);

        setProduct(productRes.data.product);
        setReviews(reviewRes.data);
      } catch (error) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, axiosSecure]);

  const handleVote = async () => {
    if (!user) return toast.error("Please login to vote");

    if (product.owner?.email === user.email) {
      return toast.error("You cannot vote for your own product");
    }

    if (product.voters?.includes(user.email)) {
      return toast.error("You have already voted");
    }

    try {
      const res = await axiosSecure.patch(`/api/products/vote/${id}`, {
        email: user.email,
      });

      if (res.data.success) {
        toast.success("Thanks for voting!");
        setProduct((prev) => ({
          ...prev,
          upvotes: prev.upvotes + 1,
          voters: [...(prev.voters || []), user.email],
        }));
      }
    } catch {
      toast.error("Voting failed.");
    }
  };

  const handleReport = async () => {
    if (!user) return toast.error("Please login to report");

    if (product.owner?.email === user.email) {
      return toast.error("You cannot report your own product");
    }

    if (product.reports?.some((r) => r.reporterId === user.uid)) {
      return toast.error("You have already reported this product");
    }

    try {
      const report = {
        productId: id,
        reporterId: user.uid,
        reason: "Inappropriate content",
        timestamp: new Date(),
      };

      await axiosSecure.post("/api/reports", report);

      toast.success("Product reported");
      setProduct((prev) => ({
        ...prev,
        reports: [...(prev.reports || []), report],
      }));
    } catch {
      toast.error("Failed to report");
    }
  };

  const hasVoted = product?.voters?.includes(user?.email);
  const hasReported = product?.reports?.some((r) => r.reporterId === user?.uid);
  const isOwner = product?.owner?.email === user?.email;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!product)
    return (
      <p className="text-center py-20 text-red-500 text-xl">
        Product not found
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Header */}
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/2">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square shadow-lg">
            <img
              src={product.product?.image || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
            {product.isFeatured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                Featured Product
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleVote}
                disabled={!user || hasVoted || isOwner}
                className={`flex items-center space-x-1 px-3 py-2 rounded-full ${
                  !user || hasVoted || isOwner
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                <span className="text-lg">🔥</span>
                <span>{product.upvotes}</span>
              </button>
              <button
                onClick={handleReport}
                disabled={!user || hasReported || isOwner}
                className={`flex items-center space-x-1 px-3 py-2 rounded-full ${
                  !user || hasReported || isOwner
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                <span className="text-lg">⚠️</span>
                <span>{product.reports?.length || 0}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(product.tags || []).map((tag, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            {product.description}
          </p>

          {product.externalLink && (
            <a
              href={product.externalLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              Visit Official Website
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === "reviews"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-12">
        {activeTab === "details" && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">About This Product</h3>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features?.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  )) || <li className="text-gray-500">No features listed</li>}
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">
                  Specifications
                </h4>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category</dt>
                    <dd className="text-gray-900 font-medium">
                      {product.category || "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Status</dt>
                    <dd className="text-gray-900 font-medium">
                      {product.status || "Active"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Created</dt>
                    <dd className="text-gray-900 font-medium">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Customer Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-700">
                    {reviews.length > 0
                      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) /
                        reviews.length
                      : 0}{" "}
                    out of 5
                  </span>
                </div>
                <span className="text-gray-500">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start">
                      <img
                        src={review.reviewerImage}
                        alt={review.reviewerName}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.reviewerName}
                            </h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-3 text-gray-700">
                          {review.reviewDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No reviews yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Be the first to share your thoughts about this product!
                </p>
              </div>
            )}

            <div className="mt-10">
              <PostReviewForm
                productId={id}
                onReviewAdded={(newReview) =>
                  setReviews((prev) => [...prev, newReview])
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
