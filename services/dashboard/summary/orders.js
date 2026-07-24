const Transaction = require("../../../models/Transaction");
const getDateRange = require("../../shared/helpers/getDateRange");
const compareMetrics = require("../../shared/helpers/compareMetrics");

const getOrdersSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalOrders, currentOrders, previousOrders] = await Promise.all([
		Transaction.countDocuments({
			status: "Completed",
		}),
		Transaction.countDocuments({
			status: "Completed",
			createdAt: {
				$gte: current.start,
				$lte: current.end,
			},
		}),
		Transaction.countDocuments({
			status: "Completed",
			createdAt: {
				$gte: previous.start,
				$lte: previous.end,
			},
		}),
	]);

	return {
		total: totalOrders,
		...compareMetrics(currentOrders, previousOrders),
	};
};

module.exports = getOrdersSummary;
