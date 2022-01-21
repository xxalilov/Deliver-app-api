const Deliver = require("../models/Deliver");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get All Delivers
// @route   GET /api/v1/delivers
// @access  Private
exports.getDelivers = asyncHandler(async (req, res, next) => {
  const deliver = await Deliver.find();

  res.status(200).json({
    success: true,
    data: deliver,
  });
});

// @desc    Get Single Deliver
// @route   GET /api/v1/delivers/:id
// @access  Private
exports.getDeliver = asyncHandler(async (req, res, next) => {
  try {
    const deliver = await Deliver.findById(req.params.id);

    if (!deliver) {
      return next(
        new ErrorResponse(`No deliver with the id of ${req.params.userId}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: deliver,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Single Deliver
// @route   POST /api/v1/delivers
// @access  Private
exports.createDeliver = asyncHandler(async (req, res, next) => {
  try {
    const deliver = await Deliver.create(req.body);

    res.status(201).json({
      success: true,
      data: deliver,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

exports.deleteDeliver = asyncHandler(async (req, res, next) => {
  try {
    const deliver = await Deliver.findByIdAndRemove(req.params.id);

    if (!deliver) {
      return next(
        new ErrorResponse(`No deliver with the id of ${req.params.userId}`, 404)
      );
    }

    deliver.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
