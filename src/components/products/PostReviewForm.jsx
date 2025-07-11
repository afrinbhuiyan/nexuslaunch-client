import React, { useState } from "react";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PostReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !description) {
      return toast.error("Please fill all fields");
    }

    const review = {
      productId,
      reviewerName: user.displayName,
      reviewerImage: user.photoURL,
      reviewDescription: description,
      rating: parseFloat(rating),
      timestamp: new Date(),
    };

    try {
      const res = await axiosSecure.post("/api/reviews", review);
      toast.success("Review submitted!");
      onReviewAdded(res.data);
      setDescription("");
      setRating(0);
    } catch {
      toast.error("Failed to post review.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 border p-4 rounded space-y-4">
      <h3 className="text-lg font-semibold">Post a Review</h3>
      <div>
        <label className="block text-sm">Your Name</label>
        <input
          type="text"
          value={user.displayName}
          readOnly
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Your Photo URL</label>
        <input
          type="text"
          value={user.photoURL}
          readOnly
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Rating (1 to 5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm">Review</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  );
};

export default PostReviewForm;