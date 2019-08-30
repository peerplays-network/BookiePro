// GUI Wallet only uses the apiEndpoints & faucetUrls entries. Do not add the rest if using the config for the GUI Wallet.

// When building for Alice, we have two faucets:
// PPY: https://faucet.peerplays.download/faucet (no funds given)
// BTFUN: https://btfun-faucet.bookie.download/faucet (BTF given on registration)
// Please replace the faucet under Alice with the correct one for your needs.

const config = {
  environments: {
    alice: {
      assetId: '1.3.1',
      apiEndpoints: [
        'wss://api.eifos.org', // eifos-witness
        'wss://api.ppy.us.altcap.io', // winner.winner.chicken.dinner
        'wss://api.ppy.nuevax.com', // nuevax
        'ws://18.184.122.253:8090', // phi-guy
        'wss://peerplaysblockchain.net/mainnet/api', // houdini-witness
        'wss://ppyseed.spacemx.tech', // spacecrypt-witness
        'wss://api.ppy.alex-pu.info', // alex-pu
        'wss://ip254.ip-91-121-48.eu', // melea-trust
        'wss://ppyws.roelandp.nl/ws', // roelandp
        'wss://api.ppy.blckchnd.com', // blckchnd
        'wss://pma.blockveritas.co/ws', // taconator-witness-wallet
        'wss://node.peerblock.trade:8090', // bitcoinsig
        'wss://api2.ppy.blckchnd.com/ws' // royal-flush
      ],
      faucetUrls: [
        'https://btfun-faucet.bookie.download/faucet'
      ],
      prefix: 'PPY',
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
    },
    beatrice: {
      assetId: '1.3.1',
      apiEndpoints: [
        'wss://api-beatrice01.eifos.org',
        'wss://testnet-ppyapi.spacemx.tech',
        'wss://api-testnet.ppy.alex-pu.info',
        'wss://api.ppy-beatrice.blckchnd.com',
        'wss://pta.blockveritas.co/ws',
        'wss://peerplaysblockchain.net/testnet/api',
        'wss://bnode2.peerblock.trade',
        'wss://test.phiguy.info/',
        'wss://api.ppytest.nuevax.com/ws'
      ],
      faucetUrls: ['https://beatrice-faucet.peerplays.download/faucet'],
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

let current = 'beatrice'; // Set the current default.

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
