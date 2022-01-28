const UserBonus = require("../models/UserBonus");
const OrderHistory = require("../models/OrderHistory");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

// @desc    Get All User Bonuses
// @route   GET /api/v1/bonuses/user
// @access  Private
exports.getUserBonusesForAdmin = asyncHandler(async (req, res, next) => {
  try {
    const bonuses = await UserBonus.find();
    res.status(200).json({
      success: true,
      data: bonuses,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get User Bonuses for User
// @route   GET /api/v1/bonuses/user/bonus
// @access  Private
exports.getUserBonuses = asyncHandler(async (req, res, next) => {
  const bonus = await UserBonus.find();

  res.status(200).json({
    success: true,
    data: bonus,
  });
});

// @desc    Create Usre Bonus
// @route   POST /api/v1/bonuses/user
// @access  Private
exports.createUserBonus = asyncHandler(async (req, res, next) => {
  try {
    const bonus = await UserBonus.create(req.body);

    let users = await User.find();

    for (let user of users) {
      const histories = await OrderHistory.find({ user: user._id });
      if (req.body.ordersCount && histories.length >= req.body.ordersCount) {
        let sum = Number(user.bonus) + Number(req.body.bonus);
        user = await User.findByIdAndUpdate(
          user._id,
          { bonus: sum },
          {
            new: true,
          }
        );
        return res.status(201).json({
          success: true,
          data: bonus,
        });
      } else if (!req.body.ordersCount) {
        let sum = Number(user.bonus) + Number(req.body.bonus);
        user = await User.updateMany({ bonus: sum });

        return res.status(201).json({
          success: true,
          data: bonus,
        });
      }
    }
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete User Bonus
// @route   DELETE /api/v1/bonuses/user/:id
// @access  Private
exports.deleteUserBonus = asyncHandler(async (req, res, next) => {
  try {
    const bonus = await UserBonus.findById(req.params.id);
    if (!bonus) {
      return next(
        new ErrorResponse(`No bonus with the id of ${req.params.id}`, 404)
      );
    }

    await bonus.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});
