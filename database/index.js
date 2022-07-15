module.exports.init = function () {
  const mongoose = require("mongoose");

  mongoose
    .connect(process.env.MONGODB_URL)
    .then(function () {
      console.log("DB is Connected !!!");
    })
    .catch(function () {
      console.log("Error in DB Connection");
    });
};
