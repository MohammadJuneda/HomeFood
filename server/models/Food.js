const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // ✅ ADD THIS
  sellerPhone: {
    type: String,
    default: "",
  },

},
{
  timestamps: true,
}
);

module.exports = mongoose.model("Food", foodSchema);