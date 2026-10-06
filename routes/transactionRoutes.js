const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const {
	authMiddleware,
	adminMiddleware,
} = require("../middleware/authMiddleware");
const { sensitiveLimiter } = require("../middleware/rateLimiter");

router.post(
	"/",
	authMiddleware,
	sensitiveLimiter,
	transactionController.createTransaction,
);
router.put(
	"/:id/status",
	authMiddleware,
	adminMiddleware,
	transactionController.updateTransactionStatus,
);
router.put(
	"/cancel/:id",
	authMiddleware,
	transactionController.cancelTransaction,
);
router.get(
	"/mytransactions",
	authMiddleware,
	transactionController.getUserTransaction,
);
router.get("/:id", authMiddleware, transactionController.getTransactionById);
router.get(
	"/",
	authMiddleware,
	adminMiddleware,
	transactionController.getAllTransaction,
);
router.patch(
	"/:id/confirm",
	authMiddleware,
	transactionController.confirmReceived,
);
router.patch(
	"/:id/payment",
	authMiddleware,
	sensitiveLimiter,
	transactionController.payTransaction,
);

module.exports = router;
