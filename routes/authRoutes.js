const express = require("express");
const router = express.Router();

const { signup, signin } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateSignup, validateSignin } = require("../middleware/validateAuth");

// Signup with validation
router.post("/signup", validateSignup, signup);

// Signin with validation (optional but recommended)
router.post("/signin", validateSignin, signin);

// Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
});

module.exports = router;
