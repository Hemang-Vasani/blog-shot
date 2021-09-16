 

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    f_name: {
        type: String
    },
    l_name: {
        type: String
    },
    category: { type: Array, default: [] },

    liked: [{ type: Schema.Types.ObjectId, default: [] }],

    saved :[{ type: Schema.Types.ObjectId, default: [] }],
    
    history : {type : Array , default : []},

    post_tag: [{tag : {type : String}, count : {type : Number, default : 0}}],

    post_time : [{pId : {type : String}, time : {type : Number , default : 0}}],

    google_id: String,

    facebook_id: String,

    email: String,

    password: String,

    gender: String,

    age: String,

    user_image: String,

    deviceId: String
}, {
    versionKey: false
})

module.exports = mongoose.model("user", userSchema);