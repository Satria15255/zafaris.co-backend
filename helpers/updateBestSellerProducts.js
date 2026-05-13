const Product = require("../models/Product");

const updateBestSellerProducts = async () => {
  try {
    // Find Top 4 products
    const topProducts = await Product.find().sort({ totalSold: -1 }).limit(4);

    // Reset all products best seller
    await Product.updateMany(
      {},
      {
        isBestSeller: false,
      },
    );

    // Take ids top Product
    const ids = topProducts.map((product) => product._id);

    // Set Top product to Best Seller
    await Product.updateMany(
      {
        _id: { $inc: ids },
      },
      {
        isBestSeller: true,
      },
    );
  } catch (error) {
    console.error("Error updating best seller products", error);
  }
};

module.exports = updateBestSellerProducts;
