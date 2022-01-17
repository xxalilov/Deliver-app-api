const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { deleteFile } = require("../utils/file");
const { restaurantSchema } = require("../utils/validator");

// @desc    Get all restaurants
// @route   GET /api/v1/restaurants
// @access  Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single restaurant
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Add Restaurant
// @route   POST /api/v1/bootcamps
// @access  Private
exports.addRestaurant = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }

    const { error } = restaurantSchema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error, 400));
    }

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update restaurant
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.updateRestaurant = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }

    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    if (restaurant.image !== "no-photo.jpg") deleteFile(restaurant.image);

    restaurant = await Restaurant.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete restaurant
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return next(
        new ErrorResponse(
          `Restaurant not found with id of ${req.params.id}`,
          404
        )
      );
    }

    deleteFile(restaurant.image);

    restaurant.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
