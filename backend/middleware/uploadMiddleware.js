const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storagePro = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => `product-${Date.now()}`,
  },
});
const upload = multer({ storage: storagePro });

const storagCat = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'categorie-images',
    format: async (req, file) => 'png',
    public_id: (req, file) => `product-${Date.now()}`,
  },
});
const uploadCat = multer({ storage: storagCat });

module.exports = { upload, uploadCat };
