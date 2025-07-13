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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          axiosSecure.get(`/api/products/${id}`),
          axiosSecure.get(`/api/reviews?productId=${id}`),
        ]);

        setProduct(productRes.data.product); // ⚠️ note .product from your backend
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

    // check if user already reported
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!product)
    return <p className="text-center py-10 text-red-500">Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <img
        src={product.product?.image || product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded-lg"
      />

      <div className="flex items-center mt-4">
        <h2 className="text-3xl font-bold">{product.name}</h2>
        {product.isFeatured && (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs ml-2">
            ★ Featured
          </span>
        )}
      </div>

      <p className="mt-2 text-gray-700">{product.description}</p>

      <div className="my-2 flex gap-2 flex-wrap">
        {(product.tags || []).map((tag, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>

      {product.externalLink && (
        <a
          href={product.externalLink}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Visit Website
        </a>
      )}

      <div className="mt-4 flex gap-3 flex-wrap">
        <button
          onClick={handleVote}
          disabled={!user || hasVoted || isOwner}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            !user || hasVoted || isOwner
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          🔥 {product.upvotes} Upvotes
        </button>

        <button
          onClick={handleReport}
          disabled={!user || hasReported || isOwner}
          className={`bg-red-500 text-white px-4 py-2 rounded ${
            !user || hasReported || isOwner
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-600"
          }`}
        >
          🚩 Report ({product.reports?.length || 0})
        </button>
      </div>

      {/* Reviews Section */}
      <h3 className="text-xl font-semibold mt-10 mb-4">Reviews</h3>
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded">
              <div className="flex items-center gap-3">
                <img
                  src={review.reviewerImage}
                  alt={review.reviewerName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{review.reviewerName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">⭐ {review.rating}</span>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-2">{review.reviewDescription}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      )}

      {/* Post Review */}
      <PostReviewForm
        productId={id}
        onReviewAdded={(newReview) =>
          setReviews((prev) => [...prev, newReview])
        }
      />
    </div>
  );
};

export default ProductDetails;
