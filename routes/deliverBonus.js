const express = require("express");

const {
  getDeliverBonusesForAdmin,
  getDeliverBonuses,
  createDeliverBonus,
  deleteDeliverBonus,
} = require("../controllers/deliverBonus");

const { adminProtect, deliverProtect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(adminProtect, getDeliverBonusesForAdmin)
  .post(adminProtect, createDeliverBonus);

router.delete("/:id", adminProtect, deleteDeliverBonus);

router.get("/deliver", deliverProtect, getDeliverBonuses);

module.exports = router;
