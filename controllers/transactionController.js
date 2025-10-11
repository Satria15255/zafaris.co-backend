const Transaction = require("../models/Transaction");
const Product = require("../models/Product");

// CREATE transaction

// CREATE transaction
exports.createTransaction = async (req, res) => {
  try {
    const { products, message, shippingMethod, paymentMethod, shippingAddress, voucherCode } = req.body;

    const userId = req.user.id;

    // Hitung quantity berdasarkan product + size
    const productMap = {}; // key = productId-size, value = { product, size, quantity }

    for (const item of products) {
      const key = `${item.product}-${item.size}`;
      if (!productMap[key]) {
        productMap[key] = { product: item.product, size: item.size, quantity: 1 };
      } else {
        productMap[key].quantity += 1;
      }
    }

    let totalProducts = 0;
    let totalPrice = 0;
    const productsForTransaction = [];

    // Ambil data produk untuk harga dan hitung total price
    for (const key in productMap) {
      const { product, size, quantity } = productMap[key];

      const productData = await Product.findById(product);
      if (!productData) {
        return res.status(400).json({ message: `Product not found: ${product}` });
      }

      const pricePerUnit = productData.price;
      const subtotal = pricePerUnit * quantity;

      totalProducts += quantity;
      totalPrice += subtotal;

      productsForTransaction.push({
        product,
        size,
        quantity,
        pricePerUnit,
        subtotal,
      });
    }

    const newTransaction = new Transaction({
      user: userId,
      products: productsForTransaction,
      totalProducts,
      totalPrice,
      message,
      shippingMethod,
      paymentMethod,
      shippingAddress,
      voucherCode,
      status: "pending_confirmation", // Default status
    });

    await newTransaction.save();

    res.status(201).json({ message: "Transaction saved", transaction: newTransaction });
  } catch (error) {
    console.error("Error creating transaction", error.message);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

exports.getUserTransaction = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can view their transactions" });
    }
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).populate("products.product", "name price image");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions history", error });
  }
};

exports.getAllTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user", "name email").populate("products.product", "name price image");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to update transaction status", error: err.message });
  }
};

exports.cancelTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== userId) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    if (transaction.status === "shipped" || transaction.status === "delivered") {
      return res.status(400).json({ message: "The order has been shipped and cannot be cancelled." });
    }

    transaction.status = "cancelled";
    await transaction.save();

    res.status(200).json({ message: "Transaction cancel succesfully", transaction });
  } catch (err) {
    res.status(500).json({ message: "Failed cancelled transaction", error: err.message });
  }
};

exports.getLatestTransaction = async (req, res) => {
  try {
    const latest = await Transaction.findOne({ user: req.user.id, status: "pending_confirmation" }).sort({ createdAt: -1 }).populate("products.product");

    if (!latest) return res.status(404).json({ message: "No recent transaction found" });

    res.json(latest);
  } catch (error) {
    console.error("Error fetching latest transaction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirmReceived = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorization" });
    }

    if (transaction.status !== "delivered") {
      return res.status(400).json({ message: "Order is not delivered yet" });
    }

    transaction.status = "completed";
    await transaction.save();

    res.status(200).json({ message: "Order confirmed as received", transaction });
  } catch (err) {
    res.status(500).json({ message: "Failed to confirm order", error: err.message });
  }
};
