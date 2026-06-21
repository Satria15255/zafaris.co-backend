const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");
const Transaction = require("../models/Transaction");

exports.getDashboardStats = async (req, res) => {
	try {
		const [
			totalProducts,
			totalTransactions,
			totalCompletedOrders,
			stockResult,
			revenueResult,
			soldResult,
		] = await Promise.all([
			Product.countDocuments(),
			Transaction.countDocuments(),
			Transaction.countDocuments({
				status: "Completed",
			}),
			ProductVariant.aggregate([
				{
					$group: {
						_id: null,
						totalStock: {
							$sum: "$stock",
						},
					},
				},
			]),

			Transaction.aggregate([
				{
					$match: {
						status: "Completed",
					},
				},
				{
					$group: {
						_id: null,
						totalRevenue: {
							$sum: "$totalPrice",
						},
					},
				},
			]),

			Transaction.aggregate([
				{
					$match: {
						status: "Completed",
					},
				},
				{
					$unwind: "$products",
				},
				{
					$group: {
						_id: null,
						totalSold: {
							$sum: "$products.quantity",
						},
					},
				},
			]),
		]);

		const totalStock = stockResult[0]?.totalStock || 0;
		const totalRevenue = revenueResult[0]?.totalRevenue || 0;
		const totalProductSold = soldResult[0]?.totalSold || 0;

		res.status(200).json({
			totalProducts,
			totalStock,
			totalRevenue,
			totalCompletedOrders,
			totalProductSold,
			totalTransactions,
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed get Dashboard Statistic",
			error: error.message,
		});
	}
};
