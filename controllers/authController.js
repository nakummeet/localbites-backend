const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const apiResponse = require("../utils/apiResponse");

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { name, email, password, address, number, role } = req.body;

    if (!name || !email || !password || !address || !number || !role) {
      return apiResponse.error(res, "All fields required", 400);
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return apiResponse.error(res, "User already exists", 409);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      number,
      role,
    });

    const token = generateToken({ id: user._id, role: user.role });

    return apiResponse.success(
      res,
      "Signup success",
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantId: null, // ALWAYS null on signup
        },
      },
      201
    );
  } catch (err) {
    return apiResponse.error(res, "Server error", 500);
  }
};

/* ===================== SIGNIN ===================== */
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return apiResponse.error(res, "Invalid credentials", 401);
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return apiResponse.error(res, "Invalid credentials", 401);
    }

    const token = generateToken({ id: user._id, role: user.role });

    // ✅ SINGLE SOURCE OF TRUTH
    const restaurantId = user.restaurant ? user.restaurant : null;

    return apiResponse.success(res, "Login successful", {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        number: user.number,
        address: user.address,
        restaurantId, // 🔥 ALWAYS CORRECT NOW
      },
    });
  } catch (err) {
    console.error(err);
    return apiResponse.error(res, "Server error", 500);
  }
};

module.exports = { signup, signin };
