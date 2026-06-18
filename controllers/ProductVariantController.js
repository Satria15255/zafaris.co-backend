const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");

exports.createVariant = async (req, res) => {
  try {
    const { productId, size, stock } = req.body;

    const existingVariant = await ProductVariant.findOne({
      product: productId,
      size,
    });

    if (existingVariant) {
      return res.status(400).json({
        success: false,
        message: "Variant size already exists",
      });
    }

    const variant = await ProductVariant.create({
      product: productId,
      size,
      stock,
    });

    res.status(201).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVariantsByProduct = async (req, res) => {
  try {
    const variants = await ProductVariant.find({
      product: req.params.productId,
    }).sort({ size: 1 });

    res.status(200).json({
      success: true,
      count: variants.length,
      data: variants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVariantById = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateVariant = async (req, res) => {
  try {
    const { size, stock } = req.body;

    const variant = await ProductVariant.findByIdAndUpdate(
      req.params.id,
      {
        size,
        stock,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findByIdAndDelete(req.params.id);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
