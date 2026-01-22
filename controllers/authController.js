const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const generateToken = require("../utils/generateToken");
const apiResponse = require("../utils/apiResponse");

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { name, email, password, address, number, role } = req.body;

    if (!name || !email || !password || !address || !number || !role) {
      return apiResponse.error(res, "Please fill all required fields", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return apiResponse.error(res, "User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      address,
      number,
      role, // "owner" or "user"
    });

    // 🔴 IMPORTANT:
    // Signup DOES NOT decide restaurant
    // Signup DOES NOT auto-login logic in frontend
    const token = generateToken({
      id: newUser._id,
      role: newUser.role,
    });

    return apiResponse.success(
      res,
      "User created successfully",
      {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          number: newUser.number,
          address: newUser.address,
          restaurantId: null, // always null on signup
        },
      },
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

/* ===================== SIGNIN ===================== */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse.error(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.error(res, "Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return apiResponse.error(res, "Invalid credentials", 401);
    }

    // 🔑 OWNER → fetch restaurant
    let restaurantId = null;
    if (user.role === "owner") {
      const restaurant = await Restaurant.findOne({ owner: user._id });
      restaurantId = restaurant ? restaurant._id : null;
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    return apiResponse.success(res, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        number: user.number,
        address: user.address,
        restaurantId, // ✅ THE KEY FIX
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return apiResponse.error(res, "Server error", 500, error.message);
  }
};

module.exports = { signup, signin };
