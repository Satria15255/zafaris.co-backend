const Transactions = require(../../models/Transactions)
const getDateRange = require(../helpers/getDateRange)
const compareMetrics = require(../helpers/compareMetrics)

const getOrdersSummary = async (range) => {
	const {current,previous} = getDateRange(range)

	const = [
		totalOrders,
		currentOrders,
		previousOrders
	] = await Promise.all ([
		Transactions.countDocuments({
			status: "Completed"
		}),
		Transactions.countDocuments({
			status : "Completed",
			createdAt : {
				$gte : current.start,
				$lte : current.end
			}
		}),
		Transactions.countDocuments({
			status: "Completed",
			createdAt:{
				$gte : previous.start,
				$lte  : previous.end
			}
		})
	])

	return {
		total: totalOrders,
		...compareMetrics(
			currentOrders,previousOrders)
	}
}

module.exports = getOrdersSummary