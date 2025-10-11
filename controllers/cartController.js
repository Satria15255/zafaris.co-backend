const Cart = require("../models/Cart");

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1, size } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, size }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString() && String(item.size) === String(size));
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size });
      }
    }
    await cart.save();
    res.status(200).json({ message: "product add to cart", cart });
  } catch (error) {
    console.error("Add to cart failed", error);
    res.status(500).json({ message: "Failed add to cart" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    res.status(200).json({ items: cart.items });
  } catch (err) {
    console.error("Get cart err", err);
    res.status(500).json({ message: "Failed to get cart" });
  }
};

exports.updateQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, size, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => item.productId && item.productId.toString() === productId && item.size === size);

    if (itemIndex === -1) return res.status(404).json({ message: "Item not found" });

    if (quantity < 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("update error", err);
    return res.status(500).json({ message: "Failed top update cart" });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, size } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not Found" });

    cart.items = cart.items.filter((item) => !(item.productId.toString() === productId && String(item.size) === String(size)));

    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error("Remove cart item error", err);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Error clear cart", err);
    res.status(500).json({ message: "Failed clear cart" });
  }
};
