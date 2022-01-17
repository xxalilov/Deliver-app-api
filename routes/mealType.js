const express = require("express");
const {
  getMealTypes,
  postMealTypes,
  updateMealTypes,
  deleteMealTypes,
} = require("../controllers/mealType");
const router = express.Router();

router.route("/").get(getMealTypes).post(postMealTypes);
router.route("/:id").put(updateMealTypes).delete(deleteMealTypes);

module.exports = router;
