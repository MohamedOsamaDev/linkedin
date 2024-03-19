const uuid = require("uuid");
const multer = require("multer");

 const Upload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "../../public/uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, uuid.v4() + "-" + file.originalname);
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  const upload = multer({
    storage,
    fileFilter,
    // limits: { fileSize: 100000 /* bytes */ },
  });
  return upload;
};
const fileUploadSingle = (feildname) => Upload().single(feildname);
const fileUploadArray = (array) => Upload().array(array);
const fileUploadfields = (fields) => Upload().fields(fields);
module.exports = {
    Upload,
  fileUploadSingle,
  fileUploadArray,
  fileUploadfields,
};
