const mongoose = require("mongoose");

const memorycardSchema = new mongoose.Schema(
  {
    asin: {
      type: String,
      required: true,
      unique:true
    },
    productTitle: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      required: true,
    },
    link:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true
    },
    categories:{
        type:[Object],
        required:true
    },
    categoriesFlat:{
        type:String,
        required:true,
    },
    images:{
        type:[Object],
        required:true
    }
  },
  {
    timestamps: true,
  }
);

const memorycardModel = mongoose.model("memorycard", memorycardSchema);

module.exports = memorycardModel;
