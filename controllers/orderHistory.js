const OrderHistory = require("../models/OrderHistory");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get Order Histories
// @route   GET /api/v1/orderhistories
// @access  Private
exports.getOrderHistories = asyncHandler(async (req, res, next) => {
  try {
    const orderHistories = await OrderHistory.find();

    res.status(200).json({
      success: true,
      data: orderHistories,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Order Histories for Users
// @route   GET /api/v1/orderhistories/user/:id
// @access  Private
exports.getOrderHistoryForUser = asyncHandler(async (req, res, next) => {
  try {
    const orderHistories = await OrderHistory.find({ user: req.params.id });

    if (!orderHistories) {
      return next(
        new ErrorResponse(
          `No order history with the id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: orderHistories,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Order Histories for Deliver
// @route   GET /api/v1/orderhistories/deliver/:id
// @access  Private
exports.getOrderHistoryForDeliver = asyncHandler(async (req, res, next) => {
  try {
    const orderHistories = await OrderHistory.find({ deliver: req.params.id });

    if (!orderHistories) {
      return next(
        new ErrorResponse(
          `No order history with the id of ${req.params.id}`,
          404
        )
      );
    }

    res.status(200).json({
      success: true,
      data: orderHistories,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
