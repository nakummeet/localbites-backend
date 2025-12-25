const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const apiResponse = require("../utils/apiResponse");

const addFood = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || price === undefined) {
      return apiResponse.error(res, "Food name and price are required", 400);
    }

    if (price <= 0) {
      return apiResponse.error(res, "Price must be greater than zero", 400);
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return apiResponse.error(res, "You do not own a restaurant", 403);
    }

    const food = await Food.create({
      name,
      description,
      price,
      image,
      restaurant: restaurant._id,
    });

    return apiResponse.success(res, "Food added successfully", food, 201);
  } catch (error) {
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

const getFoodsByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.id,
      isAvailable: true,
    });

    return apiResponse.success(res, "Foods fetched successfully", foods);
  } catch (error) {
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};


const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const food = await Food.findById(id);
    if (!food) {
      return apiResponse.error(res, "Food not found", 404);
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || food.restaurant.toString() !== restaurant._id.toString()) {
      return apiResponse.error(res, "Access denied", 403);
    }

    if (price !== undefined && price <= 0) {
      return apiResponse.error(res, "Invalid price", 400);
    }

    food.name = name ?? food.name;
    food.description = description ?? food.description;
    food.price = price ?? food.price;
    food.image = image ?? food.image;

    await food.save();

    return apiResponse.success(res, "Food updated successfully", food);
  } catch (error) {
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};


const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return apiResponse.error(res, "Food not found", 404);
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || food.restaurant.toString() !== restaurant._id.toString()) {
      return apiResponse.error(res, "Access denied", 403);
    }

    await food.deleteOne();

    return apiResponse.success(res, "Food deleted successfully");
  } catch (error) {
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

const toggleFoodAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      return apiResponse.error(res, "Food not found", 404);
    }

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant || food.restaurant.toString() !== restaurant._id.toString()) {
      return apiResponse.error(res, "Access denied", 403);
    }

    food.isAvailable = !food.isAvailable;
    await food.save();

    return apiResponse.success(
      res,
      `Food marked as ${food.isAvailable ? "available" : "unavailable"}`,
      food
    );
  } catch (error) {
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

module.exports = {
  addFood,
  getFoodsByRestaurant,
  updateFood,
  deleteFood,
  toggleFoodAvailability,
};
