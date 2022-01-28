const express = require("express");
const router = express.Router();
const {
  getAllSubadmins,
  addSubadmin,
  getSubadmin,
  loginSubadmin,
  updateSubadminDetails,
  updateSubadminPassword,
  deleteSubadmin,
} = require("../controllers/subadmin");

const { adminProtect } = require("../middleware/auth");

router.route("/").get(adminProtect, getAllSubadmins).post(adminProtect, addSubadmin);
router.route("/:id").get(adminProtect, getSubadmin);
router.post("/login", loginSubadmin);
router.put("/updatedetails/:id", adminProtect, updateSubadminDetails);
router.put("/updatepassword/:id", adminProtect, updateSubadminPassword);
router.delete("/delete/:id", adminProtect, deleteSubadmin);

module.exports = router;
