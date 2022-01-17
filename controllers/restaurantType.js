const RestaurantType = require("../models/RestaurantType");
const asyncHandler = require("../middleware/async");
const { deleteFile } = require("../utils/file");
const { typeSchema } = require("../utils/validator");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all restaurantTypes
// @route   GET /api/v1/restauranttypes
// @access  Public
exports.getRestaurantTypes = asyncHandler(async (req, res, next) => {
  try {
    const restaurantTypes = await RestaurantType.find();
    res.status(200).json({
      success: true,
      data: restaurantTypes,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Create Restaurant Type
// @route   POST /api/v1/restauranttypes
// @access  Private
exports.postRestaurantTypes = asyncHandler(async (req, res, next) => {
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

    const restaurantTypes = await RestaurantType.create(req.body);
    res.status(200).json({
      success: true,
      data: restaurantTypes,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Update Restaurant Type
// @route   PUT /api/v1/restauranttypes/:id
// @access  Private
exports.updateRestaurantTypes = asyncHandler(async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      req.body.image = undefined;
    } else {
      req.body.image = file.path;
    }
    let restaurantTypes = await RestaurantType.findById(req.params.id);
    if (!restaurantTypes) {
      return next(
        new ErrorResponse(
          `Restaurant Type not found this id: ${req.params.id} `,
          404
        )
      );
    }
    if (restaurantTypes.image) deleteFile(restaurantTypes.image);

    restaurantTypes = await RestaurantType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: restaurantTypes,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Delete Restaurant Type
// @route   DELETE /api/v1/restauranttypes/:id
// @access  Private
exports.deleteRestaurantTypes = asyncHandler(async (req, res, next) => {
  const restaurantTypes = await RestaurantType.findById(req.params.id);
  if (!restaurantTypes) {
    return next(
      new ErrorResponse(
        `Restaurant Type not found this id: ${req.params.id}`,
        404
      )
    );
  }
  if (restaurantTypes.image) deleteFile(restaurantTypes.image);
  restaurantTypes.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
