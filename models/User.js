const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    surname: String,
    phoneNumber: {
      type: String,
      required: true,
    },
    cardNumber: String,
    gender: {
      type: [String],
      enum: ["female", "male"],
    },
    birthday: String,
    address: String,
    bonus: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Sign in and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Reverse populate with virtuals
UserSchema.virtual("order", {
  ref: "Order",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

module.exports = mongoose.model("User", UserSchema);
