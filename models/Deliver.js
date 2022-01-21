const mongoose = require("mongoose");

const DeliverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  passport: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  atWork: {
    type: Boolean,
    default: false,
  },
  isBusy: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Deliver", DeliverSchema);
