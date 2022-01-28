const express = require("express");
const {
  getOrderHistories,
  getOrderHistoryForUser,
  getOrderHistoryForDeliver,
} = require("../controllers/orderHistory");

const { adminProtect, userProtect } = require("../middleware/auth");

const router = express.Router();

router.get("/", adminProtect, getOrderHistories);
router.get("/user/:id", userProtect, getOrderHistoryForUser);
router.get("/deliver/:id", getOrderHistoryForDeliver);

module.exports = router;
