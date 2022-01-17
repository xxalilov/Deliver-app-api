const mongoose = require("mongoose");

const RestaurantTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model("RestaurantType", RestaurantTypeSchema);
