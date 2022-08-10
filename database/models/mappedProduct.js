const mongoose = require("mongoose");

const mappedProductSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    scrape_id: {
      type: String,
      required: true,
    },
    mapped_attributes: {
      type: [Object],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const mappedProductModel = mongoose.model("mappedProduct", mappedProductSchema);

module.exports = mappedProductModel;


