

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminUserSchema = new Schema({
    user_name: {
        type: String
    },
    email: String,

    password: String,
    
    posts:{type :Array, default : []}
}, {
    versionKey: false
})

module.exports = mongoose.model("adminUser", adminUserSchema);