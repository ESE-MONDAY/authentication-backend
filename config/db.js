require("dotenv").config(); 
const mongoose = require("mongoose")


exports.connect = () => {
    mongoose
    .connect(process.env.MONGODB_URI, {
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });

}
