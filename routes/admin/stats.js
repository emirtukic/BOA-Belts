const express = require('express');
const router = express.Router();
const { computeStats, humanDay } = require('../../config/stats');

router.get('/', (req, res) => {
  res.render('admin/stats', { title: 'Statistika - Admin', stats: computeStats(req.query), humanDay });
});

module.exports = router;
