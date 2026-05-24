const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.get("/user", authMiddleware, adminMiddleware, userController.getUser);
router.get("/user/:id/transactions", authMiddleware, adminMiddleware, userController.getUserTransaction);

module.exports = router;
