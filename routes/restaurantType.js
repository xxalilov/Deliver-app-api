const express = require("express");
const {
  getRestaurantTypes,
  postRestaurantTypes,
  updateRestaurantTypes,
  deleteRestaurantTypes,
} = require("../controllers/restaurantType");

const { protect } = require("../middleware/adminAuth");

const router = express.Router();

router.route("/").get(getRestaurantTypes).post(protect, postRestaurantTypes);
router
  .route("/:id")
  .put(protect, updateRestaurantTypes)
  .delete(protect, deleteRestaurantTypes);

module.exports = router;
