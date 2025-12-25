const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartController");

const auth = require("../middleware/authMiddleware");

// USER CART ROUTES
router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.put("/update", auth, updateCart);
router.delete("/remove/:foodId", auth, removeFromCart);

module.exports = router;
