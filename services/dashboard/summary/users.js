const Users = require(../../models/User)
const getDateRange = require(../helpers/getDateRange)
const compareMetrics = require(../helpers/compareMetrics)

const getUsersSummary = async (range) => {
	const {current,previous} = getDateRange(range)

	const = [
		totalUsers,
		currentUsers,
		previousUsers
	] = await Promise.all ([
		Users.countDocuments(),
		Users.countDocuments({
			createdAt : {
				$gte : current.start,
				$lte : current.end
			}
		}),
		Users.countDocuments({
			createdAt:{
				$gte : previous.start,
				$lte  : previous.end
			}
		})
	])

	return {
		total: totalUsers,
		...compareMetrics(
			currentUsers,previousUsers)
	}
}

module.exports = getUsersSummary