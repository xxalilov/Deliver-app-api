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

const { protect } = require("../middleware/adminAuth");

router.route("/").get(protect, getAllSubadmins).post(protect, addSubadmin);
router.route("/:id").get(protect, getSubadmin);
router.post("/login", loginSubadmin);
router.put("/updatedetails/:id", protect, updateSubadminDetails);
router.put("/updatepassword/:id", protect, updateSubadminPassword);
router.delete("/delete/:id", protect, deleteSubadmin);

module.exports = router;
