const express = require('express')
const dotenv = require("dotenv").config()
const response = require("./response.json");

const db = require("./database/index")
const memorycardModel = require("./database/models/memoryCard")

db.init()

const PORT = 8000
const app = express()

app.listen(PORT,()=>{
    console.log("server is running on "+PORT)
})

app.get("/",(req,res)=>{
    let myProduct = response.product
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

    memorycardModel.create(memoryObj,(err,data)=>{
        if(err){
            res.json({error:err,message:"Duplicate ASIN"})
            console.log("Error occurred",err)
        }
        else{
            res.json({data:memoryObj,message:"Data Saved In MongoDB Successfully !!!"})
            console.log("Data saved successfully")
        }
    })

})
