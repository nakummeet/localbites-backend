const express = require("express");

const connectDB = require("../config/db");

const authRoutes = require("../routes/authRoutes");
const restaurantRoutes = require("../routes/restaurantRoutes");
const foodRoutes = require("../routes/foodRoutes");
const cartRoutes = require("../routes/cartRoutes");
const orderRoutes = require("../routes/orderRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("LocalBites Backend is Running 🚀");
});

connectDB();

module.exports = app; 
