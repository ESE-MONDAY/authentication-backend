const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
    name: String,
    email: String,
    // username: String,
    password: String,
    // date_of_birth: String

})


const Users = mongoose.model("Users", userSchema)
module.exports = Users