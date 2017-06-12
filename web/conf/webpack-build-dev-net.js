module.exports = require("./webpack.config")({
	prod: true,
	blockchain: "wss://595-dev-blockchain.pixelplex.by/ws",
	faucetFile: 'faucetUrls_devnet',
	electron: false
});
