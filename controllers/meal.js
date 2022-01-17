const Meal = require("../models/Meal");
const Restaurant = require("../models/Restaurant");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { deleteFile } = require("../utils/file");
const { mealSchema } = require("../utils/validator");

// @desc    Get all meals
// @route   GET /api/v1/meals
// @route   GET /api/v1/restaurants/:restaurantId/meals
// @access  Public
exports.getMeals = asyncHandler(async (req, res, next) => {
  try {
    if (req.params.restaurantId) {
      const meals = await Meal.find({ restaurant: req.params.restaurantId });

      return res.status(200).json({
        success: true,
        count: meals.length,
        data: meals,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get single meal
// @route   GET /api/v1/meal/:id
// @access  Public
exports.getMeal = asyncHandler(async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate({
      path: "restaurant",
    });

    if (!meal) {
      return next(
        new ErrorResponse(`No meal with the id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Add meals
// @route   POST /api/v1/restaurants/:restaurantId/meals
// @access  Private
exports.addMeal = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }

    const { error } = mealSchema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error, 400));
    }

    req.body.restaurant = req.params.restaurantId;

    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return next(
        new ErrorResponse(
          `No restaurant with the id of ${req.params.restaurantId}`,
          404
        )
      );
    }

    const meal = await Meal.create(req.body);

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update meals
// @route   PUT /api/v1/meals/:id
// @access  Private
exports.updateMeal = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }
    let meal = await Meal.findById(req.params.id);

    if (!meal) {
      return next(
        new ErrorResponse(`No meal with the id of ${req.params.restaurantId}`),
        404
      );
    }

    if (meal.image !== "no-photo.jpg") deleteFile(meal.image);

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: meal,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete meals
// @route   DELETE /api/v1/meals/:id
// @access  Private
exports.deleteMeal = asyncHandler(async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return next(
        new ErrorResponse(`No meal with the id of ${req.params.restaurantId}`),
        404
      );
    }

    deleteFile(meal.image);

    await meal.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
