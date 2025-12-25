const Cart = require("../models/Cart");
const Food = require("../models/Food");
const apiResponse = require("../utils/apiResponse");


const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);


exports.addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) {
      return apiResponse.error(res, "Food ID is required", 400);
    }

    if (quantity < 1) {
      return apiResponse.error(res, "Quantity must be at least 1", 400);
    }

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return apiResponse.error(res, "Food not available", 404);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const index = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({
        food: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
      });
    }

    await cart.save();

    return apiResponse.success(res, "Item added to cart", {
      items: cart.items,
      total: calculateTotal(cart.items),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return apiResponse.success(res, "Cart is empty", {
        items: [],
        total: 0,
      });
    }

    return apiResponse.success(res, "Cart fetched", {
      items: cart.items,
      total: calculateTotal(cart.items),
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    if (quantity < 0) {
      return apiResponse.error(res, "Invalid quantity", 400);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return apiResponse.error(res, "Cart not found", 404);
    }

    const index = cart.items.findIndex(
      (item) => item.food.toString() === foodId
    );

    if (index === -1) {
      return apiResponse.error(res, "Item not found in cart", 404);
    }

    if (quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }

    await cart.save();

    return apiResponse.success(res, "Cart updated", {
      items: cart.items,
      total: calculateTotal(cart.items),
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return apiResponse.error(res, "Cart not found", 404);
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    await cart.save();

    return apiResponse.success(res, "Item removed", {
      items: cart.items,
      total: calculateTotal(cart.items),
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    return apiResponse.error(res, "Server error", 500);
  }
};
