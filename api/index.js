const express = require("express");
const connectDB = require("../config/db");

const app = express();

connectDB();

app.use(express.json());

const authRoutes = require("../routes/authRoutes");
const restaurantRoutes = require("../routes/restaurantRoutes");
const foodRoutes = require("../routes/foodRoutes");
const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("LocalBites Backend is Running 🚀");
});

module.exports = app;
