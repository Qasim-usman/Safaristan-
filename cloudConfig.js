const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET   // ✅ fixed spelling
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Safaristan",
        allowedformat: ["png", "jpg", "jpeg"], // supports promises as well
    },
});

module.exports = {
    storage,
    cloudinary
};
