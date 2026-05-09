import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await axios.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (foodId) => {
    try {
      await axios.post("/wishlist", { foodId }); // toggle remove
      fetchWishlist();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* 🔥 TITLE */}
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>

      {/* ❌ EMPTY STATE */}
      {items.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-4">
            Your wishlist is empty 😔
          </p>
          <button
            onClick={() => navigate("/food")}
            className="bg-[#5F8FA3] text-white px-5 py-2 rounded"
          >
            Browse Foods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {items.map((item) => {
            const food = item.foodId;

            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >

                {/* IMAGE */}
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-40 object-cover"
                />

                {/* CONTENT */}
                <div className="p-3">

                  <h2 className="font-semibold text-lg truncate">
                    {food.name}
                  </h2>

                  <p className="text-[#5F8FA3] font-bold mt-1">
                    ₹ {food.price}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={() => navigate(`/food/${food._id}`)}
                      className="flex-1 bg-[#5F8FA3] text-white py-1 rounded text-sm"
                    >
                      View
                    </button>

                    <button
                      onClick={() => removeItem(food._id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded text-sm"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default Wishlist;