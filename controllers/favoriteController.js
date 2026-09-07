const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");

// GET FAVORITE
exports.getFavorites = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).populate("favorites");

		if (!user) {
			res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({
			message: "Fetch favorites success",
			favorites: user.favorites,
		});
	} catch (error) {
		console.error("failed get favorites", error);

		res.status(500).json({
			message: "Failed get Favorites product",
			error: error.message,
		});
	}
};

// ADD FAVORITES
// ADD FAVORITE
exports.addFavorites = async (req, res) => {
	try {
		const { productId } = req.params;

		if (!mongoose.isValidObjectId(productId)) {
			return res.status(400).json({
				message: "Invalid product ID",
			});
		}

		const productExists = await Product.exists({
			_id: productId,
		});

		if (!productExists) {
			return res.status(404).json({
				message: "Product not found",
			});
		}

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$addToSet: {
					favorites: productId,
				},
			},
			{
				new: true,
			},
		).populate("favorites");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.status(200).json({
			message: "Product added to favorites",
			favorites: user.favorites,
		});
	} catch (error) {
		console.error("Failed adding favorite:", error);

		res.status(500).json({
			message: "Failed adding favorite",
		});
	}
};

// REMOVE FROM FAVORITES
exports.removeFavorite = async (req, res) => {
	try {
		const { productId } = req.params;

		if (!mongoose.isValidObjectId(productId)) {
			return res.status(400).json({
				message: "Invalid product ID",
			});
		}

		const user = await User.findByIdAndUpdate(
			req.user.id,
			{
				$pull: {
					favorites: productId,
				},
			},
			{
				new: true,
			},
		).populate("favorites");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
			});
		}

		res.status(200).json({
			message: "Product removed from favorites",
			favorites: user.favorites,
		});
	} catch (error) {
		console.error("Failed removing favorite:", error);

		res.status(500).json({
			message: "Failed removing favorite",
		});
	}
};
