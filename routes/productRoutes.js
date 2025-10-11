const express = require("express");
const router = express.Router();
const { getAllProducts, getLatestProducts, getBestSellerProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../utils/storage");

router.get("/", getAllProducts);
router.get("/latest", getLatestProducts);
router.get("/best-seller", getBestSellerProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
