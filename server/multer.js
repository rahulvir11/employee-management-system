const multer=require('multer');
const path = require('path')
const {v4:uuidv4}=require('uuid');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      const unique = uuidv4();
      cb(null, unique + path.extname(file.originalname));
    }
  })
  const fileFilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png"];
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new Error("Only .jpg or .png files are allowed"), false);
    }
    cb(null, true);
  };
  const upload = multer({ storage: storage ,fileFilter})
  module.exports=upload;