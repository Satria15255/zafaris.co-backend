const Product = require("../models/Product");
const DailyDiscount = require("../models/DailyDiscount");

exports.createDailyDiscount = async () => {
  try {
    await DailyDiscount.deleteMany({
      expiresAt: { $lte: new Date() },
    });

    const randomProducts = await Product.aggregate([{ $sample: { size: 6 } }]);

    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    for (const product of randomProducts) {
      const discountPrice = product.price * 0.7;
      await DailyDiscount.create({
        productId: product._id,
        discountPercent: 30,
        discountPrice,
        expiresAt,
      });
    }

    console.log("Daily discounts created successfully");
  } catch (err) {
    console.error("Error creating daily discounts", err);
  }
};

exports.getDailyDiscounts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    console.log("Jumlah Produk:", allProducts.length);
    const discounts = await DailyDiscount.find().populate("productId");
    res.status(200).json(discounts);
    console.log("Diskon Hari Ini:", await DailyDiscount.find());
  } catch (error) {
    console.error("Error fetching daily discounts", error);
    res.status(500).json({ message: "Failed get daily discounts", error: error.message });
  }
};
