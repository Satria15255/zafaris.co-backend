const getOrdersSummary = require("./orders");
const getProductsSummary = require("./products");
const getRevenueSummary = require("./revenue");
const getTransactionSummary = require("./transaction");
const getUsersSummary = require("./users");
const getStockSummary = require("./stock");
const getProductSoldSummary = require("./productSold");

const getSummary = async (range) => {
	const [orders, products, revenue, transaction, users, stock, productSold] =
		await Promise.all([
			getOrdersSummary(range),
			getProductsSummary(range),
			getRevenueSummary(range),
			getTransactionSummary(range),
			getUsersSummary(range),
			getStockSummary(range),
			getProductSoldSummary(range),
		]);
	return {
		orders,
		products,
		revenue,
		transaction,
		users,
		stock,
		productSold,
	};
};

module.exports = getSummary;
