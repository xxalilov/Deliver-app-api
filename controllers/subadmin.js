const Subadmin = require("../models/Subadmin");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { subadminSchema } = require("../utils/validator");

// @desc    Get all subadmins
// @route   GET /api/v1/subadmins
// @access  Private
exports.getAllSubadmins = asyncHandler(async (req, res, next) => {
  try {
    const subadmins = await Subadmin.find();
    res.status(200).json({
      success: true,
      data: subadmins,
    });
  } catch (err) {
    next(new ErrorResponse(err));
  }
});

// @desc    Get single subadmin
// @route   GET /api/v1/subadmins/:id
// @access  Private
exports.getSubadmin = asyncHandler(async (req, res, next) => {
  try {
    const subadmin = await Subadmin.findById(req.params.id);

    if (!subadmin) {
      return next(
        new ErrorResponse(`No subadmin with the id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: subadmin,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Add Subadmin
// @route   POST /api/v1/subadmins
// @access  Private
exports.addSubadmin = asyncHandler(async (req, res, next) => {
  try {
    const { error } = subadminSchema.validate(req.body);
    if (error) {
      return next(new ErrorResponse(error, 400));
    }

    const { name, login, password } = req.body;

    const subadmin = await Subadmin.create({ name, login, password });

    res.status(200).json({
      success: true,
      data: subadmin,
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Update subadmin details
// @route   PUT /api/v1/subadmins/updatedetails/:id
// @access  Private
exports.updateSubadminDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    login: req.body.login,
  };

  const subadmin = await Subadmin.findByIdAndUpdate(
    req.params.id,
    fieldsToUpdate,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: subadmin,
  });
});

// @desc    Update subadmin password
// @route   PUT /api/v1/subadmins/updatepassword/:id
// @access  Private
exports.updateSubadminPassword = asyncHandler(async (req, res, next) => {
  try {
    const subadmin = await Subadmin.findById(req.params.id).select("+password");

    if (!subadmin) {
      return next(
        new ErrorResponse(`No subadmin with the id of ${req.params.id}`, 404)
      );
    }

    subadmin.password = req.body.password;
    await subadmin.save();

    sendTokenResponse(subadmin, 200, res);
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Delete subadmin
// @route   DELETE /api/v1/subadmins/delete/:id
// @access  Private
exports.deleteSubadmin = asyncHandler(async (req, res, next) => {
  try {
    const subadmin = await Subadmin.findById(req.params.id);

    if (!subadmin) {
      return next(
        new ErrorResponse(`No subadmin with the id of ${req.params.id}`, 404)
      );
    }

    await subadmin.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// @desc    Login subadmin
// @route   POST /api/v1/subadmins/login
// @access  Public
exports.loginSubadmin = asyncHandler(async (req, res, next) => {
  try {
    const { login, password } = req.body;

    // Validate login & password
    if (!login || !password) {
      return next(
        new ErrorResponse("Please provide an login and password", 400)
      );
    }

    // Check for subadmin
    const subadmin = await Subadmin.findOne({ login }).select("+password");

    if (!subadmin) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if password matches
    const isMatch = await subadmin.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    sendTokenResponse(subadmin, 200, res);
  } catch (err) {
    next(new ErrorResponse(err, 400));
  }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (subadmin, statusCode, res) => {
  // Create token
  const token = subadmin.getSignedJwtToken();

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
