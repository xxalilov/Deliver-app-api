const express = require("express");
const {
  getOrderHistories,
  getOrderHistoryForUser,
} = require("../controllers/orderHistory");

const router = express.Router();

router.get("/", getOrderHistories);
router.get("/:id", getOrderHistoryForUser);

module.exports = router;
