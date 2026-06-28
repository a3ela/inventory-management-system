const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    changeAmount: {
      type: Number,
      required: [true, "Change amount is required"],
    },
    type: {
      type: String,
      enum: ["increase", "decrease", "initial"],
      required: [true, "Transaction type is required"],
    },
    quantityAfter: {
      type: Number,
      required: [true, "Quantity after change is required"],
      min: [0, "Quantity after cannot be negative"],
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Performed by is required"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Transaction", TransactionSchema);
