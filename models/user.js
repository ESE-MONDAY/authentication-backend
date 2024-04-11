const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const schema = mongoose.Schema;



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Your email is required"],
        trim: true,
        unique: true,
    },
    username:{
        type: String,
        trim: true,
    },
    role:{
        type: String,
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    date_of_birth:{
        type: Date,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    created_at:{
        type: Date,
        default: Date.now,
    },
    walletaddress: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        required: true
    },
    isSpeaker: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallets'
      },
      conferencesOrganized: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Conference'
        }
      ]


})


const Users = mongoose.model("Users", userSchema)
module.exports = Users