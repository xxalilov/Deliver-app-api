const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { userSchema } = require("../utils/validator");

// @desc    Get All Users
// @route   POST /api/v1/user/
// @access  Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Register user
// @route   POST /api/v1/user/register
// @access  Public
let phoneNumber;
exports.registerUser = asyncHandler(async (req, res, next) => {
  try {
    phoneNumber = req.body.phoneNumber;
    if (phoneNumber.length !== 13) {
      return next(new ErrorResponse("Please add correct phone number", 400));
    }

    res.status(200).json({
      success: true,
      message: "We sent sms to you!",
    });
  } catch (err) {
    return next(new ErrorResponse(err, 400));
  }
});

// @desc    Check Code
// @route   POST /api/v1/user/register/checkcode
// @access  Public
exports.checkCode = asyncHandler(async (req, res, next) => {
  try {
    if (Number(req.body.code) === 123456) {
      let user = await User.findOne({ phoneNumber: phoneNumber });
      if (user) {
        phoneNumber = undefined;
        return sendTokenResponse(user, 201, res);
      }
      console.log(phoneNumber);
      user = await User.create({ phoneNumber: phoneNumber });
      phoneNumber = undefined;
      sendTokenResponse(user, 201, res);
    } else {
      return next(new ErrorResponse("Incorrect code", 400));
    }
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update User Details
// @route   PUT /api/v1/user/:id
// @access  Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}, 404`)
      );
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete User
// @route   PUT /api/v1/user/:id
// @access  Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}, 404`)
      );
    }

    user.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

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
