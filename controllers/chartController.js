const Transaction = require("../models/Transaction");

exports.getSalesChart = async (req, res) => {
	try {
		// Query params
		const range = req.query.range || "7d";
		const startDate = req.query.startDate;
		const endDate = req.query.endDate;
		const isCustomRange = startDate && endDate;
		// Date range
		const now = new Date();

		let start = new Date();
		let end = now;
		let customRangeDays = 0;

		if (range === "7d") {
			start.setDate(now.getDate() - 7);
		} else if (range === "30d") {
			start.setDate(now.getDate() - 30);
		} else if (range === "90d") {
			start.setDate(now.getDate() - 90);
		} else if (range === "1y") {
			start.setFullYear(now.getFullYear() - 1);
		} else if (isCustomRange) {
			start = new Date(startDate);
			end = new Date(endDate);

			customRangeDays = Math.ceil(
				(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
			);
		}

		// Grouping stage
		let groupStage;

		const salesSum = {
			sales: {
				$sum: "$totalPrice",
			},
		};

		if (
			range === "7d" ||
			range === "30d" ||
			(isCustomRange && customRangeDays <= 31)
		) {
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

		start.setHours(0, 0, 0, 0);
		end.setHours(23, 59, 59, 999);

		// Match stage
		const matchStage = {
			createdAt: {
				$gte: start,
				$lte: end,
			},
			paymentStatus: "Paid",
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

			if (
				range === "7d" ||
				range === "30d" ||
				(isCustomRange && customRangeDays <= 31)
			) {
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

		const salesMap = new Map();

		formattedData.forEach((item) => {
			salesMap.set(item.label, item.sales);
		});

		let finalData = [];

		if (
			range === "7d" ||
			range === "30d" ||
			(isCustomRange && customRangeDays <= 31)
		) {
			const currentDate = new Date(start);

			while (currentDate <= end) {
				const day = currentDate.getDate();

				const month = monthNames[currentDate.getMonth() + 1];

				const label = `${day} ${month}`;

				finalData.push({
					label,
					sales: salesMap.get(label) || 0,
				});

				currentDate.setDate(currentDate.getDate() + 1);
			}
		} else if (range === "1y" || (isCustomRange && customRangeDays > 31)) {
			const currentDate = new Date(start);

			currentDate.setDate(1);

			while (currentDate <= end) {
				const label = monthNames[currentDate.getMonth() + 1];

				finalData.push({
					label,
					sales: salesMap.get(label) || 0,
				});

				currentDate.setMonth(currentDate.getMonth() + 1);
			}
		} else {
			finalData = formattedData;
		}

		console.log("formattedData:", formattedData);
		console.log("finalData:", finalData);
		res.status(200).json(finalData);
	} catch (error) {
		res.status(500).json({
			message: error.message,
		});
	}
};
