import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    pincode: "",
    addressLine: "",
  });

  const [editAddress, setEditAddress] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ LOAD DATA (FIXED)
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const savedAddress = localStorage.getItem(`address_${user?._id}`);
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
      setEditAddress(false);
    }
  }, []);

  const updateCart = (data) => {
    setCart(data);
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const increaseQty = (id) => {
    const newCart = cart.map((item) => {
      if (item._id === id) {
        if (item.quantity >= item.stock) {
          toast.error(`Only ${item.stock} available`);
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updateCart(newCart);
  };

  const decreaseQty = (id) => {
    const newCart = cart.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(newCart);
  };

  const removeItem = (id) => {
    updateCart(cart.filter((i) => i._id !== id));
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  // ✅ SAVE ADDRESS (FIXED)
  const saveAddress = () => {
    if (
      !address.fullName ||
      !address.phone ||
      !address.city ||
      !address.pincode ||
      !address.addressLine
    ) {
      return toast.error("Fill all fields");
    }

    localStorage.setItem(
      `address_${user._id}`,
      JSON.stringify(address)
    );

    toast.success("Address saved");
    setEditAddress(false);
  };

  // ✅ PLACE ORDER
  const placeOrders = async () => {
    try {
      for (let item of cart) {
        await axios.post("/orders", {
          buyerId: user._id,
          buyerName: user.name,
          sellerId: item.sellerId || item.seller,

          foodId: item._id,
          foodName: item.name,
          image: item.image,

          price: item.price,
          quantity: item.quantity,

          paymentMethod,
          paymentStatus:
            paymentMethod === "UPI" ? "Paid" : "Pending",

          address,
        });
      }

      localStorage.removeItem("cart");
      setCart([]);
      toast.success("Order placed");
      navigate("/orders");

    } catch {
      toast.error("Error placing order");
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error("Cart empty");
    if (editAddress) return toast.error("Save address first");

    if (paymentMethod === "UPI") {
      const ok = window.confirm("Payment done?");
      if (!ok) return;
    }

    await placeOrders();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 grid md:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="md:col-span-2">

        <h1 className="text-2xl font-bold mb-4">Your Cart 🛒</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          cart.map((item) => (
            <div key={item._id} className="flex gap-4 bg-white shadow rounded p-4 mb-4">

              <img src={item.image} className="w-24 h-24 object-cover rounded" />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-orange-500 font-bold">₹ {item.price}</p>

                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => decreaseQty(item._id)} className="px-2 bg-gray-200 rounded">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id)} className="px-2 bg-gray-200 rounded">+</button>
                </div>
              </div>

              <button onClick={() => removeItem(item._id)} className="text-red-500">
                Remove
              </button>
            </div>
          ))
        )}

        
        {/* ADDRESS */}
<div className="mt-6">
  <h2 className="font-bold mb-3 text-lg">Delivery Address</h2>

  {!editAddress ? (
    <div className="bg-gray-100 p-4 rounded shadow-sm space-y-1">
      <p><span className="font-semibold">Name:</span> {address.fullName}</p>
      <p><span className="font-semibold">Phone:</span> {address.phone}</p>
      <p><span className="font-semibold">Address:</span> {address.addressLine}</p>
      <p><span className="font-semibold">City:</span> {address.city}</p>
      <p><span className="font-semibold">Pincode:</span> {address.pincode}</p>

      <button
        onClick={() => setEditAddress(true)}
        className="text-blue-500 mt-2 hover:underline"
      >
        Change Address
      </button>
    </div>
  ) : (
    <div className="grid gap-3 bg-white p-4 rounded shadow">

      {/* NAME */}
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Enter your name"
          value={address.fullName}
          onChange={(e) =>
            setAddress({ ...address, fullName: e.target.value })
          }
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="text-sm font-medium">Phone Number</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Enter phone number"
          value={address.phone}
          onChange={(e) =>
            setAddress({ ...address, phone: e.target.value })
          }
        />
      </div>

      {/* ADDRESS */}
      <div>
        <label className="text-sm font-medium">Full Address</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Street / Area"
          value={address.addressLine}
          onChange={(e) =>
            setAddress({ ...address, addressLine: e.target.value })
          }
        />
      </div>

      {/* CITY */}
      <div>
        <label className="text-sm font-medium">City</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="City"
          value={address.city}
          onChange={(e) =>
            setAddress({ ...address, city: e.target.value })
          }
        />
      </div>

      {/* PINCODE */}
      <div>
        <label className="text-sm font-medium">Pincode</label>
        <input
          className="border p-2 w-full rounded"
          placeholder="Pincode"
          value={address.pincode}
          onChange={(e) =>
            setAddress({ ...address, pincode: e.target.value })
          }
        />
      </div>

      <button
        onClick={saveAddress}
        className="bg-green-500 text-white px-4 py-2 rounded w-fit hover:bg-green-600"
      >
        Save Address
      </button>
    </div>
  )}
</div>

      </div>

      {/* RIGHT */}
      <div className="bg-white shadow rounded p-4 h-fit sticky top-20">

        <h2 className="font-bold mb-3">Order Summary</h2>

        <p className="flex justify-between">
          <span>Total Items</span>
          <span>{cart.length}</span>
        </p>

        <p className="flex justify-between mt-2 font-bold">
          <span>Total</span>
          <span>₹ {total}</span>
        </p>

        {/* PAYMENT */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Payment</h3>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
          </select>

          {/* ✅ UPI QR BACK */}
          {paymentMethod === "UPI" && (
            <div className="mt-4 text-center bg-gray-50 p-3 rounded">
              <p className="font-medium mb-2">Scan & Pay</p>
              <img src="/upi-qr.png" className="w-36 mx-auto" />
              <p className="text-xs text-gray-500 mt-2">
                Demo payment
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white w-full py-2 mt-5 rounded"
        >
          Checkout
        </button>

      </div>
    </div>
  );
};

export default Cart;