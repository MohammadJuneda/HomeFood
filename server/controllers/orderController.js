const Order = require("../models/Order");
const Food = require("../models/Food");

// ✅ PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {

    const {
      foodId,
      quantity,
      paymentMethod,
      address,
    } = req.body;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    // ✅ STOCK CHECK
    if (food.stock < quantity) {
      return res.status(400).json({
        message: "Out of stock",
      });
    }

    // ✅ CREATE ORDER
    const order = await Order.create({

      // BUYER
      buyerId: req.user._id,
      buyerName: req.user.name,

      // SELLER
      sellerId: food.seller,

      // ✅ SELLER PHONE
      sellerPhone: food.sellerPhone || "",

      // FOOD
      foodId: food._id,
      foodName: food.name,

      price: food.price,
      quantity,

      image: food.image,

      // PAYMENT
      paymentMethod,

      paymentStatus:
        paymentMethod === "UPI"
          ? "Paid"
          : "Pending",

      // ADDRESS
      address,

      // ORDER STATUS
      status: "Pending",
    });

    // ✅ REDUCE STOCK
    food.stock -= quantity;

    await food.save();

    res.json(order);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Order failed",
    });

  }
};

// ✅ CUSTOMER ORDERS
exports.getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      buyerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch {

    res.status(500).json({
      message: "Error fetching orders",
    });
  }
};

// ✅ SELLER ORDERS
exports.getSellerOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      sellerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);

  } catch {

    res.status(500).json({
      message: "Error fetching seller orders",
    });
  }
};

// ✅ UPDATE STATUS
exports.updateOrderStatus = async (req, res) => {

  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.sellerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    order.status = status;

    // ✅ COD becomes paid after delivery
    if (
      status === "Delivered" &&
      order.paymentMethod === "COD"
    ) {
      order.paymentStatus = "Paid";
    }

    await order.save();

    res.json(order);

  } catch {

    res.status(500).json({
      message: "Update failed",
    });
  }
};

// ✅ SELLER STATS
exports.getSellerStats = async (req, res) => {

  try {

    const orders = await Order.find({
      sellerId: req.user._id,
      status: "Delivered",
      paymentStatus: "Paid",
    });

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + order.price * order.quantity,
      0
    );

    res.json({
      totalOrders,
      totalRevenue,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching stats",
    });
  }
};

// ❌ CANCEL ORDER
exports.cancelOrder = async (req, res) => {

  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // ✅ ONLY BUYER CAN CANCEL
    if (
      order.buyerId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    // ✅ ONLY PENDING ORDERS
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Cannot cancel now",
      });
    }

    // ✅ RESTORE STOCK
    const food = await Food.findById(
      order.foodId
    );

    if (food) {
      food.stock += order.quantity;
      await food.save();
    }

    await order.deleteOne();

    res.json({
      message: "Order cancelled",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Cancel failed",
    });
  }
};