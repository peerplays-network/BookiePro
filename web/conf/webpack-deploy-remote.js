module.exports = require("./webpack.config")({
	prod: true,
	blockchain: "wss://testblockchain317.peerplays.host/ws",
	faucet: "https://testfaucet317.peerplays.host",
	faucetFile: "faucetUrls_testnet317"
});
