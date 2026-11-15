const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const { saveUploadedImage } = require('../config/images');

const { UPLOADS_DIR: uploadsDir } = require('../config/paths');

const SECTION_IMAGE_FIELDS = ['lifestyle_image', 'story_image', 'workshop_image'];

const storage = multer.memoryStorage();

const heroUpload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.fieldname === 'images' || SECTION_IMAGE_FIELDS.includes(file.fieldname)) {
      if (/^image\/(jpeg|png|webp)$/.test(file.mimetype)) return cb(null, true);
      return cb(new Error('Slike moraju biti JPG, PNG ili WEBP.'));
    }
    if (file.fieldname === 'video') {
      if (/^video\/(mp4|webm)$/.test(file.mimetype)) return cb(null, true);
      return cb(new Error('Video mora biti MP4 ili WEBM.'));
    }
    cb(new Error('Nepoznato polje za upload.'));
  }
});

// Slike se resize-uju/kompresuju kao i kod proizvoda; video se samo cuva
// (bez transkodovanja - browser servira original, pa preporucujemo vec
// kompresovan MP4/WEBM fajl na uploadu).
async function processHeroUploads(req, res, next) {
  try {
    req.uploadedHeroImages = [];
    req.uploadedHeroVideo = null;
    req.uploadedSectionImages = {};

    const files = req.files || {};

    for (const field of SECTION_IMAGE_FIELDS) {
      if (files[field] && files[field].length) {
        const file = files[field][0];
        const filename = await saveUploadedImage(file.buffer, uploadsDir);
        req.uploadedSectionImages[field] = `/uploads/${filename}`;
      }
    }

    if (files.images && files.images.length) {
      for (const file of files.images) {
        const filename = await saveUploadedImage(file.buffer, uploadsDir);
        req.uploadedHeroImages.push(`/uploads/${filename}`);
      }
    }

    if (files.video && files.video.length) {
      const file = files.video[0];
      const ext = file.mimetype === 'video/webm' ? 'webm' : 'mp4';
      const filename = `hero-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
      const outPath = path.join(uploadsDir, filename);
      fs.writeFileSync(outPath, file.buffer);
      req.uploadedHeroVideo = `/uploads/${filename}`;
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { heroUpload, processHeroUploads };
