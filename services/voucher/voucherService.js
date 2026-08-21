const Voucher = require("../../models/Voucher");

const validateVoucher = async ({ code, subTotal, cartItems }) => {
	// Validate Input
	if (!code) {
		throw new Error("Voucher code is required");
	}

	if (!Array.isArray(cartItems) || cartItems.length === 0) {
		throw new Error("Cart is empty");
	}

	// Find Voucher
	const voucher = await Voucher.findOne({
		code: code.toUpperCase().trim(),
	});

	if (!voucher) {
		throw new Error("Voucher not found");
	}

	// Check active status
	if (!voucher.isActive) {
		throw new Error("Voucher is inactive");
	}

	// Check validity period
	const now = new Date();

	if (now < voucher.validity.startDate) {
		throw new Error("Voucher is not active  yet");
	}

	if (now > voucher.validity.endDate) {
		throw new Error("Voucher has expired");
	}

	// Check usage limit
	if (
		voucher.usage.limit !== null &&
		voucher.usage.usedCount >= voucher.usagePerUser
	) {
		throw new Error("Voucher usage limit has been reached");
	}

	// Calculate eligible subtotal
	let eligibleSubtotal = subTotal;

	if (voucher.scope.type === "All") {
		eligibleSubtotal = cartItems.reduce((total, item) => {
			return total + item.finalPrice * item.quantity;
		}, 0);
	}

	if (voucher.scope.type === "products") {
		const eligibleProductsIds = voucher.scope.products.map((productId) =>
			productId.toString(),
		);

		eligibleSubtotal = cartItems.reduce((total, item) => {
			const productId = item.productId.toString();

			if (!eligibleProductsIds.includes(productId)) {
				return total;
			}

			return total + item.finalPrice * item.quantity;
		}, 0);
	}

	// Check eligible products
	if (eligibleSubtotal <= 0) {
		throw new Error("Voucher is not applicable to products in the cart");
	}

	// Check minimum purchase
	if (eligibleSubtotal < voucher.minPurchase) {
		throw new Error(`Minimum purchase is ${voucher.minPurchase}`);
	}

	// Calculate discount
	let discountAmount = 0;

	if (voucher.discount.type === "percentage") {
		discountAmount = eligibleSubtotal * (voucher.discount.value / 100);

		if (
			voucher.maxDiscount !== null &&
			discountAmount > voucher.maxDiscount
		) {
			discountAmount = voucher.maxDiscount;
		}
	}

	if (voucher.discount.type === "fixed") {
		discountAmount = voucher.discount.value;

		if (discountAmount > eligibleSubtotal) {
			discountAmount = eligibleSubtotal;
		}
	}

	// Calculate final price
	const finalTotal = subTotal - discountAmount;

	return {
		voucher,
		subTotal,
		eligibleSubtotal,
		discountAmount,
		finalTotal,
	};
};

module.exports = { validateVoucher };
