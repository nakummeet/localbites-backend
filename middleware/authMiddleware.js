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

    // 🔥 FIX IS HERE
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return apiResponse.error(res, "User not found", 401);
    }

    next();
  } catch (error) {
    return apiResponse.error(res, "Invalid token", 401);
  }
};

module.exports = authMiddleware;
