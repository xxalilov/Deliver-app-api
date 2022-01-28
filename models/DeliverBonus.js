const mongoose = require("mongoose");

const DeliverBonusSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  ordersCount: {
    type: Number,
  },
  bonus: {
    type: Number,
  },
});

module.exports = mongoose.model("DeliverBonus", DeliverBonusSchema);
