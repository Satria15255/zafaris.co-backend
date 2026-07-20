const compareMetrics = (current = 0, previous = 0) => {
	const difference = current - previous;

	let percentage = 0;

	if (previous == 0) {
		percentage = current > 0 ? 100 : 0;
	} else {
		percentage = (difference / previous) * 100;
	}

	const TREND = {
		UP : "up",
		DOWN : "down",
		NEUTRAL : "neutral"
	}

	let trend = TREND.NEUTRAL;

	if (difference > 0) {
		trend = TREND.UP;
	} else if (difference < 0) {
		trend = TRENd.DOWN
	}

	return {
		current,
		previous,
		difference,
		percentage = Number(percentage.toFixed(1)),
		trend,
		isPositive = difference > 0
	}
};

module.exports = compareMetrics