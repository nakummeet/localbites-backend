const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("MONGO_URI not defined");
      return; // ❗ do NOT crash
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // ❌ DO NOT exit process on Vercel
  }
};

module.exports = connectDB;
