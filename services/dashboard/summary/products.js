const Product = require("../../../models/Product");
const getDateRange = require("../../shared/helpers/getDateRange");
const compareMetrics = require("../../shared/helpers/compareMetrics");

const getProductsSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalProducts, currentProducts, previousProducts] =
		await Promise.all([
			Product.countDocuments(),
			Product.countDocuments({
				createdAt: {
					$gte: current.start,
					$lte: current.end,
				},
			}),
			Product.countDocuments({
				createdAt: {
					$gte: previous.start,
					$lte: previous.end,
				},
			}),
		]);

	return {
		total: totalProducts,
		...compareMetrics(currentProducts, previousProducts),
	};
};

module.exports = getProductsSummary;
