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
const mappedProductModel = require("./database/models/mappedProduct");

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
      description: currentProductDetails.description
        ? currentProductDetails.description
        : null,
      variants: currentProductDetails.variants
        ? currentProductDetails.variants
        : null,
      attributes: currentProductDetails.attributes
        ? currentProductDetails.attributes
        : null,
      specifications: currentProductDetails.specifications,
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

app.get("/delete/generic-product", (req, res) => {
  genericProductModel.deleteMany({}).then((err) => {
    if (err) {
      console.log(err);
    }
    res.send("Product deleted");
  });
});

//# Mapping Products

/*
! Full Input Object

  {
    "client_id": "harsh@rubick.ai",
    "scrape_id": "#abcd",
    "#111": "title",
    "#222": "keywords",
    "#333": "link",
    "#444": "categories",
    "#555": "images",
    "#666": "description",
    "#777": "variants",
    "#888": "attributes",
    "#999": "specifications"
  }

! Half Input Object

  {
    "client_id": "harsh@rubick.ai",
    "scrape_id": "#abcd",
    "#111": "title",
    "#222": "keywords",
    "#333": "link",
    "#444": "categories"
  }
*/

let arrayOfProductAsins = [
  "B09NSW34G8",
  "B017NPCSLI",
  "B08L5FM4JC",
  "B096VDR283",
  "B09V7G2V62",
  "B09DT4N454",
];

let familyAttributes = [
  {
    attribute_id: "#111",
    attribute_name: "product_title",
    mandatory: true,
  },
  {
    attribute_id: "#222",
    attribute_name: "product_keywords",
    mandatory: true,
  },
  {
    attribute_id: "#333",
    attribute_name: "product_link",
    mandatory: true,
  },
  {
    attribute_id: "#444",
    attribute_name: "product_categories",
    mandatory: true,
  },
  {
    attribute_id: "#555",
    attribute_name: "product_images",
    mandatory: true,
  },
  {
    attribute_id: "#666",
    attribute_name: "product_description",
    mandatory: false,
  },
  {
    attribute_id: "#777",
    attribute_name: "product_variants",
    mandatory: false,
  },
  {
    attribute_id: "#888",
    attribute_name: "product_attributes",
    mandatory: false,
  },
  {
    attribute_id: "#999",
    attribute_name: "product_specifications",
    mandatory: true,
  },
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

        let mappedAttributes = [];
        for (let i = 0; i < mongodbDocuments.length; i++) {
          let currMongodbDocument = mongodbDocuments[i];

          for (let i = 0; i < familyAttributes.length; i++) {
            let tempObj = {};

            let currentAttributeId = familyAttributes[i].attribute_id;

            tempObj.attribute_id = currentAttributeId;
            tempObj.attribute_name = familyAttributes[i].attribute_name;

            if (inputObj.hasOwnProperty([currentAttributeId])) {
              let currAttributeMappedValue = inputObj[currentAttributeId];

              tempObj.attribute_value =
                currMongodbDocument[currAttributeMappedValue];
            } else {
              tempObj.attribute_value = null;
            }

            // console.log("tempObj: ", tempObj);

            mappedAttributes.push(tempObj);
          }

          let dataToSave = {};
          dataToSave.asin = currMongodbDocument.asin;
          dataToSave.client_id = inputObj.client_id;
          dataToSave.scrape_id = inputObj.scrape_id;
          dataToSave.mapped_attributes = mappedAttributes;

          outputObj.push(dataToSave);
        }

        mappedProductModel.insertMany(outputObj, (err, data) => {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.status(200).json({
              message: "Products Mapped Successfully !!!",
              mapped_products: outputObj,
            });
          }
        });
      }
    }
  );
});

//! Starting Server
app.listen(PORT, function () {
  console.log(`Server Running on PORT :: ${PORT}`);
});
