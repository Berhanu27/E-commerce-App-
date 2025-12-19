import multer from "multer";
import path from "path";

// Set storage destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files in 'uploads' folder inside backend
    cb(null, path.join('uploads'));
  },
  filename: function (req, file, cb) {
    // Use original filename or you can customize
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with storage
const upload = multer({ storage });

export default upload;
