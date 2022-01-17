const mongoose = require("mongoose");
const { deleteFile } = require("../utils/file");

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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete courses when a bootcamp is deleted
RestaurantSchema.pre("remove", async function (next) {
  let meals = await this.model("Meal");
  meals = meals.findById({ restaurant: this._id });
  console.log(meals.scheam.image);
  // meals.map((m) => {
  //   if (m.image !== "no-photo.jpg") deleteFile(m.image);
  // });
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
