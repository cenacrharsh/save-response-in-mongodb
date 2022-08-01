const mongoose = require("mongoose");

const mappedProductSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    scrapeId: {
      type: String,
      required: true,
    },
    mappedField: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mappedProductModel = mongoose.model("mappedProduct", mappedProductSchema);

module.exports = mappedProductModel;
