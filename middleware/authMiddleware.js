const jwt = require("jsonwebtoken");
const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return apiResponse.error(res, "No token provided", 401);
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ ALWAYS LOAD FULL USER (no partial selects)
    const user = await User.findById(decoded.id);

    if (!user) {
      return apiResponse.error(res, "User not found", 401);
    }

    // 🔥 HARD GUARD: OWNER MUST HAVE RESTAURANT
    if (user.role === "owner" && !user.restaurant) {
      return apiResponse.error(
        res,
        "Owner account has no restaurant linked",
        403
      );
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return apiResponse.error(res, "Invalid token", 401);
  }
};

module.exports = authMiddleware;
