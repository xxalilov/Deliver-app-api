const express = require("express");
const {
  createDeliver,
  deleteDeliver,
  getDeliver,
  getDelivers,
  getActiveDelivers,
  updateDeliverWork,
} = require("../controllers/deliver");

const { protect } = require("../middleware/adminAuth");

const advancedResults = require("../middleware/advancedResults");
const Deliver = require("../models/Deliver");

const orderRouter = require("./order");

const router = express.Router();

router.use("/:id/orders", orderRouter);

router
  .route("/")
  .get(protect, advancedResults(Deliver), getDelivers)
  .post(createDeliver);

router.get("/active", getActiveDelivers);

router
  .route("/:id")
  .get(getDeliver)
  .delete(deleteDeliver)
  .put(updateDeliverWork);

module.exports = router;
