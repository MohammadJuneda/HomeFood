const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const paymentRoutes = require("./routes/paymentRoutes");
const app = express(); // ✅ FIRST create app

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/payment", paymentRoutes);
// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/food", require("./routes/foodRoutes")); // ✅ ONLY ONCE
app.use("/api/orders", require("./routes/orderRoutes"));

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});