import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const FoodCard = ({ food }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // ⭐ FETCH REVIEWS
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/food/reviews/${food._id}`);
        const reviews = res.data;

        if (reviews.length > 0) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating(total / reviews.length);
          setReviewCount(reviews.length);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchReviews();
  }, [food._id]);

  // ❤️ CHECK IF IN WISHLIST (FROM BACKEND)
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const res = await axios.get("/wishlist");

        const exists = res.data.some(
          (item) => item.foodId?._id === food._id
        );

        setIsWishlisted(exists);
      } catch (err) {
        console.log(err);
      }
    };

    checkWishlist();
  }, [food._id]);

  // ❤️ TOGGLE WISHLIST (BACKEND)
  const toggleWishlist = async () => {
    try {
      await axios.post("/wishlist", { foodId: food._id });

      setIsWishlisted(!isWishlisted);

      toast.success(
        isWishlisted ? "Removed from wishlist" : "Added to wishlist"
      );
    } catch (err) {
      console.log(err);
      toast.error("Login required");
    }
  };

  // 🛒 ADD TO CART (KEEP SAME)
  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === food._id);

    if (exists) {
      toast.error("Already in cart");
      return;
    }

    cart.push({
      ...food,
      quantity: 1,
      stock: food.stock,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">

      <Link to={`/food/${food._id}`}>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-40 object-cover"
        />
      </Link>

      <div className="p-3">
        <h2 className="font-semibold text-lg">{food.name}</h2>

        <p className="text-sm text-gray-500 line-clamp-2">
          {food.description}
        </p>

        {/* ⭐ RATING */}
        <div className="flex items-center gap-1 mt-1">
          {reviewCount > 0 ? (
            <>
              <span className="text-yellow-500">⭐</span>
              <span>{avgRating.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">
                ({reviewCount})
              </span>
            </>
          ) : (
            <span className="text-gray-400 text-xs">
              No reviews
            </span>
          )}
        </div>

        <p className="text-orange-500 font-bold mt-1">
          ₹ {food.price}
        </p>

        {/* ❌ OUT OF STOCK */}
        {food.stock === 0 && (
          <p className="text-red-500 text-sm mt-1">
            Out of Stock
          </p>
        )}

        <div className="flex justify-between mt-3">

          {/* ❤️ WISHLIST */}
          <button onClick={toggleWishlist}>
            {isWishlisted ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </button>

          {/* 🛒 CART */}
          <button
            onClick={addToCart}
            disabled={food.stock === 0}
            className={`px-3 py-1 rounded ${
              food.stock === 0
                ? "bg-gray-400"
                : "bg-green-500 text-white"
            }`}
          >
            {food.stock === 0 ? "Out" : "Add"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default FoodCard;