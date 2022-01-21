const Review = require("../models/Review");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Restaurant = require("../models/Restaurant");

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/restaurants/:restaurantId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.restaurantId) {
    const reviews = await Review.find({ restaurant: req.params.restaurantId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "restaurant",
      select: "title description",
    });

    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Add Review
// @route   POST /api/v1/restaurants/:restaurantId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  try {
    req.body.restaurant = req.params.restaurantId;
    req.body.user = req.user.id;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `No restaurant found with the id of ${req.params.restaurantId}`,
          404
        )
      );
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update Review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete Review
// @route   Delete /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(
        new ErrorResponse(
          `No review found with the id of ${req.params.id}`,
          404
        )
      );
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to update review`, 401));
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
