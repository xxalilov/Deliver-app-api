const express = require("express");
const {
  getMealTypes,
  postMealTypes,
  updateMealTypes,
  deleteMealTypes,
} = require("../controllers/mealType");

const { protect } = require("../middleware/adminAuth");

const router = express.Router();

router.route("/").get(getMealTypes).post(protect, postMealTypes);
router
  .route("/:id")
  .put(protect, updateMealTypes)
  .delete(protect, deleteMealTypes);

module.exports = router;
