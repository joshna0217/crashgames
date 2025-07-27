const axios = require('axios');

let cache = {};
let lastFetched = 0;

async function getCryptoPrice(symbol) {
  const now = Date.now();
  if (cache[symbol] && now - lastFetched < 10000) {
    return cache[symbol];
  }

  const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
  cache = {
    BTC: res.data.bitcoin.usd,
    ETH: res.data.ethereum.usd
  };
  lastFetched = now;
  return cache[symbol];
}

module.exports = { getCryptoPrice };
