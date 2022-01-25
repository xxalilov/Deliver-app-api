const express = require("express");

const { protect } = require("../middleware/userAuth");

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
  .put(protect, updateUserDetails)
  .delete(protect, deleteUser);

router.post("/register", registerUser);
router.post("/register/checkcode", checkCode);

module.exports = router;
