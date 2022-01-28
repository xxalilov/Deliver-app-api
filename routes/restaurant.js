const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant");

const { adminProtect } = require("../middleware/auth");

const Restaurant = require("../models/Restaurant");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const mealRouter = require("./meal");
const reviewRouter = require("./review");

const router = express.Router();

// Re-route into other resourse routers
router.use("/:restaurantId/meals", mealRouter);
router.use("/:restaurantId/reviews", reviewRouter);

router
  .route("/")
  .get(advancedResults(Restaurant, "meals"), getRestaurants)
  .post(adminProtect, addRestaurant);
router
  .route("/:id")
  .get(getRestaurant)
  .put(adminProtect, updateRestaurant)
  .delete(adminProtect, deleteRestaurant);

module.exports = router;
