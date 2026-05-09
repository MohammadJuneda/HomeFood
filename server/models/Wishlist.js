const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicates
wishlistSchema.index({ userId: 1, foodId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);