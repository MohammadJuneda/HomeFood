const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleWare");

const {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  cancelOrder,
  getSellerStats,
} = require("../controllers/orderController");

// 🛒 place order
router.post("/", protect, placeOrder);

// 📊 seller dashboard
router.get("/seller-stats", protect, getSellerStats);

// 👤 customer orders
router.get("/my", protect, getMyOrders);

// 🧑‍🍳 seller orders
router.get("/seller", protect, getSellerOrders);

// 🔄 update status
router.put("/:id", protect, updateOrderStatus);

// ❌ cancel
router.delete("/:id", protect, cancelOrder);

module.exports = router;