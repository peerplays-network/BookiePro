const config = {
  environments: {
    beatrice: {
      assetId: '1.3.1',
      apiEndpoints: [
        'wss://pta.blockveritas.co:8089', // taconator-witness
        'wss://bnode2.peerblock.trade', // bitcoinsig-test
        'wss://api.ppytest.nuevax.com', // nuevax-test
        'wss://api.ppy-beatrice.blckchnd.com', // blckchnd-testnet
        'wss://ip100.ip-54-37-165.eu/', // melea-witness
        'wss://api.test.ppy.us.altcap.io', // winner.winner.chicken.dinner
        'wss://peerplaysblockchain.net/testnet/api', // houdini-witness
        'wss://api-beatrice01.eifos.org' // eifos-witness
      ],
      faucetUrls: ['https://pbsa-beatrice-faucet.blockchainprojectsbv.com'],
      prefix: 'TEST',
      accounts: {
        broadcasts: {
          name: 'pbsa-broadcasts',
          key: 'PPYTEST8H4L2UeaXRRAt5nVR4GSGFdt232711wyzTQnFRJeoJeLXXZT23'
        },
        updates: {
          name: 'bookie-updates',
          key: '5Kjqz8HwRBCW7ZtvhmM2NhAqaPpLQvBShKjVNcKdbm8gdXi5V3J'
        }
      }
    }
  }
};

let current = 'beatrice'; // Set the current to elizabeth by default.

// Check to make sure a valid target is specified.
if (process.env && process.env.TARGET && config.environments[process.env.TARGET]) {
  current = process.env.TARGET;
  console.log(`Environment defined as ${current}`);
} else if (!process.env.TARGET) {
  console.warn(`Environment was not defined, using default. (${current})`);
} else if (!config.environments[process.env.TARGET]) {
  console.warn(`Environment supplied is invalid, using default. (${current})`);
}

// Export the current config with the additional name property.
module.exports = Object.assign(config.environments[current], {
  name: current
});
