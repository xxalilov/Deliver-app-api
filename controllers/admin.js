const Admin = require("../models/Admin");
const asyncHandler = require("../middleware/async");
const { adminSchema } = require("../utils/validator");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");

// @desc    Add Admin
// @route   POST /api/v1/admin
// @access  Private
exports.createAdmin = asyncHandler(async (req, res, next) => {
  try {
    const currentAdmin = await Admin.find();

    if (currentAdmin.length > 0) {
      return next(new ErrorResponse("Only one person can be an admin!", 400));
    }

    const { error } = adminSchema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error, 400));
    }

    const { name, email, password } = req.body;

    const admin = await Admin.create({ name, email, password });

    // Create token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Login admin
// @route   POST /api/v1/admin/login
// @access  Public
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }
    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Get admin
// @route   GET /api/v1/admin/me
// @access  Private
exports.getAdmin = asyncHandler(async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Log admin out / clear cookie
// @route   GET /api/v1/admin/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Forgot password
// @route   POST /api/v1/admin/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return next(new ErrorResponse("There is no admin with that email", 404));
  }

  // Get reset token
  const resetToken = admin.getResetPasswordToken();

  await admin.save({ validateBeforeSave: false });

  // Create reset url
  // prettier-ignore
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/admin/resetpassword/${resetToken}`

  const message = "Reset Password";
  const resetLink = `You must click <a href="${resetUrl}">this link</a> to reset your password!`;

  try {
    await sendEmail(admin.email, message, resetLink);
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    await admin.save({ validateBeforeSave: false });

    next(new ErrorResponse("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// @desc    Update admin details
// @route   PUT /api/v1/admin/updatedetails
// @access  Private
exports.updateAdminDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const admin = await Admin.findByIdAndUpdate(req.admin.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: admin,
  });
});

// @desc    Update admin password
// @route   PUT /api/v1/admin/updatepassword
// @access  Private
exports.updateAdminPassword = asyncHandler(async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("+password");

    // Check current password
    if (!(await admin.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse("Password is incorrect", 401));
    }

    admin.password = req.body.newPassword;
    await admin.save();

    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(new ErrorResponse(err), 400);
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (admin, statusCode, res) => {
  // Create token
  const token = admin.getSignedJwtToken();

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
