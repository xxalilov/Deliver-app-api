const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SubadminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Encrypt password using bcrypt
SubadminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign in and return
SubadminSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match subadmin entered password to hashed password in database
SubadminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Subadmin", SubadminSchema);
