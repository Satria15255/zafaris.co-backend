const DAY_IN_MS = 24 * 60 * 60 * 1000;

const RANGE_CONFIG = {
	"1d": {
		label: "Today",
		days: 1,
	},
	"7d": {
		label: "Last 7 Days",
		days: 7,
	},
	"30d": {
		label: "Last 30 Days",
		days: 30,
	},
	"90d": {
		label: "Last 90 Days",
		days: 90,
	},
	"1y": {
		label: "Last 1 year",
		days: 365,
	},
};

const getDateRange = (range = "7d") => {
	const config = RANGE_CONFIG[range] || RANGE_CONFIG["7d"];

	const now = new Date();

	// Current day started
	const currentStart = new Date(now);
	currentStart.setHours(0, 0, 0, 0);

	if (config.days > 1) {
		currentStart.setDate(currentStart.getDate() - (config.days - 1));
	}

	const currentEnd = new Date(now);

	// Duration current period
	const duration = currentEnd.getTime() - currentStart.getTime();

	// Previous period have identic duration
	const previousEnd = new Date(currentStart.getTime() - 1);

	const previousStart = new Date(previousEnd.getTime() - duration);

	return {
		range,

		label: config.label,
		current: {
			start: currentStart,
			end: currentEnd,
		},
		previous: {
			start: previousStart,
			end: previousEnd,
		},
	};
};

module.exports = getDateRange;
