const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'threadly/products', transformation: [{ width: 800, height: 800, crop: 'limit' }], ...options },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const deleteFromCloudinary = (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
