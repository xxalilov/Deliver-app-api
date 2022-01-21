const express = require("express");

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");
const { protect } = require("../middleware/userAuth");

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
  .post(protect, addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
