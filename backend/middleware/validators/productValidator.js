const { body } = require("express-validator");

const productValidator = [
  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required")
    .isLength({ min: 3 })
    .withMessage("SKU must be at least 3 characters")
    .isLength({ max: 20 })
    .withMessage("SKU must be at most 20 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "SKU can only contain letters, numbers, underscores, and hyphens",
    ),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3 })
    .withMessage("Product name must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Product name must be at most 100 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative")
    .custom((v) => {
      if ((v.toString().split(".")[1]?.length || 0) > 2)
        throw new Error("Price must have at most 2 decimal places");
      return true;
    }),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative whole number"),

  body("createdBy")
    .notEmpty()
    .withMessage("Created by (userId) is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
];

module.exports = productValidator;
