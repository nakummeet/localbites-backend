const express = require("express");
const router = express.Router();
const foodController = require("../controllers/foodController");

const {
  addFood,
  getFoodsByRestaurant,
} = require("../controllers/foodController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


router.post(
  "/",
  auth,
  role("owner"),
  addFood
);


router.get(
  "/restaurant/:id",
  getFoodsByRestaurant
);

module.exports = router;
