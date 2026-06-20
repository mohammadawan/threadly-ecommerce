const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, webp) are allowed'));
  }
};

// Use memory storage — controllers pipe the buffer to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
