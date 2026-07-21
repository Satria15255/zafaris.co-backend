const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const {
	authMiddleware,
	adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", dashboardController.getDashboardStats);
router.get("/summary", dashboardController.getDashboardSummary);

module.exports = router;
