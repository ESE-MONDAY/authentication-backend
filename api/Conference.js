const router = require("express").Router();
const Conferences = require("../models/conference")
const auth = require("../middleware.js")

router.get("/", (req,res) =>{
    res.send("conference route called")
})




module.exports =router;