const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Transaction = require("../models/Transaction");
const getSummary = require("../services/dashboard/summary");
const getProductsSummary = require("../services/products/products.service");
const getOrdersSummary = require("../services/orders/orders.service");
const getUsersSummary = require("../services/users/users.service");

exports.getDashboardSummary = async (req, res) => {
	try {
		const range = req.query.range || "7d";

		const summary = await getSummary(range);

		res.status(200).json(summary);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getProductsSummary = async (req, res) => {
	try {
		const range = req.query.range || "7d";

		const summary = await getProductsSummary(range);

		res.status(200).json(summary);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getOrdersSummary = async (req, res) => {
	try {
		const range = req.query.range || "7d";

		const summary = await getOrdersSummary(range);

		res.status(200).json(summary);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.getUsersSummary = async (req, res) => {
	try {
		const range = req.query.range || "7d";

		const summary = await getUsersSummary(range);

		res.status(200).json(summary);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
