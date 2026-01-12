const User = require("../models/User");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const Food = require("../models/Food");
const apiResponse = require("../utils/apiResponse");

// GET logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    return apiResponse.success(
      res,
      "User profile fetched successfully",
      req.user
    );
  } catch (error) {
    return apiResponse.error(res, "Server error", 500);
  }
};


// GET user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return apiResponse.error(res, "User not found", 404);
    }

    return apiResponse.success(res, "User fetched successfully", user);
  } catch (error) {
    return apiResponse.error(res, "Invalid user ID", 400);
  }
};

// DELETE own account
exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Cleanup
    await Cart.deleteOne({ user: userId });
    await Restaurant.deleteOne({ owner: userId });
    await Food.deleteMany({ owner: userId });

    await User.findByIdAndDelete(userId);

    return apiResponse.success(
      res,
      "Account deleted successfully"
    );
  } catch (error) {
    return apiResponse.error(res, "Server error", 500);
  }
};
