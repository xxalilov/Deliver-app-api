const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deliverPrice: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "no-photo.jpg",
    },
    address: {
      type: String,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete courses when a bootcamp is deleted
RestaurantSchema.pre("remove", async function (next) {
  await this.model("Meal").deleteMany({ restaurant: this._id });
  next();
});

// Reverse populate with virtuals
RestaurantSchema.virtual("meals", {
  ref: "Meal",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
