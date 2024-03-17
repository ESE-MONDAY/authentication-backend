const router = require("express").Router();
const bcrypt = require("bcryptjs")

const users = require("../models/user")


router.get("/", (req,res) =>{
    res.send("user route called")
})


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


//Sign up


router.post("/register", (req,res) =>{
    let {name, email, password} = req.body;
    if(name && email && password){
        name = name.trim();
        email = email.trim();
        password = password.trim();
    }
    
    if (name === "" || email === "" || password === "") {
        let response = {};
    
        if (name === "") {
            response.nameError = "Name is required";
        }
        if (email === "") {
            response.emailError = "Email is required";
        }
        if (password === "") {
            response.passwordError = "Password is required";
        }
    
        res.json(response).status(400);
    }else if(!emailRegex.test(email)){
        res.json({ emailError: "Email is not in the right format" }).status(400);
    }else if(!passwordRegex.test(password)){
        res.json({ 
            passwordError: "Password must be at least 8 characters long and contain at least one digit, one letter, and one special character" ,
            password}).status(400);
    }else if(!name.length > 5){
        res.json({nameError: "name too short"}).status(400)
    }else{
        users.find({email}).then(result => {
            if(result.length){
                res.json({msg: "Failed! User already Exists"}).status(40)

            }else{
           
                bcrypt.hash(password, 10).then(encryptedPassword =>{
                    const newUser = new users({
                        name: name,
                        email: email,
                        password: encryptedPassword 
                    })
                    newUser.save().then(result =>{
                        res.json({
                            msg: "User created Successfully",
                            data: result
                        }).status(200)


                    }).catch(err => {
                        console.error("error creating user" + err)
                        res.json({
                            msg: "Error creating user account"
                        }).status(500)
                    })

                }).catch(err =>{
                    console.error(err)
                    res.json({
                        msg: "Service Failed try again later"
                    }).status(500)
                })
            }

        }).catch(err =>{
            console.err(err);
            res.json({msg: "An err occured while checking user status"}).status(500)
        })

    }
    
})


//Sign in
router.post("/login", (req,res) =>{
    let {email, password} = req.body;
    email.trim()
    password.trim()
    if( email == "" || password == ""){
        let response = {};
        if (email === "") {
            response.emailError = "Email is required";
        }
        if (password === "") {
            response.passwordError = "Password is required";
        }
        
    res.json(response);
    }else{
        users.find({email}).then(data => {
            if(data){
                const hashedPassword = data[0].password
                bcrypt.compare(password, hashedPassword).then(result => {
                    if(result){
                        res.json({
                            msg: "Login Successful",
                            data: {
                                name: data[0].name,
                                email: data[0].email
                            }
                        }).status(200)

                    }else{
                        res.json({
                            msg: "Incorrect Password",
                        }).status(400)

                    }

                }).catch(err => {
                    res.json({msg: "An error occures in password validation" }).json(400) 
                })
            }

        }).catch(err =>{
            res.json({msg: "An error occured, couldn't find user with that credential" }).json(500)
        })
    }
})

module.exports =router;