const { body } = require("express-validator");

const stockValidator = [
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["increase", "decrease"])
    .withMessage("Type must be 'increase' or 'decrease'"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isInt({ min: 1 })
    .withMessage("Amount must be a positive whole number"),

  body("performedBy")
    .notEmpty()
    .withMessage("Performed by (userId) is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
];

module.exports = stockValidator;
