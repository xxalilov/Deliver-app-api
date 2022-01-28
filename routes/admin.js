const express = require("express");
const router = express.Router();
const {
  createAdmin,
  loginAdmin,
  getAdmin,
  forgotPassword,
  updateAdminDetails,
  updateAdminPassword,
  logout,
} = require("../controllers/admin");

const { adminProtect, userProtect } = require("../middleware/auth");

router.get("/me", adminProtect, getAdmin);
router.put("/updatedetails", adminProtect, updateAdminDetails);
router.put("/updatepassword", adminProtect, updateAdminPassword);
router.post("/register", createAdmin);
router.post("/login", loginAdmin);
router.get("/logout", userProtect, logout);
router.post("/forgotpassword", forgotPassword);

module.exports = router;
