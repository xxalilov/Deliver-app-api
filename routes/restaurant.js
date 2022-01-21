const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant");

const { protect } = require("../middleware/adminAuth");

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
  .post(protect, addRestaurant);
router
  .route("/:id")
  .get(getRestaurant)
  .put(protect, updateRestaurant)
  .delete(protect, deleteRestaurant);

module.exports = router;
