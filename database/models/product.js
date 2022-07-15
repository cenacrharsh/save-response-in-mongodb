const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    product_details: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
