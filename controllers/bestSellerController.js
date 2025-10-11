const Cart = require("../models/Cart");

exports.getBestSellers = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Cart.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalAdded: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalAdded: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $product: {
          _id: "$product._id",
          name: "$product.name",
          image: "$product.image",
          price: "$product.price",
          totalAdded: 1,
        },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    console.error("Best Seller Monthly Error", err);
    res.status(500).json({ message: "Failed get best seller monthly" });
  }
};
