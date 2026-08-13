const express = require("express");
const router = express.Router();

const {
	createVoucher,
	getAllVoucher,
	getVoucherById,
	updateVoucher,
	deactiveVoucher,
} = require("../controllers/voucherController");
const {
	adminMiddleware,
	authMiddleware,
} = require("../middleware/authMiddleware");

router.post("/", createVoucher, adminMiddleware);
router.get("/", getAllVoucher, authMiddleware, adminMiddleware);
router.get("/:id", getVoucherById, adminMiddleware, authMiddleware);
router.put("/:id", updateVoucher, adminMiddleware, authMiddleware);
router.delete("/:id", deactiveVoucher, adminMiddleware, authMiddleware);

module.exports = router;
