const User = require("../../models/User");
const Transaction = require("../../models/Transaction");
const getDateRange = require("../shared/helpers/getDateRange");
const compareMetrics = require("../shared/helpers/compareMetrics");

// Total Users
const getTotalUsersSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalUsers, currentUsers, previousUsers] = await Promise.all([
		User.countDocuments(),
		User.countDocuments({
			createdAt: {
				$gte: current.start,
				$lte: current.end,
			},
		}),
		User.countDocuments({
			createdAt: {
				$gte: previous.start,
				$lte: previous.end,
			},
		}),
	]);

	return {
		total: totalUsers,
		...compareMetrics(currentUsers, previousUsers),
	};
};

const getNewUsersSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [currentUsers, previousUsers] = await Promise.all([
		User.countDocuments({
			createdAt: {
				$gte: current.start,
				$lte: current.end,
			},
		}),
		User.countDocuments({
			createdAt: {
				$gte: previous.start,
				$lte: previous.end,
			},
		}),
	]);

	return {
		total: currentUsers,
		...compareMetrics(currentUsers, previousUsers),
	};
};

const getCustomerSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalCustomer, currentCustomer, previousCustomer] =
		await Promise.all([
			Transaction.aggregate([
				{
					$group: {
						_id: "$user",
					},
				},
				{
					$count: "totalCustomers",
				},
			]),
			Transaction.aggregate([
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
						_id: "$user",
					},
				},
				{
					$count: "totalCustomers",
				},
			]),
			Transaction.aggregate([
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
						_id: "$user",
					},
				},
				{
					$count: "totalCustomers",
				},
			]),
		]);

	const total = totalCustomer[0]?.totalCustomers || 0;
	const currents = currentCustomer[0]?.totalCustomers || 0;
	const previouss = previousCustomer[0]?.totalCustomers || 0;

	return {
		total: total,
		...compareMetrics(currents, previouss),
	};
};

const getAdminSummary = async (range) => {
	const { current, previous } = getDateRange(range);

	const [totalAdmin, currentAdmin, previousAdmin] = await Promise.all([
		User.countDocuments({
			role: "admin",
		}),
		User.countDocuments({
			role: "admin",
			createdAt: {
				$gte: current.start,
				$lte: current.end,
			},
		}),
		User.countDocuments({
			role: "admin",
			createdAt: {
				$gte: previous.start,
				$lte: previous.end,
			},
		}),
	]);

	return {
		total: totalAdmin,
		...compareMetrics(currentAdmin, previousAdmin),
	};
};

const getUsersSummary = async (range) => {
	const [totalUsersSummary, newUsersSummary, customersSummary, adminSummary] =
		await Promise.all([
			getTotalUsersSummary(range),
			getNewUsersSummary(range),
			getCustomerSummary(range),
			getAdminSummary(range),
		]);

	return {
		totalUsersSummary,
		newUsersSummary,
		customersSummary,
		adminSummary,
	};
};

module.exports = getUsersSummary;
