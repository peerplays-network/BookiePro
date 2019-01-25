module.exports = require('./webpack.config')({
  prod: false,
  blockchain: 'wss://595-dev-blockchain.pixelplex.by/ws',
  faucetFile: 'faucetUrls_devnet'
});
