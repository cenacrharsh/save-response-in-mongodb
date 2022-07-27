const express = require("express");
const dotenv = require("dotenv").config();
const fs = require("fs");

//# Product JSON
// const arrayOfProductJsons = require("./categoryResponse/index.js");
const arrayOfProductJsons = require("./amazon_in_scrape/index.js");

//# Database
const db = require("./database/index");
const responseModel = require("./database/models/response");
const productModel = require("./database/models/product");
const genericProductModel = require("./database/models/genericProduct");
db.init();

const PORT = 8000;

const app = express();

//! Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!!!</h1>");
});

app.get("/response", (req, res) => {
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

app.get("/product", (req, res) => {
  let responseObj = {
    asin: response.product.asin,
    product_details: response.product,
  };

  productModel.create(responseObj, (err, data) => {
    if (err) {
      res.json({
        message: "Error Occurred while saving data in DB",
        error: err,
      });
      console.log("Error occurred while saving data in DB", err);
    } else {
      console.log("Product JSON Response Saved In MongoDB Successfully !!!");
      res.status(200).json({
        message: "Product JSON Response Saved In MongoDB Successfully !!!",
        data: data,
      });
    }
  });
});

app.get("/generic-product", async (req, res) => {
  let arrayOfResponseObject = [];

  for (let i = 0; i < arrayOfProductJsons.length; i++) {
    let currentProductDetails = arrayOfProductJsons[i].product;

    let responseObj = {
      marketplace: "amazon",
      asin: currentProductDetails.asin,
      title: currentProductDetails.title,
      keywords: currentProductDetails.keywords,
      link: currentProductDetails.link,
      feature_bullets: currentProductDetails.feature_bullets,
      categories: currentProductDetails.categories,
      images: currentProductDetails.images,
      description: currentProductDetails.description,
      variants: currentProductDetails.variants || [],
      attributes: currentProductDetails.attributes,
      specifications: currentProductDetails?.specifications,
    };

    arrayOfResponseObject.push(responseObj);
  }

  genericProductModel.insertMany(arrayOfResponseObject, (error, data) => {
    // console.log("Array Of MongoDB Documents: ", data);

    // console.log("Length of Array Of MongoDB Documents: ", data.length);

    fs.writeFile("mongoDBresponse.json", JSON.stringify(data), (err) => {
      if (err) {
        throw err;
      }

      console.log("Array Of MongoDB Documents Is Saved In File");
    });

    res.status(200).send({
      message: "Products Saved In MongoDB Successfully",
      mongoDB_docements: data,
    });
  });
});

// let arrayOfProductAsins = [
//   { asin: "B07N2F3JXP" },
//   { asin: "B07K8MGPWJ" },
//   { asin: "B073JYC4XM" },
//   { asin: "B09MVZH5RB" },
//   { asin: "B01K1HPA60" },
//   { asin: "B08XZBFX6B" },
// ];

let arrayOfProductAsins = [
  "B09NSW34G8",
  "B017NPCSLI",
  "B08L5FM4JC",
  "B096VDR283",
  "B09V7G2V62",
  "B09DT4N454",
];

app.post("/product/map", (req, res) => {
  let inputObj = req.body;

  genericProductModel.find(
    {
      asin: { $in: arrayOfProductAsins },
    },
    (err, mongodbDocuments) => {
      if (err) {
        console.log(err);
      } else {
        console.log(mongodbDocuments.length);

        let outputObj = [];

        for (let i = 0; i < mongodbDocuments.length; i++) {
          let tempObj = {
            [inputObj.asin]: [mongodbDocuments[i].asin],
            [inputObj.title]: [mongodbDocuments[i].title],
            [inputObj.keywords]: [mongodbDocuments[i].keywords],
            [inputObj.link]: [mongodbDocuments[i].link],
            [inputObj.feature_bullets]: [mongodbDocuments[i].feature_bullets],
            [inputObj.categories]: [mongodbDocuments[i].categories],
            [inputObj.images]: [mongodbDocuments[i].images],
            [inputObj.variants]: [mongodbDocuments[i].variants],
            [inputObj.attributes]: [mongodbDocuments[i].attributes],
            [inputObj.specifications]: [mongodbDocuments[i].specifications],
          };

          outputObj.push(tempObj);
        }

        res.status(200).json({
          message: "Products Mapped Successfully !!!",
          mapped_products: outputObj,
        });
      }
    }
  );
});

//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
