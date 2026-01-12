const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  getUserById,
  deleteMyAccount,
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// Get own profile
router.get("/me", auth, getMyProfile);

// Delete own account
router.delete("/me", auth, deleteMyAccount);

// Admin: get user by ID
router.get("/:id", auth, role("admin"), getUserById);

module.exports = router;
