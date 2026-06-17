const mongoose = require("mongoose");

const ProductVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: Number,
      requires: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);
