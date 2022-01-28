const express = require("express");

const {
  getUserBonusesForAdmin,
  getUserBonuses,
  createUserBonus,
  deleteUserBonus,
} = require("../controllers/userBonus");

const { adminProtect, userProtect } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(adminProtect, getUserBonusesForAdmin)
  .post(adminProtect, createUserBonus);

router.delete("/:id", adminProtect, deleteUserBonus);

router.get("/bonus", userProtect, getUserBonuses);

module.exports = router;
