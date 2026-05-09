import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/seller");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/orders/${id}`, { status });

      toast.success(`Order ${status}`);
      fetchOrders();

      if (selectedOrder?._id === id) {
        setSelectedOrder({
          ...selectedOrder,
          status,
        });
      }

    } catch {
      toast.error("Update failed");
    }
  };

  // ================= DASHBOARD STATS =================

  // ✅ total order documents
  const totalOrders = orders.length;

  // ✅ total quantity sold
  const totalItemsSold = orders.reduce(
    (sum, order) => sum + order.quantity,
    0
  );

  // ✅ pending
  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  // ✅ delivered
  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  // ✅ revenue
  const revenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

  return (
    <div className="max-w-7xl mx-auto p-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-8">
        Orders Received 
      </h1>

      {/* ================= DASHBOARD STATS ================= */}

      <div className="grid md:grid-cols-5 gap-4 mb-8">

        {/* TOTAL ORDERS */}
        <div className="bg-white shadow rounded-2xl p-5 border">
          <h3 className="text-gray-500 text-sm">
            Total Orders
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalOrders}
          </p>
        </div>

        {/* ITEMS SOLD */}
        <div className="bg-purple-50 shadow rounded-2xl p-5 border">
          <h3 className="text-purple-700 text-sm">
            Items Sold
          </h3>

          <p className="text-3xl font-bold mt-2 text-purple-700">
            {totalItemsSold}
          </p>
        </div>

        {/* PENDING */}
        <div className="bg-yellow-50 shadow rounded-2xl p-5 border">
          <h3 className="text-yellow-700 text-sm">
            Pending Orders
          </h3>

          <p className="text-3xl font-bold mt-2 text-yellow-700">
            {pendingOrders}
          </p>
        </div>

        {/* DELIVERED */}
        <div className="bg-green-50 shadow rounded-2xl p-5 border">
          <h3 className="text-green-700 text-sm">
            Delivered Orders
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-700">
            {deliveredOrders}
          </p>
        </div>

        {/* REVENUE */}
        <div className="bg-blue-50 shadow rounded-2xl p-5 border">
          <h3 className="text-blue-700 text-sm">
            Revenue
          </h3>

          <p className="text-3xl font-bold mt-2 text-blue-700">
            ₹ {revenue}
          </p>
        </div>

      </div>

      {/* ================= ORDERS GRID ================= */}

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition duration-300 overflow-hidden border"
            >

              {/* IMAGE */}
              <img
                src={order.image}
                alt={order.foodName}
                className="w-full h-52 object-cover cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              />

              {/* CONTENT */}
              <div className="p-4">

                {/* TOP */}
                <div className="flex justify-between items-center">

                  <h2 className="text-xl font-bold">
                    {order.foodName}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Accepted"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* PRICE */}
                <p className="text-orange-500 font-bold text-lg mt-2">
                  ₹ {order.price}
                </p>

                {/* ORDER INFO */}
                <div className="mt-3 flex justify-between items-center">

                  <div>
                    <p className="text-sm text-gray-500">
                      Qty: {order.quantity}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">

                    <p className="text-sm font-semibold">
                      {order.paymentMethod}
                    </p>

                    <p
                      className={`text-sm font-semibold mt-1 ${
                        order.paymentStatus === "Paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {order.paymentStatus}
                    </p>

                  </div>

                </div>

                {/* BUTTONS */}
                <div className="mt-4">

                  {order.status === "Pending" && (

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          updateStatus(order._id, "Accepted")
                        }
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(order._id, "Rejected")
                        }
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                      >
                        Reject
                      </button>

                    </div>
                  )}

                  {order.status === "Accepted" && (

                    <button
                      onClick={() =>
                        updateStatus(order._id, "Delivered")
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                    >
                      Mark Delivered
                    </button>

                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full border mt-2 py-2 rounded-lg hover:bg-gray-100"
                  >
                    View Details
                  </button>

                </div>

              </div>
            </div>

          ))}
        </div>
      )}

      {/* ================= MODAL ================= */}

      {selectedOrder && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">

            {/* IMAGE */}
            <img
              src={selectedOrder.image}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">

              {/* TOP */}
              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">
                  {selectedOrder.foodName}
                </h2>

                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    selectedOrder.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : selectedOrder.status === "Accepted"
                      ? "bg-blue-100 text-blue-700"
                      : selectedOrder.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {selectedOrder.status}
                </span>

              </div>

              {/* PRICE */}
              <p className="text-orange-500 font-bold text-xl mt-2">
                ₹ {selectedOrder.price}
              </p>

              {/* CUSTOMER DETAILS */}
              <div className="mt-6 space-y-3">

                <p>
                  <span className="font-semibold">
                    Customer:
                  </span>{" "}
                  {selectedOrder.address?.fullName}
                </p>

                <p>
                  <span className="font-semibold">
                    Phone:
                  </span>{" "}
                  {selectedOrder.address?.phone}
                </p>

                <p>
                  <span className="font-semibold">
                    Address:
                  </span>{" "}
                  {selectedOrder.address?.addressLine}
                </p>

                <p>
                  <span className="font-semibold">
                    City:
                  </span>{" "}
                  {selectedOrder.address?.city}
                </p>

                <p>
                  <span className="font-semibold">
                    Pincode:
                  </span>{" "}
                  {selectedOrder.address?.pincode}
                </p>

                <p>
                  <span className="font-semibold">
                    Quantity:
                  </span>{" "}
                  {selectedOrder.quantity}
                </p>

                <p>
                  <span className="font-semibold">
                    Payment Method:
                  </span>{" "}
                  {selectedOrder.paymentMethod}
                </p>

                <p>
                  <span className="font-semibold">
                    Payment Status:
                  </span>{" "}

                  <span
                    className={
                      selectedOrder.paymentStatus === "Paid"
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">
                    Ordered On:
                  </span>{" "}
                  {new Date(
                    selectedOrder.createdAt
                  ).toLocaleString()}
                </p>

              </div>

              {/* CLOSE */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;