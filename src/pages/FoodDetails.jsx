import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFood();
    fetchReviews();
  }, [id]);

  // ✅ FETCH FOOD + RELATED
  const fetchFood = async () => {
    try {
      const res = await axios.get(`/food/${id}`);
      setFood(res.data);

      const allFoods = await axios.get("/food");

      const filtered = allFoods.data.filter(
        (item) =>
          item.category === res.data.category &&
          item._id !== res.data._id
      );

      setRelated(filtered.slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  // ⭐ FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/food/reviews/${id}`);
      setReviews(res.data);

      if (res.data.length > 0) {
        const avg =
          res.data.reduce((sum, r) => sum + r.rating, 0) /
          res.data.length;

        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 🛒 ADD TO CART
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === food._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: 1,
        stock: food.stock,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart 🛒");
  };

  // ✅ BUY NOW (FIXED — NO RAZORPAY)
  const handleBuyNow = () => {
    const cart = [];

    cart.push({
      _id: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      quantity: 1,
      stock: food.stock,
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    toast.success("Proceed to checkout 🛒");
    navigate("/cart");
  };

  if (!food) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PRODUCT */}
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={food.image}
          className="w-full h-80 object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold">{food.name}</h1>

          <p className="text-yellow-500 mt-1">
            ⭐ {avgRating ? avgRating : "No ratings"}
          </p>

          <p className="text-gray-600 mt-2">{food.description}</p>

          <p className="text-sm text-gray-500 mt-2">
            Category: {food.category}
          </p>

          <p className="text-sm text-gray-500">
            Quantity: {food.quantity} {food.unit}
          </p>

          <h2 className="text-2xl text-orange-500 mt-4 font-bold">
            ₹ {food.price}
          </h2>

          {/* OUT OF STOCK */}
          {food.stock === 0 && (
            <p className="text-red-500 mt-2 font-semibold">
              Out of Stock
            </p>
          )}

          <div className="mt-4 space-y-2">

            {/* ✅ FIXED BUY NOW */}
            <button
              onClick={handleBuyNow}
              disabled={food.stock === 0}
              className={`w-full py-2 ${
                food.stock === 0
                  ? "bg-gray-400"
                  : "bg-orange-500 text-white"
              }`}
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              disabled={food.stock === 0}
              className={`w-full py-2 ${
                food.stock === 0
                  ? "bg-gray-400"
                  : "bg-gray-700 text-white"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Customer Reviews
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{r.userName}</p>
                <p className="text-yellow-500">⭐ {r.rating}</p>
                <p className="text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RELATED */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          You may also like 👇
        </h2>

        {related.length === 0 ? (
          <p className="text-gray-500">No related foods</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link
                to={`/food/${item._id}`}
                key={item._id}
                className="bg-white rounded-xl shadow hover:shadow-lg"
              >
                <img
                  src={item.image}
                  className="w-full h-40 object-cover"
                />

                <div className="p-3">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-orange-500">₹ {item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default FoodDetails;