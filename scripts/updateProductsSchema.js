const mongoose = require("mongoose");
const Product = require("../models/Product");

mongoose.connect("mongodb+srv://satria123:zafaris-1234.@zafarisco.g0ux7eb.mongodb.net/?retryWrites=true&w=majority&appName=zafarisco");

const updateProduct = async () => {
  try {
    await Product.updateMany(
      {},
      {
        $set: {
          totalSold: 0,
          isBestSeller: false,
        },
      },
    );

    console.log("Products Updated");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

updateProduct();
