const express = require('express');
const router = express.Router();
const { removeUploadedFile } = require('../../config/paths');
const Hero = require('../../models/Hero');
const HomeSections = require('../../models/HomeSections');
const { heroUpload, processHeroUploads } = require('../../middleware/heroUpload');

router.get('/pocetna', (req, res) => {
  res.render('admin/hero/form', {
    title: 'Početna stranica - Admin',
    hero: Hero.get(),
    sections: HomeSections.getAll()
  });
});

router.post(
  '/pocetna',
  heroUpload.fields([
    { name: 'images', maxCount: 12 },
    { name: 'video', maxCount: 1 },
    { name: 'lifestyle_image', maxCount: 1 },
    { name: 'story_image', maxCount: 1 }
  ]),
  processHeroUploads,
  (req, res) => {
    const current = Hero.get();

    const keepImages = Array.isArray(req.body.keepImages)
      ? req.body.keepImages
      : req.body.keepImages
      ? [req.body.keepImages]
      : [];

    current.images.filter((img) => !keepImages.includes(img)).forEach(removeUploadedFile);

    const images = [...keepImages, ...req.uploadedHeroImages];

    let video_url = current.video_url;
    if (req.uploadedHeroVideo) {
      removeUploadedFile(video_url);
      video_url = req.uploadedHeroVideo;
    } else if (req.body.removeVideo === '1') {
      removeUploadedFile(video_url);
      video_url = '';
    }

    Hero.save({
      eyebrow: req.body.eyebrow || '',
      heading: req.body.heading || '',
      text: req.body.text || '',
      cta_text: req.body.cta_text || '',
      media_type: req.body.media_type === 'video' ? 'video' : 'images',
      images,
      video_url
    });

    HomeSections.SECTION_KEYS.forEach((key) => {
      const currentSection = HomeSections.get(key);
      const uploadedImage = req.uploadedSectionImages[`${key}_image`];
      let image = currentSection.image;
      if (uploadedImage) {
        removeUploadedFile(image);
        image = uploadedImage;
      }
      HomeSections.save(key, {
        image,
        eyebrow: req.body[`${key}_eyebrow`] || '',
        heading: req.body[`${key}_heading`] || '',
        text: req.body[`${key}_text`] || '',
        cta_text: req.body[`${key}_cta_text`] || '',
        cta_link: req.body[`${key}_cta_link`] || ''
      });
    });

    req.flash('success', 'Početna stranica je ažurirana.');
    res.redirect('/admin/pocetna');
  }
);

module.exports = router;
