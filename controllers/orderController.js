const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const apiResponse = require("../utils/apiResponse");

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.items.length === 0) {
      return apiResponse.error(res, "Cart is empty", 400);
    }

    // Populate food to get restaurant
    await cart.populate("items.food");

    const restaurantId = cart.items[0].food.restaurant;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 404);
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurant._id,
      items: cart.items.map((item) => ({
        food: item.food._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "confirmed",
    });

    cart.items = [];
    await cart.save();

    return apiResponse.success(
      res,
      "Order placed successfully",
      order,
      201
    );
  } catch (error) {
    console.error("Create order error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return apiResponse.success(
      res,
      "Orders fetched successfully",
      orders
    );
  } catch (error) {
    console.error("Get my orders error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};


exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const orders = await Order.find({
      restaurant: restaurant._id,
    }).sort({ createdAt: -1 });

    return apiResponse.success(
      res,
      "Restaurant orders fetched successfully",
      orders
    );
  } catch (error) {
    console.error("Get restaurant orders error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return apiResponse.error(res, "Invalid order status", 400);
    }

    const restaurant = await Restaurant.findOne({
      owner: req.user.id,
    });

    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const order = await Order.findOne({
      _id: orderId,
      restaurant: restaurant._id,
    });

    if (!order) {
      return apiResponse.error(res, "Order not found", 404);
    }

    order.status = status;
    await order.save();

    return apiResponse.success(
      res,
      "Order status updated successfully",
      order
    );
  } catch (error) {
    console.error("Update order status error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};
