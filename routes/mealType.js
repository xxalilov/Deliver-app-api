const express = require("express");
const {
  getMealTypes,
  postMealTypes,
  updateMealTypes,
  deleteMealTypes,
} = require("../controllers/mealType");

const { adminProtect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getMealTypes).post(adminProtect, postMealTypes);
router
  .route("/:id")
  .put(adminProtect, updateMealTypes)
  .delete(adminProtect, deleteMealTypes);

module.exports = router;
