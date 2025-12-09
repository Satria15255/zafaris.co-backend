const express = require("express");
const router = express.Router();
const { getAllProducts, getLatestProducts, getBestSellerProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { getDailyDiscounts, createDailyDiscount } = require("../controllers/discountController");
const upload = require("../utils/storage");

router.get("/", getAllProducts);
router.get("/latest", getLatestProducts);
router.get("/best-seller", getBestSellerProducts);
router.get("/:id", getProductById);
router.get("/discounts/today", getDailyDiscounts);
router.get("/discounts/generate", createDailyDiscount);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateProduct);
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

router.get("/generate-discount", async (req, res) => {
  await createDailyDiscount();
  res.send("Diskon di-generate");
});


module.exports = router;
