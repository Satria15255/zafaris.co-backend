const Transaction = require("../models/Transaction");

exports.getSalesChart = async (req, res) => {
	try {
		// Query params
		const range = req.query.range || "7d";
		const startDate = req.query.startDate;
		const endDate = req.query.endDate;

		// Date range
		const now = new Date();

		let start = new Date();
		let end = now;

		if (range === "7d") {
			start.setDate(now.getDate() - 7);
		} else if (range === "30d") {
			start.setDate(now.getDate() - 30);
		} else if (range === "90d") {
			start.setDate(now.getDate() - 90);
		} else if (range === "1y") {
			start.setFullYear(now.getFullYear() - 1);
		} else if (startDate && endDate) {
			start = new Date(startDate);
			end = new Date(endDate);
		}

		// Grouping stage
		let groupStage;

		const salesSum = {
			sales: {
				$sum: "$totalPrice",
			},
		};

		if (range === "7d" || range === "30d") {
			groupStage = {
				_id: {
					year: {
						$year: "$createdAt",
					},
					month: {
						$month: "$createdAt",
					},
					day: {
						$dayOfMonth: "$createdAt",
					},
				},
				...salesSum,
			};
		} else if (range === "90d") {
			groupStage = {
				_id: {
					year: {
						$year: "$createdAt",
					},
					week: {
						$week: "$createdAt",
					},
				},
				...salesSum,
			};
		} else {
			// 1y dan custom
			groupStage = {
				_id: {
					year: {
						$year: "$createdAt",
					},
					month: {
						$month: "$createdAt",
					},
				},
				...salesSum,
			};
		}

		// Match stage
		const matchStage = {
			createdAt: {
				$gte: start,
				$lte: end,
			},
			status: {
				$ne: "Cancelled",
			},
		};

		// Aggregate
		const salesData = await Transaction.aggregate([
			{
				$match: matchStage,
			},
			{
				$group: groupStage,
			},
			{
				$sort: {
					"_id.year": 1,
					"_id.month": 1,
					"_id.day": 1,
					"_id.week": 1,
				},
			},
		]);

		// Month labels
		const monthNames = [
			"",
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		// Format response
		const formattedData = salesData.map((item) => {
			let label;

			if (range === "7d" || range === "30d") {
				label = `${item._id.day} ${monthNames[item._id.month]}`;
			} else if (range === "90d") {
				label = `Week ${item._id.week}`;
			} else {
				label = `${monthNames[item._id.month]}`;
			}

			return {
				label,
				sales: item.sales,
			};
		});

		res.status(200).json(formattedData);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
