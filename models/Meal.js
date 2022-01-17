const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "no-photo.jpg",
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meal", MealSchema);
