const express = require("express");
const router = express.Router();
const {
  getTransactions,
  getTransactionsByProduct,
} = require("../controllers/transaction.controller");

router.get("/", getTransactions);
router.get("/:productId", getTransactionsByProduct);

module.exports = router;
