const Food = require("../models/Food");
const Order = require("../models/Order");
const Review = require("../models/Review");
const mongoose = require("mongoose");

// ================= FOOD =================

// ADD FOOD
exports.addFood = async (req, res) => {
  try {

    const food = await Food.create({
      ...req.body,

      seller: req.user._id,

      // ✅ ADD THIS
      sellerPhone: req.user.phone || "",
    });

    res.json(food);

  } catch (err) {

    res.status(500).json({
      message: "Error adding food",
    });

  }
};

// GET ALL FOODS
exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("seller", "name");
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching foods" });
  }
};

// GET MY FOODS
exports.getMyFoods = async (req, res) => {
  try {
    const foods = await Food.find({ seller: req.user._id });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my foods" });
  }
};

// GET SINGLE FOOD
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Error fetching food" });
  }
};

// UPDATE FOOD
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Not found" });

    if (food.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(food, req.body);
    await food.save();

    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Error updating food" });
  }
};

// DELETE FOOD
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Not found" });

    if (food.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await food.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting food" });
  }
};

// ================= ORDER =================

// 🔥 CREATE ORDER WITH STOCK CHECK
exports.createOrder = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    // ✅ ADD THIS (validation)
    if (!foodId || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.stock < quantity) {
      return res.status(400).json({
        message: `Only ${food.stock} items available`,
      });
    }

    food.stock -= quantity;
    await food.save();

    const order = await Order.create({
      foodId: food._id,
      foodName: food.name,
      price: food.price,
      image: food.image || "",
      quantity,
      buyerId: req.user._id,
      sellerId: food.seller,
      status: "Pending",
    });

    res.json(order);

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
};

// GET MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      buyerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// GET SELLER ORDERS
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    const orders = await Order.find({
      sellerId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching seller orders" });
  }
};

// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
};

// ================= REVIEW =================

exports.addReview = async (req, res) => {
  try {
    const { foodId, rating, comment, userName } = req.body;

    // ✅ ADD THIS (review restriction)
    const hasOrdered = await Order.findOne({
      buyerId: req.user._id,
      foodId,
      status: "Delivered",
    });

    if (!hasOrdered) {
      return res.status(400).json({
        message: "You can review only after delivery",
      });
    }

    const existing = await Review.findOne({
      userId: req.user._id,
      foodId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      userId: req.user._id,
      foodId,
      userName,
      rating,
      comment,
    });

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Review failed" });
  }
};

// UPDATE STOCK (SELLER)
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    // ✅ ADD THIS (negative check)
    if (stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food not found" });

    if (food.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    food.stock = stock;
    await food.save();

    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Stock update failed" });
  }
};

// GET REVIEWS
exports.getFoodReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      foodId: req.params.id,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};