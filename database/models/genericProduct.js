const mongoose = require("mongoose");

const genericProductSchema = new mongoose.Schema(
  {
    marketplace: {
      type: String,
      required: true,
    },
    asin: {
      type: String,
      required: true,
      unique: false,
    },
    title: {
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
    feature_bullets: {
      type: [String],
      required: true,
    },
    categories: {
      type: [Object],
      required: true,
    },
    images: {
      type: [Object],
      required: true,
    },
    description: {
      type: String,
    },
    variants: {
      type: [Object],
    },
    attributes: {
      type: [Object],
    },
    specifications: {
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
