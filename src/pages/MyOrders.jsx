import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🎯 STATUS STYLE
  const getStatusStyle = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Accepted") return "bg-blue-100 text-blue-700";
    if (status === "Out for Delivery") return "bg-purple-100 text-purple-700";
    if (status === "Delivered") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-600";
  };

  // 🔥 STEP MAPPING
  const getStep = (status) => {
    if (status === "Pending") return 0;
    if (status === "Accepted") return 1;
    if (status === "Out for Delivery") return 2;
    if (status === "Delivered") return 3;
    return 0;
  };

  // ❌ CANCEL ORDER
  const cancelOrder = async (id) => {
    try {
      await axios.delete(`/orders/${id}`);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  // 🔁 REORDER
  const reorder = (order) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exists = cart.find((item) => item._id === order.foodId);

    if (exists) {
      toast.error("Already in cart");
      return;
    }

    cart.push({
      _id: order.foodId,
      name: order.foodName,
      price: order.price,
      image: order.image,
      quantity: 1,
      stock: 10, // safe fallback
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders yet</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="flex gap-4 bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <img
                src={order.image}
                className="w-28 h-28 object-cover rounded-lg"
              />

              {/* DETAILS */}
              <div className="flex-1">

                {/* TOP */}
                <div className="flex justify-between items-start">
                  <h2 className="font-bold text-lg">
                    {order.foodName}
                  </h2>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <p className="text-orange-500 font-semibold mt-1">
                  ₹ {order.price}
                </p>

                <p className="text-sm text-gray-600">
                  Payment: {order.paymentMethod} ({order.paymentStatus})
                </p>

                {/* 🔥 ORDER TRACKING */}
                <div className="flex items-center mt-3 text-xs">
                  {["Placed", "Accepted", "Out", "Delivered"].map((step, i) => (
                    <div key={i} className="flex items-center w-full">

                      <div
                        className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-[10px]
                        ${i <= getStep(order.status) ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        {i + 1}
                      </div>

                      {i < 3 && (
                        <div
                          className={`flex-1 h-[2px]
                          ${i < getStep(order.status) ? "bg-green-500" : "bg-gray-300"}`}
                        />
                      )}

                    </div>
                  ))}
                </div>

                {/* ADDRESS */}
               <p className="text-xs text-gray-500 mt-2">
  {order.address?.city}, {order.address?.pincode}
</p>

<p className="text-xs text-gray-500 mt-1">
  Seller Contact: {order.sellerPhone || "Not Available"}
</p>

                {/* DATE */}
                <p className="text-xs text-gray-400 mt-1">
                  Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                </p>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-3 flex-wrap">

                  {order.status === "Delivered" && (
                    <button
                      onClick={() => navigate(`/review/${order.foodId}`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Review
                    </button>
                  )}

                  {order.status === "Pending" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => reorder(order)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Reorder
                  </button>

                  <button
                    onClick={() => navigate(`/food/${order.foodId}`)}
                    className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                  >
                    View Product
                  </button>

                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;