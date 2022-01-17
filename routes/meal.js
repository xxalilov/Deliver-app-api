const express = require("express");
const {
  getMeals,
  getMeal,
  addMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meal");

const Meal = require("../models/Meal");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResults(Meal, "restaurant"), getMeals)
  .post(addMeal);
router.route("/:id").get(getMeal).put(updateMeal).delete(deleteMeal);

module.exports = router;
