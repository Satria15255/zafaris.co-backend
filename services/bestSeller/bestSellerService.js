const Product = require("../../models/Product");
const Transaction = require("../../models/Transaction");

const syncBestSellerProducts = async () => {
  const bestSellerStats = await Transaction.aggregate([
    {
      $match: {
        status: "Completed",
      },
    },

    {
      $unwind: "$products",
    },

    {
      $group: {
        _id: "$products.product",
        totalSold: {
          $sum: "$products.quantity",
        },
      },
    },

    {
      $sort: {
        totalSold: -1,
      },
    },

    {
      $limit: 4,
    },
  ]);

  const bestSellerIds = bestSellerStats.map((item) => item._id);

  // Product yang tidak lagi Top 4 → false
  await Product.updateMany(
    {
      isBestSeller: true,
      _id: {
        $nin: bestSellerIds,
      },
    },
    {
      $set: {
        isBestSeller: false,
      },
    },
  );

  // Top 4 → true
  if (bestSellerIds.length > 0) {
    await Product.updateMany(
      {
        _id: {
          $in: bestSellerIds,
        },
      },
      {
        $set: {
          isBestSeller: true,
        },
      },
    );
  }
};

module.exports = {
  syncBestSellerProducts,
};
