const express = require("express");
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  getAdmin,
  forgotPassword,
  updateAdminDetails,
  updateAdminPassword,
} = require("../controllers/admin");

const { protect } = require("../middleware/adminAuth");

router.get("/me", protect, getAdmin);
router.put("/updatedetails", protect, updateAdminDetails);
router.put("/updatepassword", protect, updateAdminPassword);
router.post("/register", createAdmin);
router.post("/login", loginAdmin);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
