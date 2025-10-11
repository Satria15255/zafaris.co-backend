const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

router.get("/users", authMiddleware, adminMiddleware, userController.getUser);
router.get("/users/:id/transactions", authMiddleware, adminMiddleware, userController.getUserTransaction);

module.exports = router;
