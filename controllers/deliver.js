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

// @desc    Login Deliver
// @route   POST /api/v1/delivers/login
// @access  Public
exports.loginDeliver = asyncHandler(async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return next(
        new ErrorResponse("Please provide an phone number and password", 400)
      );
    }

    // Check for deliver
    const deliver = await Deliver.findOne({ phoneNumber: phoneNumber }).select(
      "+password"
    );

    if (!deliver) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await deliver.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendTokenResponse(deliver, 200, res);
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (deliver, statusCode, res) => {
  // Create token
  const token = deliver.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
