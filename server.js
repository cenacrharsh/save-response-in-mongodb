const express = require("express");
const dotenv = require("dotenv").config();

//# Database
const db = require("./database/index");
const productModel = require("./database/models/product");
db.init();

//Responses in JSON
const products = require("./categoryResponse");

const PORT = 8000;

const app = express();

const differentProducts = [products.bottle, products.guitar, products.memoryCard, products.samsungPhone, products.trimmer, products.tshirt]


app.get("/", (req, res) => {
  res.send("Save Product Details in MongoDB")
});



app.get("/save", (req, res) => {

  let arrayOfProductObj = []

  differentProducts.forEach((p) => {
    let productInfo = p.product
    let productObj = {
      asin: productInfo.asin,
      productTitle: productInfo.title,
      keywords: productInfo.keywords_list,
      link: productInfo.link,
      brand: productInfo.brand,
      description: productInfo?.description,
      categories: productInfo.categories,
      variants: productInfo?.variants,
      attributes: productInfo?.attributes,
      specifications: productInfo.specifications,
      categoriesFlat: productInfo.categories_flat,
      images: productInfo.images
    }
    arrayOfProductObj.push(productObj)
  })


  arrayOfProductObj.forEach((pobj) => {
    productModel.create(pobj, (err, data) => {
      if (err) {
        console.log("Error occurred", err)
      }
      else {
        console.log("Data saved successfully")
      }
    })
  })

  console.log("counting...")
  res.send(arrayOfProductObj)

});



app.get("/delete", (req, res) => {
  productModel.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    }
  })

  res.send("Product Deleted")

})



//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
