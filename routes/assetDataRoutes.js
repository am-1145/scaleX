const express = require('express');
const router = express.Router();
const Asset = require('../models/assetData'); 

// @route   GET /api/assets/:tokenAddress/price
// @desc    Get price data for an asset
router.get('/:tokenAddress/price', async (req, res) => {
  try {
    const asset = await Asset.findOne({ tokenAddress: req.params.tokenAddress });
    if (!asset) return res.status(404).json({ msg: 'Asset not found' });

    res.json(asset.priceData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
