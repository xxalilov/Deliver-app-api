const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrderPosition,
  orderToDeliver,
} = require("../controllers/order");

const { userProtect, subadminProtect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(subadminProtect, getOrders)
  .post(userProtect, createOrder);
router
  .route("/:id")
  .get(getOrder)
  .put(subadminProtect, updateOrderPosition)
  .delete(subadminProtect, deleteOrder);
router.route("/:id/deliver").put(subadminProtect, orderToDeliver);

module.exports = router;
