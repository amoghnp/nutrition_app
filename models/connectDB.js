var mongoose = require('mongoose');

module.exports = async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/nutritionAppDB");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}