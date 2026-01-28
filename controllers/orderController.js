const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const apiResponse = require("../utils/apiResponse");

/* -------------------------------------------------------
   CREATE ORDER (USER)
------------------------------------------------------- */
exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.food");

    if (!cart || cart.items.length === 0) {
      return apiResponse.error(res, "Cart is empty", 400);
    }

    // ✅ ENSURE ALL ITEMS BELONG TO SAME RESTAURANT
    const restaurantIds = cart.items.map(item =>
      item.food.restaurant.toString()
    );

    const uniqueRestaurants = [...new Set(restaurantIds)];
    if (uniqueRestaurants.length !== 1) {
      return apiResponse.error(
        res,
        "Cart items must be from the same restaurant",
        400
      );
    }

    const restaurantId = uniqueRestaurants[0];
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
      restaurant: restaurant._id, // ✅ GUARANTEED CORRECT
      items: cart.items.map(item => ({
        food: item.food._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      })),
      totalAmount,
      status: "pending",
    });

    // clear cart
    cart.items = [];
    await cart.save();

    return apiResponse.success(res, "Order placed", order, 201);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return apiResponse.error(res, "Server error", 500);
  }
};

/* -------------------------------------------------------
   USER: GET MY ORDERS
------------------------------------------------------- */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return apiResponse.success(res, "Orders fetched", orders);
  } catch (err) {
    return apiResponse.error(res, "Server error", 500);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: GET RESTAURANT ORDERS
------------------------------------------------------- */
exports.getRestaurantOrders = async (req, res) => {
  try {
    // ✅ SOURCE OF TRUTH
    const restaurantId = req.user.restaurant;

    if (!restaurantId) {
      return apiResponse.error(res, "Restaurant not linked to user", 403);
    }

    const orders = await Order.find({
      restaurant: restaurantId,
    }).sort({ createdAt: -1 });

    return apiResponse.success(res, "Restaurant orders fetched", orders);
  } catch (err) {
    console.error(err);
    return apiResponse.error(res, "Server error", 500);
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
    return apiResponse.error(res, "Server error", 500);
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
    return apiResponse.error(res, "Server error", 500);
  }
};

/* -------------------------------------------------------
   SHOPKEEPER: UPDATE ORDER STATUS
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
    return apiResponse.error(res, "Server error", 500);
  }
};
