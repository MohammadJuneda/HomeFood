const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleWare");

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// UPDATE PROFILE
router.put("/update-profile", protect, updateProfile);

module.exports = router;