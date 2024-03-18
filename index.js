const express = require("express");
const uuid = require("uuid");
const cors = require("cors")
const cookieParser = require("cookie-parser");
// Port SetUp
const port = process.env.port || 4000
//Server
const app = express();
require("./config/db").connect()




// For accepting form data
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(
    cors({
      origin: ["http://localhost:4000"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.listen(port,() =>{
    console.log("Server running on port " + port )
})


const userRouter = require("./api/User")
app.use("/user", userRouter)







