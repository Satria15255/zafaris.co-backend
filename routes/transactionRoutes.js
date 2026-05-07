const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.post("/", authMiddleware, transactionController.createTransaction);
router.get("/latest", authMiddleware, transactionController.getLatestTransaction);
router.put("/:id/status", authMiddleware, adminMiddleware, transactionController.updateTransactionStatus);
router.put("/cancel/:id", authMiddleware, transactionController.cancelTransaction);
router.get("/mytransactions", authMiddleware, transactionController.getUserTransaction);
router.get("/:id" , authMiddleware, transactionController.getTransactionById)
router.get("/", authMiddleware, adminMiddleware, transactionController.getAllTransaction);
router.patch("/:id/confirm", authMiddleware, transactionController.confirmReceived);
router.patch("/:id/payment", authMiddleware, transactionController.payTransaction)

module.exports = router;
