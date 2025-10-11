const Product = require("../models/Product");
const Transaction = require("../models/Transaction");

exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(4);
    res.json(latestProducts);
  } catch (error) {
    console.error("Failed fecthing latest product", error);
    res.status(500).json({ message: "Error latest product" });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

exports.createProduct = async (req, res) => {
  console.log("POST masuk ke route");
  try {
    if (!req.file) {
      return res.status(400).json({ message: "IMage si required" });
    }

    const sizes = typeof req.body.sizes === "string" ? req.body.sizes.split(",").map(Number) : req.body.sizes;

    const product = new Product({ ...req.body, sizes, image: req.file.path, createdBy: req.user?.id || null });
    const saved = await product.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("create product error", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields satu per satu
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;

    // Ubah sizes dari string ke array number
    if (req.body.sizes) {
      product.sizes = req.body.sizes.split(",").map((s) => parseInt(s.trim()));
    }

    // Jika ada gambar baru diunggah
    if (req.file) {
      product.image = req.file.path; // pastikan kamu sudah setup upload ke Cloudinary di middleware
    }

    await product.save();

    return res.json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ message: "Failed to edit product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

exports.getBestSellerProducts = async (req, res) => {
  try {
    const bestSellers = await Transaction.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $replaceRoot: { newRoot: "$productDetails" },
      },
    ]);

    res.json(bestSellers);
  } catch (err) {
    console.error("Error fetching best seller", err);
    res.status(500).json({ message: "Failed get best sellers products", err: err.message });
  }
};
