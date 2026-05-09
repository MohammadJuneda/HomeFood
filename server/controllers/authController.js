const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ✅ REGISTER
exports.registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,
      phone,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
    });

    res.status(201).json({
      message: "Registered successfully",
      user,
      token: generateToken(user._id),
    });

  } catch (error) {

    console.log("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ LOGIN
exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ✅ UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // update fields
    user.name = req.body.name || user.name;

    user.phone = req.body.phone || user.phone;

    // IMPORTANT
    // using save() triggers bcrypt hashing
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile updated",
      user: updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};