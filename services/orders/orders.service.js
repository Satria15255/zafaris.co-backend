const Transaction = require("../../models/Transaction");
const getDateRange = require("../shared/helpers/getDateRange");
const compareMetrics = require("../shared/helpers/compareMetrics");

const getAllOrders = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalOrders, currentOrders, previousOrders] = await Promise.all([
		Transaction.countDocuments(),
		Transaction.countDocuments({
			createdAt: {
				$gte: current.start,
				$lte: current.end,
			},
		}),
		Transaction.countDocuments({
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

const getCompletedOrders = async (range) => {
	const { current, previous } = getDateRange(range);

	const [
		totalCompletedOrders,
		currentCompletedOrders,
		previousCompletedOrders,
	] = await Promise.all([
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
		total: totalCompletedOrders,
		...compareMetrics(currentCompletedOrders, previousCompletedOrders),
	};
};

const getCancelledOrders = async (range) => {
	const { current, previous } = getDateRange(range);
	const [totalCancelled, currentCancelled, previousCancelled] =
		await Promise.all([
			Transaction.countDocuments({
				status: "Cancelled",
			}),
			Transaction.countDocuments({
				status: "Cancelled",
				createdAt: {
					$gte: current.start,
					$lte: previous.end,
				},
			}),
			Transaction.countDocuments({
				status: "Cancelled",
				createdAt: {
					$gte: previous.start,
					$lte: previous.end,
				},
			}),
		]);

	return {
		total: totalCancelled,
		...compareMetrics(currentCancelled, previousCancelled),
	};
};

const getOrdersProgress = async (range) => {
	const { current, previous } = getDateRange(range);
	const [totalOrdersProgress, currentOrdersProgress, previousOrdersProgress] =
		await Promise.all([
			Transaction.countDocuments({
				status: ["Pending", "Processing", "Shipped", "Delivered"],
			}),

			Transaction.countDocuments({
				status: ["Pending", "Processing", "Shipped", "Delivered"],
				createdAt: {
					$gte: current.start,
					$lte: current.end,
				},
			}),
			Transaction.countDocuments({
				status: ["Pending", "Processing", "Shipped", "Delivered"],
				createdAt: {
					$gte: previous.start,
					$lte: previous.end,
				},
			}),
		]);

	return {
		total: totalOrdersProgress,
		...compareMetrics(currentOrdersProgress, previousOrdersProgress),
	};
};

const getOrdersSummary = async (range) => {
	const [totalOrders, completedOrders, cancelledOrders, progressOrders] =
		await Promise.all([
			getAllOrders(range),
			getCompletedOrders(range),
			getCancelledOrders(range),
			getOrdersProgress(range),
		]);

	return {
		totalOrders,
		completedOrders,
		cancelledOrders,
		progressOrders,
	};
};

module.exports = getOrdersSummary;
