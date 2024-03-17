const express = require("express");
const uuid = require("uuid");
// Port SetUp
const port = process.env.port || 4000
//Server
const app = express();
require("./config/db").connect()




// For accepting form data

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.listen(port,() =>{
    console.log("Server running on port " + port )
})

const userRouter = require("./api/User")
app.use("/user", userRouter)







