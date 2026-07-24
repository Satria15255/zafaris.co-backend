const ProductVariant = require("../../../models/ProductVariant");
const getDateRange = require("../../shared/helpers/getDateRange");
const compareMetrics = require("../../shared/helpers/compareMetrics");

const getStockSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalStock, currentStock, previousStock] = await Promise.all([
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
		ProductVariant.aggregate([
			{
				$match: {
					createdAt: {
						$gte: current.start,
						$lte: current.end,
					},
				},
			},
			{
				$group: {
					_id: null,
					totalStock: {
						$sum: "$stock",
					},
				},
			},
		]),
		ProductVariant.aggregate([
			{
				$match: {
					createdAt: {
						$gte: previous.start,
						$lte: previous.end,
					},
				},
			},
			{
				$group: {
					_id: null,
					totalStock: {
						$sum: "$stock",
					},
				},
			},
		]),
	]);

	const total = totalStock[0]?.totalStock || 0;
	const currentValue = currentStock[0]?.totalStock || 0;
	const previousValue = previousStock[0]?.totalStock || 0;

	return {
		total: total,
		...compareMetrics(currentValue, previousValue),
	};
};

module.exports = getStockSummary;
