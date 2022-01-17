const mongoose = require("mongoose");

const MealTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model("MealType", MealTypeSchema);
