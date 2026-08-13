const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
			default: "",
		},
		discount: {
			type: {
				type: String,
				enum: ["percentage", "fixed"],
				required: true,
			},
			value: {
				type: Number,
				required: true,
				min: 0,
			},
		},
		minPurchase: {
			type: Number,
			default: 0,
			min: 0,
		},
		maxDiscount: {
			type: Number,
			default: null,
			min: 0,
		},
		usage: {
			limit: {
				type: Number,
				default: null,
				min: 1,
			},
			usedCount: {
				type: Number,
				default: 0,
				min: 0,
			},
		},
		usagePerUser: {
			type: Number,
			default: null,
			min: 1,
		},
		validity: {
			startDate: {
				type: Date,
				required: true,
			},
			endDate: {
				type: Date,
				required: true,
			},
		},
		scope: {
			type: {
				type: String,
				enum: ["All", "products"],
				default: "All",
			},
			products: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			],
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	},
);

module.exports = mongoose.model("Voucher", voucherSchema);
