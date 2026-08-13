const express  = require("express")
const router = express.Router()

const {
	createVoucher,
	getAllVoucher,
	getVoucherById
	updateVoucher,
	deactiveVoucher
} = require("../controllers/voucherController")
const {adminMiddleware,authMiddleware} = require("../middleware/authMiddleware")

router.post("/",  createVoucher,adminMiddleware)
router.get("/",getAllVoucher,authhMiddleware,adminMiddleware)
router.get("/:id",getVoucherById,adminMiddleware,authhMiddleware)
router.put("/:id",updateVoucher,adminMiddleware,authhMiddleware)
router.delete("/:id",deactiveVoucher,adminMiddleware,authhMiddleware)

module.exports = router