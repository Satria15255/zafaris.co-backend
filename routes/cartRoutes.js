const express = require("express");
const router = express.Router();
const { addToCart, getUserCart, updateQuantity, removeCartItem, clearCart } = require("../controllers/cartController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getUserCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/clear", authMiddleware, clearCart);
router.delete("/remove/:productId/:size", authMiddleware, removeCartItem);

module.exports = router;
