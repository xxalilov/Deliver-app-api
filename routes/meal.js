const express = require("express");
const {
  getMeals,
  getMeal,
  addMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meal");

const { protect } = require("../middleware/adminAuth");

const Meal = require("../models/Meal");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResults(Meal, "restaurant"), getMeals)
  .post(protect, addMeal);
router
  .route("/:id")
  .get(getMeal)
  .put(protect, updateMeal)
  .delete(protect, deleteMeal);

module.exports = router;
