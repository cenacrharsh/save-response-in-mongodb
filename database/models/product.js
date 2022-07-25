const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
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
    description:{
        type:String,
        // default:""
    },
    categories:{
        type:[Object],
        required:true
    },
    variants:{
        type:[Object],
    },
    attributes:{
        type:[Object],
    },
    specifications:{
        type:[Object],
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

const productsModel = mongoose.model("products", productsSchema);

module.exports = productsModel;
