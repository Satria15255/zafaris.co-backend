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
      enum: ["Waiting Confirmation", "Processing", "Shipped", "Delivered", "Completed", "Cancelled"],
      default: "Waiting Confirmation",
    },
    totalProducts: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    message: String,
    shippingMethod: String,
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Transfer"],
      required: true,
    },
    transferProvider: {
      type: String,
      enum: ["Paypal", "Wise", null],
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["Waiting for Payment", "Paid", "Expired"],
      default: "Waiting for Payment",
    },
    paymentExpiredAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },

    shippingAddress: String,
    voucherCode: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);
