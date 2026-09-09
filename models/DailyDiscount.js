const mongoose = require("mongoose");

const dailyDiscountSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  discountPercent: {
    type: Number,
    default: 30,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

dailyDiscountSchema.virtual("variants", {
  ref: "ProductVariant",
  localField: "_id",
  foreignField: "product",
});

dailyDiscountSchema.set("toJSON", {
  virtuals: true,
});

dailyDiscountSchema.set("toObject", {
  virtuals: true,
});

module.exports = mongoose.model("DailyDiscount", dailyDiscountSchema);
