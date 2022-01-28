const express = require("express");
const {
  createDeliver,
  deleteDeliver,
  getDeliver,
  getDelivers,
  getActiveDelivers,
  updateDeliverWork,
  loginDeliver,
} = require("../controllers/deliver");

const {
  adminProtect,
  subadminProtect,
  deliverProtect,
} = require("../middleware/auth");

const advancedResults = require("../middleware/advancedResults");
const Deliver = require("../models/Deliver");

const orderRouter = require("./order");

const router = express.Router();

router.use("/:id/orders", orderRouter);

router
  .route("/")
  .get(adminProtect, advancedResults(Deliver), getDelivers)
  .post(subadminProtect, createDeliver);

router.get("/active", subadminProtect, getActiveDelivers);

router
  .route("/:id")
  .get(subadminProtect, getDeliver)
  .delete(subadminProtect, deleteDeliver)
  .put(deliverProtect, updateDeliverWork);

router.post("/login", loginDeliver);

module.exports = router;
