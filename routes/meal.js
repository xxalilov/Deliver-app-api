const express = require("express");
const {
  getMeals,
  getMeal,
  addMeal,
  updateMeal,
  deleteMeal,
} = require("../controllers/meal");

const { adminProtect, userProtect } = require("../middleware/auth");

const Meal = require("../models/Meal");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(advancedResults(Meal, "restaurant"), getMeals)
  .post(adminProtect, addMeal);
router
  .route("/:id")
  .get(getMeal)
  .put(adminProtect, updateMeal)
  .delete(adminProtect, deleteMeal);

module.exports = router;
