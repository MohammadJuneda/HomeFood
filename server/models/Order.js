const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  buyerName: String,

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // ✅ ADD THIS
  sellerPhone: String,

  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
  },

  foodName: String,

  price: Number,

  quantity: Number,

  image: String,

  status: {
    type: String,
    default: "Pending",
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "UPI"],
    default: "COD",
  },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending",
  },

  address: {
    fullName: String,
    phone: String,
    city: String,
    pincode: String,
    addressLine: String,
  },

},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Order", orderSchema);