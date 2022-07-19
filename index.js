const express = require("express");
const phoneResponse = require("./phoneResponse/phone");
const dotenv = require("dotenv").config();

//# Database
const db = require("./database/index");
const productModel = require("./database/models/product");
db.init();

const PORT = 8000;

const app = express();


app.get("/", (req, res) => {
  let responseObj = {
    asin: response.product.asin,
    complete_response: response,
  };

  responseModel.create(responseObj, (err, data) => {
    if (err) {
      res.json({
        message: "Duplicate ASIN",
        error: err,
      });
      console.log("Error occurred while saving data in DB");
    } else {
      console.log("Complete JSON Response Saved In MongoDB Successfully !!!");
      res.status(200).json({
        message: "Complete JSON Response Saved In MongoDB Successfully !!!",
        data: data,
      });
    }
  });
});


app.get("/phone", (req, res) => {
  let myProduct = phoneResponse.google
    let memoryObj = {
        asin: myProduct.asin,
        productTitle:  myProduct.title,
        keywords: myProduct.keywords_list,
        link: myProduct.link,
        brand: myProduct.brand,
        categories: myProduct.categories,
        categoriesFlat: myProduct.categories_flat,
        images: myProduct.images
    }

    productModel.create(memoryObj,(err,data)=>{
        if(err){
            res.json({error:err,message:"Duplicate ASIN"})
            console.log("Error occurred",err)
        }
        else{
            res.json({data:memoryObj,message:"Data Saved In MongoDB Successfully !!!"})
            console.log("Data saved successfully")
        }
    })
});

//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
