const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateStock,
} = require("../controllers/product.controller");
const productValidator = require("../middleware/validators/productValidator");
const stockValidator = require("../middleware/validators/stockValidator");
const validate = require("../middleware/validate.middleware");

router.post("/", productValidator, validate, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.patch("/:id/stock", stockValidator, validate, updateStock);

module.exports = router;
