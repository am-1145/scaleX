const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  tokenAddress: {
    type: String,
    required: true,
    unique: true
  },
  priceData: [{
    dexId: String,
    quoteToken: String,
    priceUSD: Number,
    volumeUSD: Number,
    timestamp: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Asset', AssetSchema); 
