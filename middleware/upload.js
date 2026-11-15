const multer = require('multer');
const { saveUploadedImage } = require('../config/images');

const { UPLOADS_DIR: uploadsDir } = require('../config/paths');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Dozvoljene su samo JPG, PNG ili WEBP slike.'));
    }
  }
});

// Nakon multer memoryStorage-a slike se smanjuju i snimaju kao WebP (velika
// + mala verzija), pa se dodaje req.uploadedImages = [imena fajlova].
async function processUploadedImages(req, res, next) {
  if (!req.files || req.files.length === 0) {
    req.uploadedImages = [];
    return next();
  }
  try {
    const results = [];
    for (const file of req.files) {
      results.push(await saveUploadedImage(file.buffer, uploadsDir));
    }
    req.uploadedImages = results;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, processUploadedImages };
