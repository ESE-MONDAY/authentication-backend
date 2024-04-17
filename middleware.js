const users = require("./models/user")
require("dotenv").config()
const jsonwebtoken = require("jsonwebtoken");

const authPath = (req,res,next) =>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({msg: "Unauthorized User"})
    }else{
        jsonwebtoken.verify(token, process.env.TOKEN_KEY, async(err, data) =>{
            if(err){
                return res.status(403).json({msg: "Forbidden"})
            }else{
                const user = await users.findById(data.id)
                if(!user){
                    return res.status(401).json({msg: "Not found"})
                }else{
                    req.user = user;
                    next();
                }     
            }
        })
    }
}

module.exports = authPath;