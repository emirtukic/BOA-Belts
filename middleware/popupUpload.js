const multer = require('multer');
const { saveUploadedImage } = require('../config/images');

const { UPLOADS_DIR } = require('../config/paths');

const storage = multer.memoryStorage();

const popupUpload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error('Slika mora biti JPG, PNG ili WEBP.'));
  }
});

async function processPopupUpload(req, res, next) {
  try {
    req.uploadedPopupImage = null;
    if (req.file) {
      const filename = await saveUploadedImage(req.file.buffer, UPLOADS_DIR, { width: 900, quality: 82 });
      req.uploadedPopupImage = `/uploads/${filename}`;
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { popupUpload, processPopupUpload };
