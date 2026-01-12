const express = require("express");
const connectDB = require("../config/db");

const app = express();
app.use(express.json());

// 🔐 CONNECT DB BEFORE ANY ROUTE
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", require("../routes/authRoutes"));
app.use("/api/restaurants", require("../routes/restaurantRoutes"));
app.use("/api/foods", require("../routes/foodRoutes"));
app.use("/api/cart", require("../routes/cartRoutes"));
app.use("/api/orders", require("../routes/orderRoutes"));
app.use("/api/users", require("./routes/userRoutes"));


app.get("/", (req, res) => {
  res.send("LocalBites Backend is Running 🚀");
});

module.exports = app;
