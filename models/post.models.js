const slugify = require("slugify");
const moment = require("moment")

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    admin_user : {
        type : String
    },
    post_title: {
        type: String
    },
    post_category: {
        type: String,
        default : ''
    },
    post_subCategory : Array,

    meta_description: {
        type: String
    },
    post_link:{ type : String, default : ""},

    Image: {
        type: String
    },
    author: {
        type: String
    },
    schedule_time: {
        type: String,
    },
    post_description: {
        type: String
    },
    post_like: {
        type: Number,
        default : 0
    },
  
    post_save : {
        type : Number,
        default : 0
    },
    post_comment: [{
        uId: { type: Schema.Types.ObjectId },
        comment: { type: String },
        u_name: { type: String },
        u_image: { type: String, default: '' }
    }],
    post_avgTime: {
        type: Number,
        default  : 0
    },
    viewCount: {
        type: Number
    },
    visibility: {
        type: String,
        default: false
    },
    likeStatus : {
        type : Boolean
    },
    shareCount: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: { currentTime: () =>moment().utcOffset("+05:30").format("MM DD YYYY hh:mm:ss a") },
    versionKey: false
  });

  postSchema.pre('validate', function (next) {
    // console.log("slug" + this.blog_link)
    if (this.post_title) {
      console.log("yes")
      this.slug = slugify(this.post_title, { lower: true, strict: true })
      // this.blog_link = `http://161.97.160.215:3000/blog/${this.blog_category}/${this.slug}`
    //   console.log(this.blog_link)
    }
  
    next()
  })

module.exports = mongoose.model("post", postSchema);