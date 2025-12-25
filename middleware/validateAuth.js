const validateSignup = (req, res, next) => {
  const { email, password, number } = req.body;

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  // Password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters long and include 1 uppercase letter and 1 number",
    });
  }

  // Mobile number validation (SIGNUP ONLY)
  const numberRegex = /^[0-9]{10}$/;

  if (!number || !numberRegex.test(number.toString())) {
    return res.status(400).json({
      success: false,
      message: "Mobile number must be exactly 10 digits",
    });
  }

  next();
};

const validateSignin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  next();
};

module.exports = { validateSignup, validateSignin };
