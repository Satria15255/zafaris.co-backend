const express = require("express");
const { getSalesChart } = require("../controllers/chartController");
const {
	authMiddleware,
	adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getSalesChart, adminMiddleware);

module.exports = router;
