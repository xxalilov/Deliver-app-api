const express = require("express");

const { userProtect } = require("../middleware/auth");

const {
  registerUser,
  checkCode,
  getAllUsers,
  updateUserDetails,
  deleteUser,
} = require("../controllers/user");

const orderRouter = require("./order");

const router = express.Router();

router.use("/:userId/order", orderRouter);

router.get("/", getAllUsers);
router
  .route("/:id")
  .put(userProtect, updateUserDetails)
  .delete(userProtect, deleteUser);

router.post("/register", registerUser);
router.post("/register/checkcode", checkCode);

module.exports = router;
