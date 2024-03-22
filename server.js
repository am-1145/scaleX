const express = require('express');
const connectDB = require('./config/db'); 
const assetRoutes = require('./routes/assetDataRoutes');
const cors = require('cors');
const axios = require('axios');
const dotenv=require('dotenv')
const app = express();
dotenv.config()
connectDB(); 
const Asset=require('./models/assetData')
app.use(cors()); 
app.use(express.json());

app.use('/api/assets', assetRoutes); 

const PORT = process.env.PORT || 5000; 

// Function to fetch and store Dexscreener data
const fetchAndStoreAssetData = async (tokenAddress) => {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;

  try {
    const { data } = await axios.get(url);

    data.pairs.forEach(async (pair) => {
      const record = {
        tokenAddress,
        dexId: pair.dexId,
        quoteToken: pair.quoteToken.symbol,
        priceUSD: pair.priceUsd,
        volumeUSD: pair.volume.h24, 
        timestamp: Date.now()
      };

      await Asset.findOneAndUpdate(
        { tokenAddress },
        { $push: { priceData: record } }, 
        { upsert: true }
      ); 
    });  

  } catch (err) {
    console.error('Error fetching or storing data:', err.message);
  }
};

// Update data initially and periodically
fetchAndStoreAssetData('inj19dtllzcquads0hu3ykda9m58llupksqwekkfnw'); 
setInterval(() => {
  fetchAndStoreAssetData('inj19dtllzcquads0hu3ykda9m58llupksqwekkfnw');
}, 60 * 1000); // Update every minute 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
