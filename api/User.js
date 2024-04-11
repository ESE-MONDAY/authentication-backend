const router = require("express").Router();
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const { createSecretToken } = require("../config/secretToken");
const auth = require("../middleware.js")
const users = require("../models/user")
const Wallet = require("../models/wallet")

const generateWallet = require("../config/generateSolanaWallet");
const sendVerificationEmail = require("../config/sendVerificaionEmail");


router.get("/", (req,res) =>{
    res.send("user route called")
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;


function generateUniqueUsername(name, email) {
    const parts = email.split("@");
    const username = parts[0];
    return username;
}



//Sign up
router.post("/register", async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({ error: "All fields are required" });
        }
        const username = generateUniqueUsername(name, email);

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email is not in the right format" });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: "Password must meet requirements" });
        }

        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await users.create({
            name,
            email:email.toLowerCase(),
            password: hashedPassword,
            username,
            created_at: Date.now(),
            isVerified: false,
        });

        // Create wallet for the user
        const walletInfo = await generateWallet();

        // Create wallet document
        const hashedPrivateKey = await bcrypt.hash(walletInfo.privateKey, 10);
        const wallet = new Wallet({
            address: walletInfo.publicKey,
            privateKey: hashedPrivateKey,
            userId: user._id, 
        });
        await wallet.save();

        // Update user with wallet details
        user.wallet = wallet._id;
        user.walletaddress = wallet.address;
        await user.save();

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
        });

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//Sign in
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });

        if (!user) {
            return res.status(401).json({ msg: "Incorrect email or password" });
        } 
       const auth = bcrypt.compareSync(password, user.password);
        if (!auth) {
            return res.status(401).json({ msg: "Incorrect password", ss:password, us:user.password});
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

// Update user profile
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
// Delete user profile
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
// Logout
router.post("/logout",auth, (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ msg: "Logout successful" });
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ msg: "An error occurred during logout" });
    }
});






// Generate JWT token
function generateVerificationToken(email) {
    return jwt.sign(email, process.env.TOKEN_KEY); // Token expires in 1 hour
  }



const verificationTokens = {};

// Function to save verification token
const saveVerificationToken = (email, token) => {
    verificationTokens[email] = token;
};
const getVerificationToken = (email) => {
    return verificationTokens[email];
};

// Function to clear verification token
const clearVerificationToken = (email) => {
    delete verificationTokens[email];
};


// Route to send verification email
router.post('/verify', async (req, res) => {
    try {
        const { email} = req.body;

        // Send verification email
       
        await sendVerificationEmail(email);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





module.exports =router;