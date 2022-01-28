const express = require("express");
const {
  getRestaurantTypes,
  postRestaurantTypes,
  updateRestaurantTypes,
  deleteRestaurantTypes,
} = require("../controllers/restaurantType");

const { adminProtect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getRestaurantTypes)
  .post(adminProtect, postRestaurantTypes);
router
  .route("/:id")
  .put(adminProtect, updateRestaurantTypes)
  .delete(adminProtect, deleteRestaurantTypes);

module.exports = router;
