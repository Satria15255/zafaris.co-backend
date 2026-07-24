const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const {
	authMiddleware,
	adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", dashboardController.getDashboardSummary);
router.get("/products", dashboardController.getProductsSummary);
router.get("/orders", dashboardController.getOrdersSummary);
router.get("/users", dashboardController.getUsersSummary);

module.exports = router;
