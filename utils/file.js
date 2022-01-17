const fs = require("fs");
const multer = require("multer");

exports.fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

exports.fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (!err) {
      return console.log("Deleted File");
    }
    console.log("File didn't delete");
  });
};
