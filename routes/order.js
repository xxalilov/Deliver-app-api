const express = require("express");
const {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrderPosition,
  orderToDeliver,
} = require("../controllers/order");

const router = express.Router({ mergeParams: true });

router.route("/").get(getOrders).post(createOrder).get(orderToDeliver);
router.route("/:id").get(getOrder).put(updateOrderPosition).delete(deleteOrder);
router.route("/:id/deliver").put(orderToDeliver);

module.exports = router;
