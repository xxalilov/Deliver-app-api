const express = require("express");
const {
  getRestaurants,
  getRestaurant,
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurant");

const Restaurant = require("../models/Restaurant");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const mealRouter = require("./meal");

const router = express.Router();

// Re-route into other resourse routers
router.use("/:restaurantId/meals", mealRouter);

router
  .route("/")
  .get(advancedResults(Restaurant, "meals"), getRestaurants)
  .post(addRestaurant);
router
  .route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant);

module.exports = router;
