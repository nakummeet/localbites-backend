const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  createRestaurant,
} = require("../controllers/restaurantController");


// OWNER → create restaurant
router.post(
  "/",
  authMiddleware,
  roleMiddleware("owner"),
  createRestaurant
);

module.exports = router;

