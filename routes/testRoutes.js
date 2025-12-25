const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/owner-only",
  authMiddleware,
  roleMiddleware("owner"),
  (req, res) => {
    res.json({
      message: "Welcome owner!",
      user: req.user,
    });
  }
);

module.exports = router;
