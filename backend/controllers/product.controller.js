const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

const createProduct = async (req, res, next) => {
  try {
    const { sku, name, price, quantity, createdBy } = req.body;
    const product = new Product({ sku, name, price, quantity, createdBy });
    await product.save();

    if (quantity > 0) {
      await Transaction.create({
        product: product._id,
        changeAmount: quantity,
        type: "initial",
        quantityAfter: quantity,
        performedBy: createdBy,
      });
    }

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "fullname email")
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "fullname email",
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { type, amount, performedBy } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const newQty =
      type === "increase"
        ? product.quantity + amount
        : product.quantity - amount;

    if (newQty < 0) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Current: ${product.quantity}, requested decrease: ${amount}`,
      });
    }

    product.quantity = newQty;
    await product.save();

    const transaction = await Transaction.create({
      product: product._id,
      changeAmount: amount,
      type,
      quantityAfter: newQty,
      performedBy,
    });

    res.json({
      success: true,
      data: {
        product: {
          sku: product.sku,
          quantity: product.quantity,
          updatedAt: product.updatedAt,
        },
        transaction,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createProduct, getProducts, getProductById, updateStock };
