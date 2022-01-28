const express = require("express");

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");
const { userProtect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const Review = require("../models/Review");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "restaurant",
      select: "name address",
    }),
    getReviews
  )
  .post(userProtect, addReview);

router
  .route("/:id")
  .get(getReview)
  .put(userProtect, updateReview)
  .delete(userProtect, deleteReview);

module.exports = router;
