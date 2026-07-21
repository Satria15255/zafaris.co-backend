const Transactions = require("../../../models/Transaction");
const getDateRange = require("../helpers/getDateRange");
const compareMetrics = require("../helpers/compareMetrics");

const getTransactionSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalTransactions, currentTransactions, previousTransactions] =
		await Promise.all([
			Transactions.countDocuments(),
			Transactions.countDocuments({
				createdAt: {
					$gte: current.start,
					$lte: current.end,
				},
			}),
			Transactions.countDocuments({
				createdAt: {
					$gte: previous.start,
					$lte: previous.end,
				},
			}),
		]);

	return {
		total: totalTransactions,
		...compareMetrics(currentTransactions, previousTransactions),
	};
};

module.exports = getTransactionSummary;
