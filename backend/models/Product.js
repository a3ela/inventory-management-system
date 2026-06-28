const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      minlength: [3, "SKU must be at least 3 characters long"],
      maxlength: [20, "SKU must be at most 20 characters long"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "SKU can only contain letters, numbers, underscores, and hyphens",
      ],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name must be at most 100 characters long"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      validate: {
        validator: function (v) {
          return v >= 0 && (v.toString().split(".")[1]?.length || 0) <= 2;
        },
        message: "Price must be a valid number with up to 2 decimal places",
      },
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Created by reference is required"],
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", ProductSchema);
