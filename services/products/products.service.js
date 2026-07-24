const Product = require("../../models/Product");
const ProductVariant = require("../../models/ProductVariant");
const getDateRange = require("../shared/helpers/getDateRange");
const compareMetrics = require("../shared/helpers/compareMetrics");

const getTotalProductsSummary = async (range) => {
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

const getProductBrandSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalBrand, currentBrand, previousBrand] = await Promise.all([
		Product.aggregate([
			{
				$group: {
					_id: "$brand",
				},
			},
			{
				$count: "totalUniqueBrands",
			},
		]),
		Product.aggregate([
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
					_id: "$brand",
				},
			},
			{
				$count: "totalUniqueBrands",
			},
		]),
		Product.aggregate([
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
					_id: "$brand",
				},
			},
			{
				$count: "totalUniqueBrands",
			},
		]),
	]);

	const total = totalBrand[0]?.totalUniqueBrands || 0;
	const currentTotalBrand = currentBrand[0]?.totalUniqueBrands || 0;
	const previousTotalBrand = previousBrand[0]?.totalUniqueBrands || 0;

	return {
		total: total,
		...compareMetrics(currentTotalBrand, previousTotalBrand),
	};
};

const getProductCategorySummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalCategory, currentCategory, previousCategory] =
		await Promise.all([
			Product.aggregate([
				{
					$group: {
						_id: "$category",
					},
				},
				{
					$count: "totalUniqueCategories",
				},
			]),
			Product.aggregate([
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
						_id: "$category",
					},
				},
				{
					$count: "totalUniqueCategories",
				},
			]),
			Product.aggregate([
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
						_id: "$category",
					},
				},
				{
					$count: "totalUniqueCategories",
				},
			]),
		]);

	const total = totalCategory[0]?.totalUniqueCategories || 0;
	const currentTotalCategory = currentCategory[0]?.totalUniqueCategories || 0;
	const previousTotalCategory =
		previousCategory[0]?.totalUniqueCategories || 0;

	return {
		total: total,
		...compareMetrics(currentTotalCategory, previousTotalCategory),
	};
};

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

const getProductsSummary = async (range) => {
	const [productsTotal, productsBrand, productsCategory, totalStock] =
		await Promise.all([
			getTotalProductsSummary(range),
			getProductBrandSummary(range),
			getProductCategorySummary(range),
			getStockSummary(range),
		]);
	return {
		productsTotal,
		productsBrand,
		productsCategory,
		totalStock,
	};
};

module.exports = getProductsSummary;
