
const moment = require("moment")

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const catSchema = new Schema({
    name: {
        type: String
    },
    image  : {
        type : String
    },
    follower: {
        type: Number,
        default : 0
    }
}, {
    timestamps: { currentTime: () =>moment().utcOffset("+05:30").format("MM DD YYYY hh:mm:ss a") },
    versionKey: false
  });


  const subCatSchema = new Schema({
    name: {
        type: String
    },
    // image  : {
    //     type : String
    // },
    // follower: {
    //     type: Number,
    //     default : 0
    // }
}, {
    timestamps: { currentTime: () =>moment().utcOffset("+05:30").format("MM DD YYYY hh:mm:ss a") },
    versionKey: false
  });

  const catModel = mongoose.model("category", catSchema)
  const subCatModel = mongoose.model("sub_category", subCatSchema)
  
  module.exports = {
    catModel,
    subCatModel
  }