import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PostReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      return toast.error("Please select a rating");
    }
    if (!description.trim()) {
      return toast.error("Please write your review");
    }

    const review = {
      productId,
      reviewerName: user.displayName,
      reviewerImage: user.photoURL,
      reviewDescription: description.trim(),
      rating: parseFloat(rating),
      timestamp: new Date(),
    };

    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/api/reviews", review);
      toast.success("Thank you for your review!");
      onReviewAdded(res.data);
      setDescription("");
      setRating(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Share Your Experience</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* User Info (readonly) */}
        <div className="flex items-center space-x-4">
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt={user.displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="font-medium text-gray-800">{user.displayName}</p>
            <p className="text-sm text-gray-500">Posting a public review</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Your Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <svg
                  className={`w-8 h-8 ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label htmlFor="review" className="block text-sm font-medium text-gray-700">
            Your Review
          </label>
          <textarea
            id="review"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share details about your experience with this product..."
          />
          <p className="text-xs text-gray-500">
            Minimum 20 characters (currently {description.length})
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !rating || description.length < 20}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting || !rating || description.length < 20
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>

      {/* Review Guidelines */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-800">Review Guidelines</h4>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li className="flex items-start">
            <svg className="h-3 w-3 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Focus on the product and your experience
          </li>
          <li className="flex items-start">
            <svg className="h-3 w-3 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Be honest and specific
          </li>
          <li className="flex items-start">
            <svg className="h-3 w-3 text-green-500 mr-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Avoid personal information
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PostReviewForm;