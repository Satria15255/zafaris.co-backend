const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
	authMiddleware,
	adminMiddleware,
} = require("../middleware/authMiddleware");

router.get(
	"/user-list",
	authMiddleware,
	adminMiddleware,
	userController.getUser,
);
router.get(
	"/user/:id/transactions",
	authMiddleware,
	adminMiddleware,
	userController.getUserTransaction,
);

router.get(
	"/user/customer-stats",
	authMiddleware,
	adminMiddleware,
	userController.getUserStats,
);

module.exports = router;
