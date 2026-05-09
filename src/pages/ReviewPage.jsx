import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const ReviewPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment) {
      return toast.error("Please write a review");
    }

    try {
      setLoading(true);

      await axios.post("/food/review", {
        foodId,
        userName: user?.name,
        rating,
        comment,
      }); // ✅ FIXED (removed headers)

      toast.success("Review submitted successfully");

      navigate("/orders"); // ✅ FIXED
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-4 text-center">
          Give Review
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">Rating:</label>

            <div className="flex gap-2 text-3xl justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded-lg p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ReviewPage;