const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { registerUser, loginUser, getUserProfile, updateProfile, updatePassword } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/profile", authMiddleware, getUserProfile);
router.put("/user/profile", authMiddleware, updateProfile);
router.put("/user/change-password", authMiddleware, updatePassword);
module.exports = router;
