const Transaction = require("../../../models/Transaction");
const getDateRange = require("../../shared/helpers/getDateRange");
const compareMetrics = require("../../shared/helpers/compareMetrics");

const getProductSoldSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalProductSold, currentProductSold, previousProductSold] =
		await Promise.all([
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
			Transaction.aggregate([
				{
					$match: {
						status: "Completed",

						createdAt: {
							$gte: current.start,
							$lte: current.end,
						},
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
			Transaction.aggregate([
				{
					$match: {
						status: "Completed",

						createdAt: {
							$gte: previous.start,
							$lte: previous.end,
						},
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

	const total = totalProductSold[0]?.totalSold || 0;
	const currentValue = currentProductSold[0]?.totalSold || 0;
	const previousValue = previousProductSold[0]?.totalSold || 0;

	return {
		total: total,
		...compareMetrics(currentValue, previousValue),
	};
};

module.exports = getProductSoldSummary;
