const Deliver = require("../models/Deliver");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const io = require("../utils/socket");

// @desc    Get All Delivers
// @route   GET /api/v1/delivers
// @access  Private
exports.getDelivers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get Active Delivers For Subadmin
// @route   GET /api/v1/delivers/active
// @access  Private
exports.getActiveDelivers = asyncHandler(async (req, res, next) => {
  const delivers = await Deliver.find().select("-balance -passport");

  let activeDelivers = [];

  for (let deliver of delivers) {
    if (deliver.atWork && !deliver.isBusy) {
      activeDelivers.push(deliver);
    }
  }

  res.status(200).json({
    success: true,
    data: activeDelivers,
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

// @desc    Update Deliver Work
// @route   POST /api/v1/delivers/:id
// @access  Private
exports.updateDeliverWork = asyncHandler(async (req, res, next) => {
  try {
    let deliver = await Deliver.findById(req.params.id);

    if (!deliver) {
      return next(
        new ErrorResponse(`No deliver with the id of ${req.params.id}`, 404)
      );
    }

    deliver = await Deliver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    io.getIO().emit("deliverAtWork", {
      action: "updated",
      data: deliver,
    });

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

// @desc    Delete Deliver
// @route   DELETE /api/v1/delivers/:id
// @access  Private
exports.deleteDeliver = asyncHandler(async (req, res, next) => {
  try {
    const deliver = await Deliver.findByIdAndRemove(req.params.id);

    if (!deliver) {
      return next(
        new ErrorResponse(`No deliver with the id of ${req.params.id}`, 404)
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