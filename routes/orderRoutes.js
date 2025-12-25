const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


// Place / confirm order
router.post("/place", auth, createOrder);

// Get logged-in user's orders
router.get("/my", auth, getMyOrders);


// Get orders for owner's restaurant
router.get("/restaurant", auth, role("owner"), getRestaurantOrders);

// Update order status (owner only)
router.put("/:id/status", auth, role("owner"), updateOrderStatus);

module.exports = router;
