const express = require("express");
const {
  getRestaurantTypes,
  postRestaurantTypes,
  updateRestaurantTypes,
  deleteRestaurantTypes,
} = require("../controllers/restaurantType");
const router = express.Router();

router.route("/").get(getRestaurantTypes).post(postRestaurantTypes);
router.route("/:id").put(updateRestaurantTypes).delete(deleteRestaurantTypes);

module.exports = router;
