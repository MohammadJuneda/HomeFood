const Wishlist = require("../models/Wishlist");

// ❤️ ADD / REMOVE
exports.toggleWishlist = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({ message: "Food ID required" });
    }

    const existing = await Wishlist.findOne({
      userId: req.user._id,
      foodId,
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ message: "Removed from wishlist" });
    }

    await Wishlist.create({
      userId: req.user._id,
      foodId,
    });

    res.json({ message: "Added to wishlist" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

// 📄 GET USER WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({
      userId: req.user._id,
    }).populate("foodId");

    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};