const mongoose = require("mongoose");
const Product = require("../models/Product");
const ProductVariant = require("../models/ProductVariant");

async function seedVariants() {
	const products = await Product.find();

	const defaultSizes = [39, 40, 41, 42, 43];

	for (const product of products) {
		for (const size of defaultSizes) {
			await ProductVariant.create({
				product: produtct._id,
				size,
				stock: 10,
			});
		}
	}

	console.log("Variantt Successfull Updated");
}

seedVariants();
