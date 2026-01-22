const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");

/* ================= CREATE RESTAURANT ================= */
// POST /api/restaurants
const createRestaurant = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return apiResponse.error(
        res,
        "Restaurant name and address are required",
        400
      );
    }

    if (req.user.role !== "owner") {
      return apiResponse.error(res, "Access denied", 403);
    }

    const ownerId = req.user.id;

    // Owner can have only ONE restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: ownerId });
    if (existingRestaurant) {
      return apiResponse.error(
        res,
        "Owner already has a restaurant",
        409
      );
    }

    const restaurant = await Restaurant.create({
      name,
      address,
      owner: ownerId,
    });

    // Link restaurant to user
    await User.findByIdAndUpdate(ownerId, {
      restaurant: restaurant._id,
    });

    return apiResponse.success(
      res,
      "Restaurant created successfully",
      restaurant,
      201
    );
  } catch (error) {
    console.error("Create restaurant error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};

/* ================= GET ALL RESTAURANTS ================= */
// GET /api/restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const restaurants = await Restaurant.find(filter);

    return apiResponse.success(
      res,
      "Restaurants fetched successfully",
      restaurants
    );
  } catch (error) {
    console.error("Get all restaurants error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};

/* ================= GET MY RESTAURANT ================= */
// GET /api/restaurants/me
const getMyRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const restaurant = await Restaurant.findOne({ owner: ownerId });

    return apiResponse.success(
      res,
      "Fetched my restaurant",
      restaurant
    );
  } catch (error) {
    console.error("Get my restaurant error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};

/* ================= EXPORTS ================= */
module.exports = {
  createRestaurant,
  getAllRestaurants,
  getMyRestaurant,
};
