const express = require("express");
const router = express.Router();

const {
  addFood,
  getFoodsByRestaurant,
  updateFood,
  deleteFood,
  toggleFoodAvailability,
} = require("../controllers/foodController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ➕ ADD FOOD
router.post(
  "/",
  auth,
  role("owner"),
  addFood
);

// 📥 GET FOODS BY RESTAURANT (PUBLIC)
router.get(
  "/restaurant/:id",
  getFoodsByRestaurant
);

// ✏️ UPDATE FOOD  ✅ THIS WAS MISSING
router.put(
  "/:id",
  auth,
  role("owner"),
  updateFood
);

// 🗑️ DELETE FOOD
router.delete(
  "/:id",
  auth,
  role("owner"),
  deleteFood
);

// 🔄 TOGGLE AVAILABILITY
router.patch(
  "/:id/toggle",
  auth,
  role("owner"),
  toggleFoodAvailability
);

module.exports = router;
