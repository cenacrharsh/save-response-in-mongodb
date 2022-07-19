const mongoose = require("mongoose");

const genericProductSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
      unique: false,
    },
    productTitle: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    categories: {
      type: [Object],
      required: true,
    },
    variants: {
      type: [Object],
    },
    attributes: {
      type: [Object],
    },
    specifications: {
      type: [Object],
    },
    categoriesFlat: {
      type: String,
      required: true,
    },
    images: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const genericProductModel = mongoose.model(
  "genericProduct",
  genericProductSchema
);

module.exports = genericProductModel;
