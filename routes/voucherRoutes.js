const express = require("express");
const router = express.Router();

const {
	createVoucher,
	getAllVoucher,
	getVoucherById,
	updateVoucher,
	deactiveVoucher,
	applyVoucher,
} = require("../controllers/voucherController");
const {
	adminMiddleware,
	authMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", authMiddleware, adminMiddleware, createVoucher);
router.post("/apply", authMiddleware, applyVoucher);
router.get("/", authMiddleware, getAllVoucher);
router.get("/:id", authMiddleware, getVoucherById);
router.put("/:id", adminMiddleware, authMiddleware, updateVoucher);
router.delete("/:id", adminMiddleware, authMiddleware, deactiveVoucher);

module.exports = router;
