const User = require("../models/User");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "INternal server error" });
  }
};

exports.getUserTransaction = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID user tidak valid" });
    }

    const userId = new mongoose.Types.ObjectId(req.params.id);

    const transactions = await Transaction.find({ user: userId }).populate("user", "name email");

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error get user transaction", err });
  }
};
