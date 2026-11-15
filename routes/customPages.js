// Stranice napravljene u adminu (Stranice > Nova stranica), npr. /nova-kolekcija.
// Ruta je posljednja prije 404, pa nikad ne zaklanja postojece stranice sajta.
const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { prepareBlocks, smallOf } = require('../config/pageRender');

async function renderPage(res, page, extra = {}) {
  const { blocks, categories } = await prepareBlocks(page.blocks);
  const firstImage = page.blocks.map((b) => b.image || b.src || (b.images && b.images[0])).find((s) => s && !s.endsWith('.mp4') && !s.endsWith('.webm'));
  res.render('page', {
    title: `${page.title} - Boa Belts`,
    description: page.description || `${page.title} - Boa Belts, ručno rađeni kožni kaiševi, torbe i novčanici iz Travnika.`,
    ogImage: firstImage,
    page,
    blocks,
    categories,
    smallOf,
    showTitle: !(blocks[0] && blocks[0].type === 'banner' && blocks[0].image),
    ...extra
  });
}

router.get('/:slug', async (req, res, next) => {
  try {
    const page = Page.findPublished(req.params.slug);
    if (!page) return next();
    await renderPage(res, page);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
module.exports.renderPage = renderPage;
