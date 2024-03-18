const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { createSecretToken } = require("../config/secretToken");

const auth = require("../middleware.js")

const users = require("../models/user")


router.get("/", (req,res) =>{
    res.send("user route called")
})


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


//Sign up


router.post("/register", async (req,res, next) =>{
    let {name, email, password} = req.body;
    if(!emailRegex.test(email)){
        res.json({ emailError: "Email is not in the right format" }).status(400);
    }else if(!passwordRegex.test(password)){
        res.json({ 
            passwordError: "Password must be at least 8 characters long and contain at least one digit, one letter, and one special character" ,
            password}).status(400);
    }else{
        const existingUser = await users.findOne({email})
        if (existingUser) {
            return res.json({msg: "Failed! User already Exists"}).status(400)
          }   
        const user = await users.create({ email, password,name, created_at: Date.now(), isVerified: false,});  
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
          withCredentials: true,
          httpOnly: false,
        });
        res
          .status(201)
          .json({ message: "User Created in successfully", success: true, user });
        next();

    }
    
})


//Sign in
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ msg: "Incorrect password" });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(200).json({ message: "User logged in successfully", success: true, user });
    } catch (err) {
        console.error("Error occurred during login:", err);
        res.status(500).json({ msg: "An error occurred during login" });
    }
});


router.post("/profile", auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, address, phone, date_of_birth, avatar } = req.body;

        if (username) {
            const existingUsername = await users.findOne({ username });
            if (existingUsername && existingUsername.id !== userId) {
                return res.status(400).json({ msg: "Username already exists" });
            }
        }
        if (phone) {
            const existingPhone = await users.findOne({ phone });
            if (existingPhone && existingPhone.id !== userId) {
                return res.status(400).json({ msg: "Phone number already exists" });
            }
        }

        // Update user profile
        const updatedUser = {
            username,
            address,
            phone,
            date_of_birth,
            avatar
        };

        const updatedUserProfile = await users.findByIdAndUpdate(userId, updatedUser, { new: true });

        if (!updatedUserProfile) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "Profile updated successfully", user: updatedUserProfile });
    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ msg: "An error occurred during profile update" });
    }
});

router.delete("/profile", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const deletedUser = await users.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.clearCookie("token");

        res.status(200).json({ msg: "Profile deleted successfully" });
    } catch (err) {
        console.error("Error deleting user profile:", err);
        res.status(500).json({ msg: "An error occurred during profile deletion" });
    }
});

router.post("/logout",auth, (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ msg: "Logout successful" });
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ msg: "An error occurred during logout" });
    }
});



module.exports =router;