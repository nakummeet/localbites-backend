const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const restaurantController = require("../controllers/restaurantController");

// ================= PUBLIC =================
// Get all restaurants (search supported)
router.get("/", restaurantController.getAllRestaurants);

// ================= OWNER =================
// Create restaurant (owner only)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  restaurantController.createRestaurant
);

// Get my restaurant (owner only)
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("owner"),
  restaurantController.getMyRestaurant
);

module.exports = router;
