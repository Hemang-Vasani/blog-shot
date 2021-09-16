const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");


aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ID,
    // region: "us-east-2",
});
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  console.log("in filter"+JSON.stringify(req.file));

  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter : fileFilter,
  storage: multerS3({
    acl: "public-read",
  s3,
  bucket: process.env.AWS_BUCKET_CAT_NAME,
  metadata: function (req, file, cb) {
    console.log("field name "+ file.fieldname)
    cb(null, { fieldName: "image" });
  },
  key: function (req, file, cb) {   
    cb(null, Date.now().toString() + "." + file.mimetype.split("/")[1]);
  }
})
})

module.exports = upload;

