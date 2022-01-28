const DeliverBonus = require("../models/DeliverBonus");
const OrderHistory = require("../models/OrderHistory");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Deliver = require("../models/Deliver");

// @desc    Get All Deliver Bonuses
// @route   GET /api/v1/bonuses/deliver
// @access  Private
exports.getDeliverBonusesForAdmin = asyncHandler(async (req, res, next) => {
  try {
    const bonuses = await DeliverBonus.find();
    res.status(200).json({
      success: true,
      data: bonuses,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get Deliver Bonuses for Deliver
// @route   GET /api/v1/bonuses/deliver
// @access  Private
exports.getDeliverBonuses = asyncHandler(async (req, res, next) => {
  const bonus = await DeliverBonus.find();

  res.status(200).json({
    success: true,
    data: bonus,
  });
});

// @desc    Create Deliver Bonus
// @route   POST /api/v1/bonuses/deliver
// @access  Private
exports.createDeliverBonus = asyncHandler(async (req, res, next) => {
  try {
    const bonus = await DeliverBonus.create(req.body);

    let delivers = await Deliver.find();

    for (let deliver of delivers) {
      const histories = await OrderHistory.find({ deliver: deliver._id });
      if (req.body.ordersCount && histories.length >= req.body.ordersCount) {
        let sum = Number(deliver.bonus) + Number(req.body.bonus);
        deliver = await Deliver.findByIdAndUpdate(
          deliver._id,
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
        let sum = Number(deliver.bonus) + Number(req.body.bonus);
        deliver = await Deliver.updateMany({ bonus: sum });

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

// @desc    Delete Deliver Bonus
// @route   DELETE /api/v1/bonuses/:id
// @access  Private
exports.deleteDeliverBonus = asyncHandler(async (req, res, next) => {
  try {
    const bonus = await DeliverBonus.findById(req.params.id);
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
