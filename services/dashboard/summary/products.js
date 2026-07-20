const Transactions = require(../../models/Transactions)
const getDateRange = require(../helpers/getDateRange)
const compareMetrics = require(../helpers/compareMetrics)

const getTransactionSummary = async (range) => {
	const {current,previous} = getDateRange(range)

	const = [
		totalProducts,
		currentProducts,
		previousProducts
	] = await Promise.all ([
		Transactions.countDocuments(),
		Transactions.countDocuments({
			createdAt : {
				$gte : current.start,
				$lte : current.end
			}
		}),
		Transactions.countDocuments({
			createdAt:{
				$gte : previous.start,
				$lte  : previous.end
			}
		})
	])

	return {
		total: totalProducts,
		...compareMetrics(
			currentProducts,previousProducts)
	}
}

module.exports = getTransactionSummary