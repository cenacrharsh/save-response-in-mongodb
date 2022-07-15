const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
      unique:true
    },
    complete_response: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const responseModel = mongoose.model("response", responseSchema);

module.exports = responseModel;
