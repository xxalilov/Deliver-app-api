const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exist
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.admin = await Admin.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});
