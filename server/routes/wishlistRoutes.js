const express = require("express");
const router = express.Router();

const {
  toggleWishlist,
  getWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleWare");

router.post("/", protect, toggleWishlist);
router.get("/", protect, getWishlist);

module.exports = router;