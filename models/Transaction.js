const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        size: { type: Number, required: true },
        quantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true },
        subtotal: { type: Number, required: true },

        // Snapshot data (optional, tapi bagus untuk record)
        name: String,
        brand: String,
        image: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending_confirmation", "processing", "shipped", "delivered", "completed", "cancelled"],
      default: "pending_confirmation",
    },
    totalProducts: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    message: String,
    shippingMethod: String,
    paymentMethod: String,
    shippingAddress: String,
    voucherCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
