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

  useEffect(() => {
    // Get product details
    axiosSecure.get(`/api/products/${id}`).then((res) => setProduct(res.data));
    // Get reviews for this product
    axiosSecure.get(`/api/reviews?productId=${id}`).then((res) =>
      setReviews(res.data)
    );
  }, [id, axiosSecure]);

  const handleVote = async () => {
    try {
      const res = await axiosSecure.patch(`/api/products/vote/${id}`, {
        email: user?.email,
      });

      if (res.data.success) {
        toast.success("Thanks for voting!");
        setProduct((prev) => ({
          ...prev,
          upvotes: prev.upvotes + 1,
          voters: [...(prev.voters || []), user.email],
        }));
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Voting failed.");
    }
  };

  const handleReport = async () => {
    try {
      await axiosSecure.post("/api/reports", {
        productId: id,
        reporter: user.email,
        timestamp: new Date(),
      });
      toast.success("Product reported.");
    } catch {
      toast.error("Failed to report product.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {product && (
        <>
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg" />
          <h2 className="text-3xl font-bold mt-4">{product.name}</h2>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <div className="my-2 flex gap-2 flex-wrap">
            {product.tags.map((tag, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>
          {product.externalLinks && (
            <a
              href={product.externalLinks}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Visit Website
            </a>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleVote}
              disabled={product.voters?.includes(user?.email)}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              🔥 {product.upvotes} Upvotes
            </button>

            <button
              onClick={handleReport}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              🚩 Report
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
                      <p className="text-yellow-500">⭐ {review.rating}</p>
                    </div>
                  </div>
                  <p className="mt-2">{review.reviewDescription}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No reviews yet.</p>
          )}

          {/* Post Review */}
          <PostReviewForm productId={id} onReviewAdded={(r) => setReviews([...reviews, r])} />
        </>
      )}
    </div>
  );
};

export default ProductDetails;
