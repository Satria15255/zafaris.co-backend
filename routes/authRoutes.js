const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { registerUser, loginUser, updateProfile, updatePassword } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/user/profile", authMiddleware, updateProfile);
router.put("/user/change-password", authMiddleware, updatePassword);
module.exports = router;
