const MealType = require("../models/MealType");
const asyncHandler = require("../middleware/async");
const { deleteFile } = require("../utils/file");
const { typeSchema } = require("../utils/validator");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all mealTypes
// @route   GET /api/v1/mealtypes
// @access  Public
exports.getMealTypes = asyncHandler(async (req, res, next) => {
  try {
    const mealTypes = await MealType.find();
    res.status(200).json({
      success: true,
      data: mealTypes,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Create Meal Type
// @route   POST /api/v1/mealtypes
// @access  Private
exports.postMealTypes = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }
    const { error } = typeSchema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error, 400));
    }
    const mealTypes = await MealType.create(req.body);
    res.status(200).json({
      success: true,
      data: mealTypes,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Update Meal Type
// @route   PUT /api/v1/mealtypes/:id
// @access  Private
exports.updateMealTypes = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }
    let mealType = await MealType.findById(req.params.id);
    if (!mealType) {
      return next(
        new ErrorResponse(`Meal Type not found this id: ${req.params.id} `, 404)
      );
    }
    if (mealType.image) deleteFile(mealType.image);

    mealType = await MealType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: mealType,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete Meal Type
// @route   DELETE /api/v1/mealtypes/:id
// @access  Private
exports.deleteMealTypes = asyncHandler(async (req, res, next) => {
  try {
    const mealType = await MealType.findById(req.params.id);
    if (!mealType) {
      return next(
        new ErrorResponse(`Meal Type not found this id: ${req.params.id} `, 404)
      );
    }
    if (mealType.image) deleteFile(mealType.image);
    mealType.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
