const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema({
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
    enum: ["start", "active", "cooking", "way", "finally"],
  },
  deliver: {
    type: mongoose.ObjectId,
  },
  createdAt: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrderHistory", OrderHistorySchema);
