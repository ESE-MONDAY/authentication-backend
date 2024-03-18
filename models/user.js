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
    password: {
        type: String,
        required: [true, "Your password is required"],
        trim: true,
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


})

userSchema.pre("save", async function () {
    this.password = await bcrypt.hash(this.password, 12);
  });


const Users = mongoose.model("Users", userSchema)
module.exports = Users