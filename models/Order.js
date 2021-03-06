const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      count: {
        type: Number,
        default: 1,
      },
    },
  ],
  allPrice: {
    type: Number,
    required: true,
  },
  address: [],
  restaurantName: {
    type: String,
    required: true,
  },
  restaurantAddress: [],
  position: {
    type: [String],
    required: true,
    enum: ["start", "active", "cooking", "way", "finally", "success"],
  },
  deliver: {
    type: mongoose.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
