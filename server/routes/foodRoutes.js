const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleWare");

const {
  addFood,
  getFoods,
  deleteFood,
  getMyFoods,
  getFoodById,
  updateFood,
  addReview,
  getFoodReviews,

  // 🔥 IMPORT THESE
  createOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require("../controllers/foodController");

// ================= ORDER =================

// ✅ CREATE ORDER
router.post("/order", protect, createOrder);

// ✅ GET MY ORDERS
router.get("/my-orders", protect, getMyOrders);

// ✅ SELLER ORDERS
router.get("/seller-orders", protect, getSellerOrders);

// ✅ UPDATE ORDER STATUS
router.put("/order/:id", protect, updateOrderStatus);


// ================= REVIEW =================
router.post("/review", protect, addReview);
router.get("/reviews/:id", getFoodReviews);


// ================= FOOD =================
router.get("/", getFoods);
router.post("/", protect, addFood);
router.get("/myfoods", protect, getMyFoods);


// 🔴 ALWAYS KEEP THIS LAST
router.get("/:id", getFoodById);

router.put("/:id", protect, updateFood);
router.delete("/:id", protect, deleteFood);

module.exports = router;