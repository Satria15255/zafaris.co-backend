const Transactions = require("../../../models/Transaction");
const getDateRange = require("../../shared/helpers/getDateRange");
const compareMetrics = require("../../shared/helpers/compareMetrics");

const getRevenueSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalRevenue, currentRevenue, previousRevenue] = await Promise.all([
		Transactions.aggregate([
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
		Transactions.aggregate([
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
				$group: {
					_id: null,

					totalRevenue: {
						$sum: "$totalPrice",
					},
				},
			},
		]),
		Transactions.aggregate([
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
				$group: {
					_id: null,

					totalRevenue: {
						$sum: "$totalPrice",
					},
				},
			},
		]),
	]);

	const total = totalRevenue[0]?.totalRevenue || 0;
	const currentValue = currentRevenue[0]?.totalRevenue || 0;
	const previousValue = previousRevenue[0]?.totalRevenue || 0;

	return {
		total: total,
		...compareMetrics(currentValue, previousValue),
	};
};

module.exports = getRevenueSummary;
