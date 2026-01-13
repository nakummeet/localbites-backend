const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const apiResponse = require("../utils/apiResponse");

/* -------------------------------------------------------
   CREATE ORDER (USER)
------------------------------------------------------- */
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food"
    );

    if (!cart || cart.items.length === 0) {
      return apiResponse.error(res, "Cart is empty", 400);
    }

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
      status: "pending", // ✅ IMPORTANT
    });

    cart.items = [];
    await cart.save();

    return apiResponse.success(res, "Order placed", order, 201);
  } catch (err) {
    console.error(err);
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};

/* -------------------------------------------------------
   USER: GET MY ORDERS (HISTORY)
------------------------------------------------------- */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return apiResponse.success(res, "Orders fetched", orders);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: GET RESTAURANT ORDERS
------------------------------------------------------- */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const orders = await Order.find({
      restaurant: restaurant._id,
    }).sort({ createdAt: -1 });

    return apiResponse.success(res, "Restaurant orders fetched", orders);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: ACCEPT ORDER
------------------------------------------------------- */
exports.acceptOrder = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: restaurant._id,
      status: "pending",
    });

    if (!order) {
      return apiResponse.error(
        res,
        "Order not found or already processed",
        404
      );
    }

    order.status = "accepted";
    await order.save();

    return apiResponse.success(res, "Order accepted", order);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: REJECT ORDER
------------------------------------------------------- */
exports.rejectOrder = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: restaurant._id,
      status: "pending",
    });

    if (!order) {
      return apiResponse.error(
        res,
        "Order not found or already processed",
        404
      );
    }

    order.status = "rejected";
    await order.save();

    return apiResponse.success(res, "Order rejected", order);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: UPDATE ORDER STATUS (AFTER ACCEPT)
------------------------------------------------------- */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedTransitions = {
      accepted: ["preparing"],
      preparing: ["delivered"],
    };

    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) {
      return apiResponse.error(res, "Restaurant not found", 403);
    }

    const order = await Order.findOne({
      _id: req.params.id,
      restaurant: restaurant._id,
    });

    if (!order) {
      return apiResponse.error(res, "Order not found", 404);
    }

    const allowedNext = allowedTransitions[order.status];
    if (!allowedNext || !allowedNext.includes(status)) {
      return apiResponse.error(res, "Invalid status transition", 400);
    }

    order.status = status;
    await order.save();

    return apiResponse.success(res, "Order status updated", order);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500, err.message);
  }
};
