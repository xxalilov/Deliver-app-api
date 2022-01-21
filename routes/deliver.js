const express = require("express");
const {
  getDelivers,
  createDeliver,
  deleteDeliver,
  getDeliver,
} = require("../controllers/deliver");

const orderRouter = require("./order");

const router = express.Router();

router.use("/:id/orders", orderRouter);

router.route("/").get(getDelivers).post(createDeliver);

router.route("/:id").get(getDeliver).delete(deleteDeliver);

module.exports = router;
