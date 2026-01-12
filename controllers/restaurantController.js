const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const apiResponse = require("../utils/apiResponse");

// CREATE RESTAURANT
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
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

// GET ALL / SEARCH RESTAURANTS
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
    return apiResponse.error(res, "Server error", 500);
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
};
