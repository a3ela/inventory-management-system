const Transaction = require("../models/Transaction");
const Product = require("../models/Product");

const getTransactions = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const { search } = req.query;

    let filter = {};

    if (search) {
      const matchingProducts = await Product.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      filter = { product: { $in: matchingProducts.map((p) => p._id) } };
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("product", "sku name")
        .populate("performedBy", "fullname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const getTransactionsByProduct = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ product: req.params.productId })
        .populate("performedBy", "fullname email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ product: req.params.productId }),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTransactions, getTransactionsByProduct };
